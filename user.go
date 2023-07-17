// The 'user' represents either an Admin, Manager, or Writer
package main

const (
	_ = iota
	ADMIN
	MANAGER
	WRITER
	CLIENT
)

type Contact struct {
	Phone string `json:"phone,omitempty" bson:"phone,emitempty"` // the phone number
	Email string `json:"email,omitempty" bson:"email,emitempty"` // the email
}

type Identity struct {
	FirstName string `json:"firstname,omitempty" bson:"firstname,emitempty"`
	LastName  string `json:"lastname,omitempty" bson:"lastname,emitempty"`
	Username  string `json:"username,omitempty" bson:"username,emitempty"` //unique username
}

type User struct {
	ID       string `json:"id,omitempty" bson:"id,emitempty"` // unique ID
	Identity `json:"identity,omitempty" bson:"identity,emitempty"`
	Contact  `json:"contact,omitempty" bson:"contact,emitempty"`
	Groups   []*Group `json:"groups,omitempty" bson:"groups,emitempty"`
	Role     int      `json:"role,omitempty" bson:"role,emitempty"` // the user role -> Admin, Manager, Writer
}
