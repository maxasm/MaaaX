package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"io"
	"strings"

	"github.com/labstack/echo/v4"
)

func generateID(no_bytes int, role string) string {
	buffer := make([]byte, no_bytes)
	var id_as_string string

	for {
		rand.Read(buffer)
		id_as_string = hex.EncodeToString(buffer)
		unique, _ := isIDUnique(id_as_string, role)
		if unique {
			break
		}
	}
	return id_as_string
}

// every protected route must be accompanied by user 'role' and 'id'
func validateRequest(c echo.Context) *UserToken {
	// validate the JWT
	user_token := validateJWT(c)

	if user_token == nil {
		return nil
	}

	req_user := &User{}

	data, err_data := io.ReadAll(c.Request().Body)
	if err_data != nil {
		errorLogger.Printf("error reading from rquest body\n")
		return nil
	}

	err_unmarshal := json.Unmarshal(data, req_user)

	if err_unmarshal != nil {
		errorLogger.Printf("%s\n", err_unmarshal)
		return nil
	}

	// check if the 'role' is valid
	if !(req_user.Role == "client" || req_user.Role == "writer" || req_user.Role == "admin") {
		return nil
	}

	// check if the 'id' is valid
	if len(strings.Trim(req_user.ID, " ")) == 0 {
		return nil
	}

	// confirm if the URL path corresponds to the user with the JWT
	if req_user.ID == user_token.UserID && req_user.Role == user_token.UserRole {
		return user_token
	}

	return nil
}

func getUserFromRequest(c echo.Context) *User {
	// get the user role and id
	data, err_data := io.ReadAll(c.Request().Body)
	if err_data != nil {
		return nil
	}

	user := &User{}
	err_unmarshal := json.Unmarshal(data, user)

	if err_unmarshal != nil {
		return nil
	}

	return user
}
