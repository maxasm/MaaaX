// the websever + websocekets
package main

import (
	"github.com/labstack/echo/v4"
	"net/http"
	"os"
	"fmt"
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


func start_server() {
	e := echo.New()
	
	// create a router to handle /* for SPA
	e.GET("/*", handleSPA)
	
	// start the server
	err_start := e.Start(fmt.Sprintf(":%d", PORT))
	if err_start != nil {
		errorLogger.Printf("%s\n", err_start)
		os.Exit(1)
	}
}
