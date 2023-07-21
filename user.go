package main

import (
	"encoding/json"
)

type User struct {
	Username string   `json:"username,omitempty" bson:"username,emitempty"`
	ID       string   `json:"id,omitempty" bson:"id,emitempty"`
	Groups   []Group `json:"groups,omitempty" bson:"groups,emitempty"`
	Role     string   `json:"role,omitempty" bson:"role,emitempty"`
	Verified bool     `json:"verified,omitempty" bson:"verified,omitempty"`
	Email    string   `json:"email,omitempty" bson:"email,emitempty"`
	Dp       string   `json:"dp,omitempty" bson:"dp,omitempty"`
	Bio      string   `json:"bio,omitempty" bson:"bio,omitempty"`
	Password string   `json:"password,omitempty" bson:"password,omitempty"`
	Fullname string   `json:"fullname,omitempty" bson:"fullname,omitempty"`
}

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

	// generate ID
	id, err_id := generateID()
	if err_id != nil {
		errorLogger.Printf("Error generating ID\n")
		return nil, err_id
	}

	user.ID = id
	return user, nil
}

