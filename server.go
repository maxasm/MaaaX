// the websever + websocekets
package main

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"io"
	"net/http"
	"os"
	"encoding/json"
	"time"
	"github.com/golang-jwt/jwt/v4"
)

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
		c.String(http.StatusInternalServerError, "500 InternalServerError")
		return err_f
	}
	return nil
}

func handleUserSignup(c echo.Context) error {
	eventLogger.Printf("POST creating new user ... \n")

	data, err_data := io.ReadAll(c.Request().Body)
	if err_data != nil {
		errorLogger.Printf("%s\n", err_data)
		return err_data
	}

	user, err_create_user := createNewUser(data)

	if err_create_user != nil {
		errorLogger.Printf("Error creating new user -> %s\n", err_create_user)
		c.String(http.StatusInternalServerError, "Error creating new user")
		return err_create_user
	}
	
	// check if a user with the same username exists
	if !isUsernameUnique(user) {
		c.String(http.StatusConflict, "Username is not unique")	
		eventLogger.Printf("http.StatusConflict 409 username is not unique")
		return nil
	}
	
	// add the user to the database
	if err_add_user := addUser(user); err_add_user != nil {
		c.String(http.StatusInternalServerError, "Internal Server Error")
		errorLogger.Printf("error adding user to the database\n", err_add_user)
		return err_add_user
	}
		
	debugLogger.Printf("created new user:\n %s", indentJSON(*user))
	c.String(http.StatusOK, fmt.Sprintf("successfully created new user: %s\n", user.Username))
	return nil
}


// generate and send JWT
func generateJWT(c echo.Context, user *User) (error) {
	// get the signing key
	JWT_KEY := getJWTKey()

	// token expires 5 mins from now 
	token_exp := time.Now().Add(time.Second * 30)

	userToken := UserToken{
		Username: user.Username,
		UserID:user.ID,
		UserRole:user.Role,
		RegisteredClaims: jwt.RegisteredClaims {
			ExpiresAt: jwt.NewNumericDate(token_exp), 
		},	
	}	
	
	token_with_claims := jwt.NewWithClaims(jwt.SigningMethodHS256, userToken)
	
	jwt_token, err_jwt_token := token_with_claims.SignedString(JWT_KEY)
	if err_jwt_token != nil {
		errorLogger.Printf("error signing JWT with key. %s\n", err_jwt_token)	
		return err_jwt_token
	}
	
	debugLogger.Printf("generated JWT -> %s\n", jwt_token)
	
	// write the token to cookies
	c.SetCookie(&http.Cookie{
		Name: "token",
		Value: jwt_token,
		Expires: token_exp,
	})
	
	return nil
}

func handleUserLogin(c echo.Context) error {
	// read the request body
	data, err_data := io.ReadAll(c.Request().Body)
	if err_data != nil {
		errorLogger.Printf("error reading request body: %s\n", err_data)
		c.String(http.StatusInternalServerError, "Internal Serever Error")
		return err_data
	}
	
	user := &User{}
	 
	if err_user := json.Unmarshal(data, user); err_user != nil {
		errorLogger.Printf("error on json.Unmarhsal(): %s\n", err_user)
		c.String(http.StatusInternalServerError, "Internal Server Error")
		return err_user
	}
	
	debugLogger.Printf("log in request from '%s' with role '%s'\n", user.Username, user.Role)
	// get the user with the given username
	db_user, err_db_user := findUserByUsername(user)

	if err_db_user != nil {
		errorLogger.Printf("error finding user in database: %s\n", err_db_user)
		c.String(http.StatusInternalServerError, "Internal Serever Error")
		return err_db_user
	}
	
	if db_user != nil {
		// check if the password's match
		if compareHash(db_user.Password, user.Password) {
			// remember login by sending JWT
			if user.RememberLogin {
				err_gen_jwt := generateJWT(c, db_user)
				if err_gen_jwt != nil {
					c.String(http.StatusInternalServerError, "Internal Server Error")
					return err_gen_jwt
				}
			}

			debugLogger.Printf("user '%s' successfull login\n", user.Username)
			// just log in
			c.String(http.StatusOK, "Successfull login")
			return nil
		}	
	}

	debugLogger.Printf("user '%s' failed to log in successfully\n", user.Username)
	c.String(http.StatusUnauthorized, "Invalid Username and Password")
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

	// start the server
	err_start := e.Start(fmt.Sprintf(":%d", PORT))
	if err_start != nil {
		errorLogger.Fatalf("%s\n", err_start)
	}
}
