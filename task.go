package main

// the status of the task.
const (
	_ = iota
	NOT_ASSIGNED
	ASSIGNED
	IN_PROGESS
	DONE
	UNDER_REVIEW
	CANCELLED
	PAID
)

// academic writing formats.
const (
	_ = iota
	MLA_8
	MLA_7
	APA_7
	APA_6
	CHICAGO
	HAVARD
	IEEE
	AMA_11
	AMA_12
	VANCOUVER
	ACS
	CUSTOM
)

type TaskDescription struct {
	Title       string   `json:"title,omitempty" bson:"title,omitempty"`
	Notes       string   `json:"notes,omitempty" bson:"notes,omitempty"` // the instructions for the given task.
	WordCount   int      `json:"wordcount,omitempty" bson:"wordcount,omitempty"`
	Deadline    string   `json:"deadline,omitempty" bson:"deadline,omitempty"` // string(time.Time)
	Format      int      `json:"format,omitempty" bson:"format,omitempty"`
	Attachments []string `json:"attachments,omitempty" bson:"attachments,omitempty"` // links to AWS s3
}

type Task struct {
	ID          string          `json:"id,omitempty" bson:"id,omitempty"`
	Description TaskDescription `json:"description,omitempty" bson:"description,omitempty"`
	Creator     string          `json:"creator,omitempty" bson:"creator,omitempty"`     // user id of the user who created the task.
	CreatedAt   string          `json:"createdat,omitempty" bson:"createdat,omitempty"` // string(time.Time)
	Assigner    string          `json:"assigner,omitempty" bson:"assigner,omitempty"`   // user id of the assigner.
	Assignee    []string        `json:"assignee,omitempty" bson:"assignee,omitempty"`   // user id of the writers who has been assigned the task.
}
