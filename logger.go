package main

import (
	"encoding/json"
	"fmt"
	"log"
)

type RedWriter struct{}
type GreenWriter struct{}
type OrangeWriter struct{}

func (rw RedWriter) Write(data []byte) (int, error) {
	fmt.Printf("\033[31m%s\033[0m", string(data))
	return len(data), nil
}

func (gw GreenWriter) Write(data []byte) (int, error) {
	fmt.Printf("\x1b[38;5;22m%s\033[0m", string(data))
	return len(data), nil
}

func (ow OrangeWriter) Write(data []byte) (int, error) {
	fmt.Printf("\033[38;5;165m%s\033[0m", string(data))
	return len(data), nil
}

func indentJSON(v interface{}) string {
	res, err_res := json.MarshalIndent(v, "", "\t")
	if err_res != nil {
		return fmt.Sprintf("%s", v)
	}
	return string(res)
}

var errorLogger = log.New(RedWriter{}, "[error] ", log.Ldate|log.Ltime)
var eventLogger = log.New(GreenWriter{}, "[event] ", log.Ldate|log.Ltime)
var debugLogger = log.New(OrangeWriter{}, "[debug] ", log.Ldate|log.Ltime)
