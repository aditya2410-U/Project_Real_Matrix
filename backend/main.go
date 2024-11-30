package main

import (
    "fmt"
    "log"
    "net/http"
    "github.com/gorilla/mux"
    "github.com/rs/cors"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    fmt.Fprintf(w, `{"message": "Hello from Go Backend!"}`)
}

func main() {
    r := mux.NewRouter()
    r.HandleFunc("/api/hello", helloHandler).Methods("GET")
    // Enabling CORS
    c := cors.New(cors.Options{
        AllowedOrigins: []string{"http://localhost:3000"}, // Your frontend's URL
        AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
        AllowedHeaders: []string{"Content-Type"},
    })
    
    // Wrapping the router with CORS middleware
    handler := c.Handler(r)

    fmt.Println("Go server running on http://localhost:8081")
    log.Fatal(http.ListenAndServe(":8081", handler))
}
