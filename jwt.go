package main

import (
	"encoding/hex"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"net/http"
	"os"
	"time"
)

// loads the signing key from .env
func getJWTKey() []byte {
	key_hex := os.Getenv("JWT_KEY")
	data, err_data := hex.DecodeString(key_hex)
	if err_data != nil {
		errorLogger.Printf("error loading JWT_KEY from .env")
		os.Exit(1)
	}
	return data
}

type UserToken struct {
	UserRole string `json:"userrole,omitempty"`
	UserID   string `json:"userid,omitempty"`
	jwt.RegisteredClaims
}

func validateJWT(c echo.Context) *UserToken {
	// get the JWT token from cookies
	token, err_token := c.Cookie("token")
	if err_token != nil {
		if err_token == http.ErrNoCookie {
			return nil
		}

		return nil
	}

	jwt_token := token.Value

	user_token := &UserToken{}

	parsed_token, parsed_token_err := jwt.ParseWithClaims(jwt_token, user_token, func(tk *jwt.Token) (interface{}, error) {
		return getJWTKey(), nil
	})

	if parsed_token_err != nil {
		if parsed_token_err == jwt.ErrSignatureInvalid {
			return nil
		}
	}

	if !parsed_token.Valid {
		return nil
	}

	return user_token
}

// generate and send JWT
func sendJWT(c *echo.Context, user *User, t time.Duration) error {
	// get the signing key
	JWT_KEY := getJWTKey()

	// token expires 5 mins from now
	token_exp := time.Now().Add(t)

	userToken := UserToken{
		UserID:   user.ID,
		UserRole: user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(token_exp),
		},
	}

	token_with_claims := jwt.NewWithClaims(jwt.SigningMethodHS256, userToken)

	jwt_token, err_jwt_token := token_with_claims.SignedString(JWT_KEY)
	if err_jwt_token != nil {
		errorLogger.Printf("error signing JWT with key. %s\n", err_jwt_token)
		return err_jwt_token
	}

	debugLogger.Printf("generated JWT -> %s\n", jwt_token)

	// write the token to cookies
	(*c).SetCookie(&http.Cookie{
		Name:    "token",
		Value:   jwt_token,
		Expires: token_exp,
	})

	return nil
}

// auto renews a JTW if it expires in <= 60 seconds
func autoRenewToken(c echo.Context, user_token *UserToken) {
	// get the expiry date
	expiry := user_token.ExpiresAt
	if time.Now().Add(time.Second*60).Compare(expiry.Time) == 1 {
		sendJWT(&c, &User{
			ID:   user_token.UserID,
			Role: user_token.UserRole,
		},
			time.Minute*10)
	}
}
