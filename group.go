package main

// Holds information about the groups and members
type Group struct {
	MemberIDs []string  `json:"members,omitempty" bson:"members,omitempty"`
	Messages  []Message `json:"messages,omitempty" bson:"messages,omitempty"`
	CreatedAt string    `json:"createdat,omitempty" bson:"createdat,omitempty"` // string(time.Time)
}
