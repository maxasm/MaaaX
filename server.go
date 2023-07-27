package main

import (
	"encoding/json"
	"fmt"
	"github.com/labstack/echo/v4"
	"io"
	"net/http"
	"os"
	"time"
)

// TODO: mimic email sending verification codes
// TODO: implement password reset and email verification
const PORT = 8080

// serve single-page applications
func handleSPA(c echo.Context) error {
	// get the route of the requested file
	rpath := c.Request().URL.Path
	// base path
	base := "./client/dist"

	if rpath == "/" {
		rpath = "/index.html"
	}

	// append base to the path
	rpath = base + rpath

	// check if the file exists
	_, err_stat := os.Stat(rpath)

	if err_stat != nil && os.IsNotExist(err_stat) {
		// the requested file does not exist -> serve index.html to handle the routing
		rpath = base + "/index.html"
	}

	eventLogger.Printf("GET serving -> %s\n", rpath)

	// serve the requested file
	err_f := c.File(rpath)

	if err_f != nil {
		errorLogger.Printf("%s\n", err_f)
		c.NoContent(http.StatusInternalServerError)
		return nil
	}
	return nil
}

func handleUserSignup(c echo.Context) error {
	data, err_data := io.ReadAll(c.Request().Body)
	if err_data != nil {
		errorLogger.Printf("%s\n", err_data)
		return nil
	}

	user, err_create_user := createNewUser(data)

	if err_create_user != nil {
		errorLogger.Printf("Error creating new user -> %s\n", err_create_user)
		c.NoContent(http.StatusInternalServerError)
		return nil
	}

	// check if a user with the same username exists
	if !isUsernameUnique(user) {
		c.NoContent(http.StatusConflict)
		return nil
	}

	// add the user to the database
	if err_add_user := addUser(user); err_add_user != nil {
		c.NoContent(http.StatusInternalServerError)
		errorLogger.Printf("error adding user to the database\n", err_add_user)
		return err_add_user
	}

	debugLogger.Printf("created new user:\n %s", indentJSON(*user))
		
	// TODO: send the following link to email 
	debugLogger.Printf("email verfication code for user %s is %s\n", user.Username, user.Code)
	c.String(http.StatusOK, fmt.Sprintf(`/verifyemail/%s/%s`, user.Role, user.ID))
	return nil
}


// TODO: check if the user has verrified the email if not -> /validateemail
func handleUserLogin(c echo.Context) error {
	// read the request body
	data, err_data := io.ReadAll(c.Request().Body)
	if err_data != nil {
		errorLogger.Printf("error reading request body: %s\n", err_data)
		c.NoContent(http.StatusInternalServerError)
		return nil
	}

	user := &User{}

	if err_user := json.Unmarshal(data, user); err_user != nil {
		errorLogger.Printf("error on json.Unmarhsal(): %s\n", err_user)
		c.NoContent(http.StatusInternalServerError)
		return nil
	}

	debugLogger.Printf("log in request from '%s' with role '%s'\n", user.Username, user.Role)
	// get user using ID
	db_user := getUserFromUsername(user)

	if db_user != nil {
		// check if the password's match
		if compareHash(db_user.Password, user.Password) {
			// remember login by sending JWT
			if user.RememberLogin {
				err_gen_jwt := sendJWT(&c, db_user, time.Minute*10)
				if err_gen_jwt != nil {
					c.NoContent(http.StatusInternalServerError)
					return nil
				}
			}

			debugLogger.Printf("user '%s' successfull login\n", user.Username)
			// redirect to the following URL if succesffully logged in
			redirectURL := fmt.Sprintf("/vaidateemail/%s/%s", db_user.Role, db_user.ID)
			c.String(http.StatusOK, redirectURL)
			return nil
		}
	}

	debugLogger.Printf("user '%s' failed to log in successfully\n", user.Username)
	c.NoContent(http.StatusUnauthorized)
	return nil
}

// TODO: refactor and break up code
func handleGetUserData(c echo.Context) error {
	// check if the user is authenticated
	req_user := validateRequest(c)

	if req_user == nil {
		c.NoContent(http.StatusUnauthorized)
		return nil
	}

	// check if a user with the given 'username' and 'role'
	user := getUserFromID(&User{
		ID:   req_user.UserID,
		Role: req_user.UserRole,
	})

	// if the user does not exist in the database
	if user == nil {
		c.NoContent(http.StatusUnauthorized)
		return nil
	}

	// hide the Password
	user.Password = ""

	// auto renew the token
	autoRenewToken(c, req_user)

	// convert the user data as JSON
	user_as_json, err_user_as_json := json.Marshal(user)

	if err_user_as_json != nil {
		errorLogger.Printf("error converting type user to JSON string\n")
		c.NoContent(http.StatusInternalServerError)
		return nil
	}

	user_as_json_str := string(user_as_json)
	c.JSON(http.StatusOK, user_as_json_str)
	return nil
}

