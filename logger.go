package main

// Todo: use fmt.Fprintf
import (
	"log"
	"fmt"
)

type RedWriter struct {}
type GreenWriter struct {}

func (rw RedWriter) Write(data []byte) (int, error) {
	fmt.Printf("\033[31m%s\033[0m", string(data))
	return len(data), nil
}

func (gw GreenWriter) Write(data []byte) (int, error) {
	fmt.Printf("\033[32m%s\033[0m", string(data))
	return len(data), nil
}

var errorLogger = log.New(RedWriter{}, "[error] ", log.Ldate | log.Ltime)
var eventLogger = log.New(GreenWriter{}, "[event] ", log.Ldate | log.Ltime)
