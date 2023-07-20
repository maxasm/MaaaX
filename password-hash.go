package main

import (
	"golang.org/x/crypto/bcrypt"
)

// generate a hash for a given password
func generateHash(pswd string) (string, error) {
	data, err_data := bcrypt.GenerateFromPassword([]byte(pswd), 10)
	return string(data), err_data
}

// compare the stored hash with the given password
func compareHash(hash string, pswd string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(pswd))
	return err == nil
}