func handleUserLogout(c echo.Context) error {
	// send a new token with a 'nil' user and expiry of time.Now()
	sendJWT(&c, &User{}, time.Second*0)
	return nil
}

func handleVerifyEmail(c echo.Context) error {
	data, err_data := io.ReadAll(c.Request().Body)	
	
	if err_data != nil {
		c.NoContent(http.StatusInternalServerError)	
		return nil
	}
	
	user := &User{}
	err_unmarshal := json.Unmarshal(data, user)
	
	if err_unmarshal != nil {
		errorLogger.Printf("%s\n", err_unmarshal)	
		c.NoContent(http.StatusInternalServerError)
		return nil
	}
	
	// get the user from the database
	db_user := getUserFromID(user)
	
	if db_user == nil {
		errorLogger.Printf("trying to verify email of a non-existent user:\n%s\n", indentJSON(user))
		c.String(http.StatusBadRequest, "user does not exist")
		return nil
	}
	
	// check if the email if already verified
	if db_user.Verified {
		c.String(http.StatusBadRequest, "Email already verified")
		return nil
	}
	
	// check if the code is ok
	if user.Code != db_user.Code {
		c.String(http.StatusBadRequest, "Invalid code")
		return nil
	} 
	
	// set the user to verified
	ver := setVerified(user,true)
		
	if !ver {
		c.NoContent(http.StatusInternalServerError)
		return nil
	}
	
	c.String(http.StatusOK,"Email verified")
	return nil
}

func handleGetEmailStatus(c echo.Context) error {
	// get the role and id
	data, err_data := io.ReadAll(c.Request().Body)

	if err_data != nil {
		c.NoContent(http.StatusInternalServerError)
		return nil
	}
	
	// get the user from the data
	user := &User{}
	
	err_unmarshal := json.Unmarshal(data, user)
	
	if err_unmarshal != nil {
		c.NoContent(http.StatusInternalServerError)
		return nil
	}
		
	// get user from db
	db_user := getUserFromID(user)
	
	if db_user == nil {
		c.NoContent(http.StatusBadRequest)
		return nil
	}	
	
	resp_user := &User{
		Email: db_user.Email,
		Verified: db_user.Verified,
	}
	
	c.JSON(http.StatusOK, resp_user)
	return nil
}

func handleResendEmailCode(c echo.Context) error {
	// get the user
	data, err_data := io.ReadAll(c.Request().Body)
	
	if err_data != nil {
		c.NoContent(http.StatusInternalServerError)
		return nil
	}
	
	user := &User{}
	
	err_unmarshal := json.Unmarshal(data, user)
	
	if err_unmarshal != nil {
		c.NoContent(http.StatusInternalServerError)
		return nil
	}
	
	// set a new code
	res := setCode(user)
	
	if !res {
		c.NoContent(http.StatusInternalServerError)
		return nil
	}
	
	c.String(http.StatusOK, "Code changed successfully")	
	return nil
}

func handleResetEmail(c echo.Context) error {
	data, err_data := io.ReadAll(c.Request().Body)
	
	if err_data != nil {
		errorLogger.Printf("%s\n", err_data)
		c.NoContent(http.StatusInternalServerError)
	}
	
	user := &User{}
	
	err_unmarshal := json.Unmarshal(data, user)
	
	if err_unmarshal != nil {
		c.NoContent(http.StatusInternalServerError)
		return nil
	}
	
	resp := resetEmail(user)
	
	if !resp {
		c.NoContent(http.StatusInternalServerError)
		return nil	
	}
	
	
	c.String(http.StatusOK, "email changed successfully")	
	return nil
} 

func start_server() {
	e := echo.New()

	// create a router to handle /* for SPA
	e.GET("/*", handleSPA)

	// handle user signup
	e.POST("/signup", handleUserSignup)

	// handle user login
	e.POST("/login", handleUserLogin)

	// get data about the user
	e.POST("/getuserdata", handleGetUserData)
	
	// API for verifying email code 
	e.POST("/apiverifyemail", handleVerifyEmail)

	// get whether the email is verified or not
	e.POST("/apigetemailstatus", handleGetEmailStatus)

	e.POST("/apiresendemailcode", handleResendEmailCode)
	
	e.POST("/apiresetemail", handleResetEmail)

	e.POST("/logout", handleUserLogout)

	// start the server
	err_start := e.Start(fmt.Sprintf(":%d", PORT))
	if err_start != nil {
		errorLogger.Fatalf("%s\n", err_start)
	}
}
