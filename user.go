// The 'user' represents either an Admin, Manager, or Writer
package main

const (
	_ = iota
	ADMIN
	MANAGER
	WRITER
	CLIENT
)

type User struct {
	Username string   `json:"username,omitempty" bson:"username,emitempty"`
	Name     string   `json:"name,omitempty" bson:"name,emitempty"`
	ID       string   `json:"id,omitempty" bson:"id,emitempty"`
	Groups   []*Group `json:"groups,omitempty" bson:"groups,emitempty"`
	Role     int      `json:"role,omitempty" bson:"role,emitempty"`
	Verified bool     `json:"verified,omitempty" bson:"verified,omitempty"`
	Email    string   `json:"email,omitempty" bson:"email,emitempty"`
	Dp       string   `json:"dp,omitempty" bson:"dp,omitempty"`
	Bio      string   `json:"bio,omitempty" bson:"bio,omitempty"`
}
