package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type Item struct {
	Id          string   `json:"id"`
	Text        string   `json:"text"`
	CreatedAt   string   `json:"createdAt"`
	StartedAt   []string `json:"startedAt"`
	StoppedAt   []string `json:"stoppedAt"`
	CompletedAt string   `json:"completedAt"`
	Color       string   `json:"color"`
}

type ItemList struct {
	Items []Item `json:"items"`
}

type TodoFile struct {
	ToDo       ItemList `json:"toDo"`
	OnProgress ItemList `json:"onProgress"`
	Done       ItemList `json:"done"`
}

func ParseTodoFile(todoFile []byte) (TodoFile, error) {
	output := TodoFile{}
	err := json.Unmarshal(todoFile, &output)
	return output, err
}

func HandleCors(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("Access-Control-Allow-Origin", "*")
	response.Header().Add("Access-Control-Allow-Credentials", "true")
	response.Header().Add("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Request-Id")
	response.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
}

func HandleEditVideo(response http.ResponseWriter, request *http.Request) {
	requestId := request.Header.Get("X-Request-Id")
	Linfo.Println("Handeling request! ", requestId)

	HandleCors(response, request)
	response.Header().Add("X-Request-Id", requestId)

	bodyContent, err := io.ReadAll(request.Body)
	if err != nil {
		Lerror.Println("Request body could not be read:", err)
		response.WriteHeader(400)
		return
	}

	todoFile, err := ParseTodoFile(bodyContent)
	if err != nil {
		Lerror.Println("Request body could not be parsed:", err)
		response.WriteHeader(400)
		return
	}

	Linfo.Println("Parsed todo file ", todoFile)

	response.Header().Set("Content-Type", "application/json")
	response.Write([]byte(fmt.Sprintf("Request %s handeled correctly", requestId)))
	response.WriteHeader(200)
}

// TODO: read json files from disk
// TODO: process the json to some useful structs
// TODO: translate those structs into FFMPEG commands

// Maybe implement this as a daemon + a cli application that connects to it
func main() {
	/*
		file := TodoFile{
			ToDo: ItemList{
				Items: make([]Item, 0),
			},
		}

		file.ToDo.Items = append(file.ToDo.Items, Item{
			Id: "Hello",
		})
	*/

	router := http.NewServeMux()
	router.HandleFunc("/*", HandleCors)
	router.HandleFunc("POST /editVideo", HandleEditVideo)
	server := &http.Server{
		Addr:           ":8080",
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	Linfo.Println("Server is running on ", server.Addr)
	Lwarning.Fatal(server.ListenAndServe())
}
