package main

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"context"
	"time"
	"os"
)

var db_client *mongo.Client

func connect_to_database() {
	const DB_URI = "mongodb://127.0.0.1:27017/?connect=direct"
	// create context
	var ctx, _ = context.WithTimeout(context.Background(), 10 * time.Second)

	// create client options
	clientOptions := options.Client()
	clientOptions.ApplyURI(DB_URI)
	
	// create new client
	client, err_client := mongo.Connect(ctx, clientOptions)	
	
	if err_client != nil {
		errorLogger.Printf("Error connecting to MongoDB: %s\n", err_client)
		os.Exit(1)
		return	
	}
	
	eventLogger.Printf("successfully connected to the database\n")
	db_client = client	
}

func addUser(user *User) error {
	user_role := user.Role
	collection := db_client.Database("maxusers").Collection(user_role)
	result, err_result := collection.InsertOne(context.TODO(), *user)

	if err_result != nil {
		errorLogger.Printf("Error inserting item in database: %s\n", err_result)
		return err_result
	}
	
	debugLogger.Printf("Added new user to database.\n%s\n", indentJSON(result))
	return nil
}


func isUsernameUnique(user *User) bool {
	username := user.Username
	user_role := user.Role	
	collection := db_client.Database("maxusers").Collection(user_role)
	
	res := collection.FindOne(context.TODO(), bson.D{{"username", username}})
		
	var resBSON bson.M
	err_bson := res.Decode(&resBSON)

	debugLogger.Printf("Find results.\n%v\n", indentJSON(resBSON))

	if err_bson != nil {
		// this means there was no matching document
		if err_bson == mongo.ErrNoDocuments {
			return true	
		} else {
			errorLogger.Printf("Error decoding bson.M value -> %s\n", err_bson)
			return true
		}
	}

	return false 
}
