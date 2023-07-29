package main

// TODO: Reset using getters and setters
import (
	"context"
	"errors"
	"os"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var db_client *mongo.Client

func connect_to_database() {
	const DB_URI = "mongodb://127.0.0.1:27017/?connect=direct"
	// create context
	var ctx, _ = context.WithTimeout(context.Background(), 10*time.Second)

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

func getUserFromUsername(user *User) *User {
	collection := db_client.Database("maxusers").Collection(user.Role)
	res := collection.FindOne(context.TODO(), bson.D{{"username", user.Username}})

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

func getUserFromID(user *User) *User {
	collection := db_client.Database("maxusers").Collection(user.Role)
	res := collection.FindOne(context.TODO(), bson.D{{"id", user.ID}})

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

func setVerified(user *User, verified bool) bool {
	collection := db_client.Database("maxusers").Collection(user.Role)
	_, err_res := collection.UpdateOne(context.TODO(), bson.D{{"id", user.ID}}, bson.D{{"$set", bson.D{{"verified", verified}}}})

	if err_res != nil {
		errorLogger.Printf("error updating verified state in db: %s\n", err_res)
		return false
	}

	debugLogger.Printf("set email to verified")
	return true
}

// set code for email verification
func setCode(user *User) bool {
	collection := db_client.Database("maxusers").Collection(user.Role)
	// generate a new ID
	code := generateID(4, "client")
	debugLogger.Printf("new generated code for user id %s is %s\n", user.ID, code)
	// update the code in the database
	_, err_res := collection.UpdateOne(context.TODO(), bson.D{{"id", user.ID}}, bson.D{{"$set", bson.D{{"code", code}}}})

	if err_res != nil {
		errorLogger.Printf("error updating code in db: %s\n", err_res)
		return false
	}
	return true
}

func resetEmail(user *User) bool {
	collection := db_client.Database("maxusers").Collection(user.Role)

	_, err_res := collection.UpdateOne(context.TODO(), bson.D{{"id", user.ID}}, bson.D{{"$set", bson.D{{"email", user.Email}}}})

	if err_res != nil {
		errorLogger.Printf("error updating email for user: %s\n", err_res)
		return false
	}

	debugLogger.Printf("successfully updated email\n")
	return true
}

func getUserFromEmail(user *User) *User {
	collection := db_client.Database("maxusers").Collection(user.Role)
	resp := collection.FindOne(context.TODO(), bson.D{{"email", user.Email}})

	var resp_bson bson.M
	err_decode := resp.Decode(&resp_bson)

	if err_decode != nil {
		if err_decode == mongo.ErrNoDocuments {
			return nil
		}
		return nil
	}

	data, err_data := bson.Marshal(resp_bson)
	if err_data != nil {
		return nil
	}

	db_user := &User{}
	err_unmarshal := bson.Unmarshal(data, db_user)

	if err_unmarshal != nil {
		return nil
	}

	return db_user
}

func setPasswordResetID(user *User) bool {
	collection := db_client.Database("maxusers").Collection(user.Role)
	_, err_resp := collection.UpdateOne(context.TODO(), bson.D{{"email", user.Email}}, bson.D{{"$set", bson.D{{"passwordresetid", user.PasswordResetID}}}})

	if err_resp != nil {
		return false
	}

	debugLogger.Printf("set the password reset id: %s\n", user.PasswordResetID)
	return true
}

func getUserFromPasswordResetID(user *User) *User {
	colleciton := db_client.Database("maxusers").Collection(user.Role)
	resp := colleciton.FindOne(context.TODO(), bson.D{{"passwordresetid", user.PasswordResetID}})

	var res_bson bson.M
	err_bson := resp.Decode(&res_bson)

	if err_bson != nil {
		if err_bson == mongo.ErrNoDocuments {
			return nil
		} else {
			return nil
		}
	}

	db_user := &User{}

	data, err_data := bson.Marshal(res_bson)
	if err_data != nil {
		return nil
	}

	err_unmarshal := bson.Unmarshal(data, db_user)
	if err_unmarshal != nil {
		return nil
	}

	return db_user
}

func setPassword(user *User) bool {
	// find user by id then update the password
	collection := db_client.Database("maxusers").Collection(user.Role)
	_, err := collection.UpdateOne(context.TODO(), bson.D{{"id", user.ID}}, bson.D{{"$set", bson.D{{"password", user.Password}}}})

	if err != nil {
		errorLogger.Printf("error updating password of user")
		return false
	}

	// unset the emailresetid
	_, err = collection.UpdateOne(context.TODO(), bson.D{{"id", user.ID}}, bson.D{{"$set", bson.D{{"emailresetid", ""}}}})
	if err != nil {
		errorLogger.Printf("error unsetting emailtresetid")
		return false
	}

	debugLogger.Printf("password reset successfully")
	return true
}
