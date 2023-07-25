package main

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"context"
	"time"
	"os"
	"errors"
	"strings"
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
	_, err_result := collection.InsertOne(context.TODO(), *user)

	if err_result != nil {
		errorLogger.Printf("Error inserting item in database: %s\n", err_result)
		return err_result
	}
	
	return nil
}


func isUsernameUnique(user *User) bool {
	username := user.Username
	user_role := user.Role	
	collection := db_client.Database("maxusers").Collection(user_role)
	
	res := collection.FindOne(context.TODO(), bson.D{{"username", username}})
		
	var res_bson bson.M
	err_bson := res.Decode(&res_bson)

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

func getUserFromUsername(user *User) (*User) {
	collection := db_client.Database("maxusers").Collection(user.Role)
	res := collection.FindOne(context.TODO(), bson.D{{"username", user.Username}})
	
	debugLogger.Printf("getUser() userrole -> %s userid -> %s\n", user.Role, user.ID)
	
	var res_bson bson.M 
	err_decode := res.Decode(&res_bson)
	
	if err_decode != nil {
		if err_decode == mongo.ErrNoDocuments {
			return nil
		}	
		return nil
	}
	
	// convert bson -> []byte
	data, err_marshal := bson.Marshal(res_bson)
	if err_marshal != nil {
		return nil
	}

	db_user := &User{}
	err_unmarshal := bson.Unmarshal(data, db_user)
	

	if err_unmarshal != nil {
		return nil
	}

	return db_user 
}



func getUserFromID(user *User) (*User) {
	collection := db_client.Database("maxusers").Collection(user.Role)
	res := collection.FindOne(context.TODO(), bson.D{{"id", user.ID}})
	
	debugLogger.Printf("getUser() userrole -> %s userid -> %s\n", user.Role, user.ID)
	
	var res_bson bson.M 
	err_decode := res.Decode(&res_bson)
	
	if err_decode != nil {
		if err_decode == mongo.ErrNoDocuments {
			return nil
		}	
		return nil
	}
	
	// convert bson -> []byte
	data, err_marshal := bson.Marshal(res_bson)
	if err_marshal != nil {
		return nil
	}

	db_user := &User{}
	err_unmarshal := bson.Unmarshal(data, db_user)
	

	if err_unmarshal != nil {
		return nil
	}

	return db_user 
}

func isIDUnique(id string, role string) (bool, error) {
	if !(role == "client" || role == "writer" || role == "admin") {
		return false, errors.New("Invalid role")	
	}

	if len(strings.Trim(id, " ")) == 0 {
		return false, errors.New("ID is empty")
	}
	
	collection := db_client.Database("maxusers").Collection(role)
	
	res := collection.FindOne(context.TODO(), bson.D{{"id", id}})

	var res_bson bson.M
	err_decode := res.Decode(&res_bson)	
	
	if err_decode != nil {
		if err_decode == mongo.ErrNoDocuments {
			return true, nil
		}
		return false, err_decode
	}
	
	return false, nil
}
