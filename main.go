package main

import (
	"github.com/joho/godotenv"
)

func main() {
	// load values from .env
	godotenv.Load()

	// connect to database
	connect_to_database()
	// start the web server
	start_server()
}
