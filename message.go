package main

// Status
const (
	_ = iota
	SENT
	DELIVERED
	READ
	FAILED
)

type Reaction struct {
	SenderID string `json:"sender,omitempty" bson:"sender,omitempty"`
	Emoji    string `json:"emoji,omitempty" bson:"emoji,omitempty"`
}

type Message struct {
	ID          string     `json:"id,omitempty" bson:"id,omitempty"`
	SenderID    string     `json:"sender,omitempty" bson:"sender,omitempty"`
	ReceiverID  string     `json:"receiver,omitempty" bson:"receiver,omitempty"`
	ReplyToID   string     `json:"replyto,omitempty" bson:"replyto,omitempty"` // The message being responded to.
	Content     string     `json:"content,omitempty" bson:"content,omitempty"`
	Timestamp   string     `json:"timestamp,omitempty" bson:"timestamp,omitempty"`     // string(time.Time)
	Attachments []string   `json:"attachments,omitempty" bson:"attachments,omitempty"` // An array to AWS S3 links.
	Reactions   []Reaction `json:"reactions,omitempty" bson:"reactions,omitempty"`     // Any reactions that users have made on the message.
	Pinned      bool       `json:"pinned,omitempty" bson:"pinned,omitempty"`
	Status      int        `json:"status,omitempty" bson:"status,omitempty"`
}
