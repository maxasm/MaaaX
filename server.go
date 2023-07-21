// the websever + websocekets
package main

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"io"
	"net/http"
	"os"
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
		c.String(http.StatusConflict, "Username is not unique.")	
		eventLogger.Printf("http.StatusConflict 409 username is not unique")
		return nil
	}
	
	// add the user to the database
	addUser(user)
		
	debugLogger.Printf("created new user:\n %s", indentJSON(*user))
	c.String(http.StatusOK, fmt.Sprintf("successfully created new user: %s\n", user.Username))
	return nil
}

func start_server() {
	e := echo.New()

	// create a router to handle /* for SPA
	e.GET("/*", handleSPA)

	// handle user signup
	e.POST("/signup", handleUserSignup)

	// start the server
	err_start := e.Start(fmt.Sprintf(":%d", PORT))
	if err_start != nil {
		errorLogger.Fatalf("%s\n", err_start)
	}
}
