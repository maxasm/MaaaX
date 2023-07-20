package main

import (
	"crypto/rand"
	"encoding/hex"
)

const NO_BYTES = 8

func generateID() (string, error) {
	buffer := make([]byte, NO_BYTES)
	_, err_read := rand.Read(buffer)
	if err_read != nil {
		return "", err_read
	}
	return hex.EncodeToString(buffer), nil
}
