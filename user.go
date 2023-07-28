package main

import (
	"encoding/json"
)

// TODO: ensure that email us unque as it is used to reset password
type User struct {
	Username      string  `json:"username,omitempty" bson:"username,omitempty"`
	ID            string  `json:"id,omitempty" bson:"id,omitempty"`
	Groups        []Group `json:"groups,omitempty" bson:"groups,omitempty"`
	Role          string  `json:"role,omitempty" bson:"role,omitempty"`
	Verified      bool    `json:"verified,omitempty" bson:"verified,omitempty"`
	Email         string  `json:"email,omitempty" bson:"email,omitempty"`
	Dp            string  `json:"dp,omitempty" bson:"dp,omitempty"`
	Bio           string  `json:"bio,omitempty" bson:"bio,omitempty"`
	Password      string  `json:"password,omitempty" bson:"password,omitempty"`
	Fullname      string  `json:"fullname,omitempty" bson:"fullname,omitempty"`
	RememberLogin bool    `json:"rememberlogin,omitempty" bson:"rememberlogin,omitempty"`
	Code          string  `json:"code,omitempty" bson:"code,omitempty"`
	EmailResetID  string  `json:"emailresetid,omitempty" bson:"emailresetid,omitempty"`
}

// the data that comes from the front end {username, email, password, full name}
func createNewUser(json_data []byte) (*User, error) {
	user := &User{}
	err_unmarshal := json.Unmarshal(json_data, user)

	if err_unmarshal != nil {
		errorLogger.Printf("json.Unmarshal() -> %s\n", err_unmarshal)
		return nil, err_unmarshal
	}

	// hash the password
	phash, _ := generateHash(user.Password)
	user.Password = phash

	// set the code for verifying the email (8 digits)
	user.Code = generateID(4, "client")

	// generate ID
	id := generateID(2, user.Role)

	user.ID = id
	return user, nil
}
