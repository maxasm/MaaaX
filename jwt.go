package main

import (
	"encoding/hex"
	"github.com/golang-jwt/jwt/v4"
	"os"
)

// loads the signing key from .env
func getJWTKey() []byte {
	key_hex := os.Getenv("JWT_KEY")
	data, err_data := hex.DecodeString(key_hex)
	if err_data != nil {
		errorLogger.Printf("error loading JWT_KEY from .env")
		os.Exit(1)
	}
	return data
}


type UserToken struct {
	Username string `json:"username,omitempty"`
	UserRole string `json:"userrole,omitempty"`
	UserID string `json:"userid,omitempty"`
	jwt.RegisteredClaims 	
}
