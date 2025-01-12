package main

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Client struct {
	SessionID string
	Conn      *websocket.Conn
}

type Message struct {
	Type      string `json:"type"`
	Content   string `json:"content"`
	SessionID string `json:"sessionId"`
	Language  string `json:"language,omitempty"`
}

var (
	sessions = make(map[string][]*Client)
	mutex    sync.RWMutex
)

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade failed: %v", err)
		return
	}

	sessionID := r.URL.Query().Get("sessionId")
	if sessionID == "" {
		log.Println("No session ID provided")
		conn.Close()
		return
	}

	client := &Client{
		SessionID: sessionID,
		Conn:      conn,
	}

	mutex.Lock()
	sessions[sessionID] = append(sessions[sessionID], client)
	mutex.Unlock()

	handleMessages(client)
}

func handleMessages(client *Client) {
	defer func() {
		mutex.Lock()
		for i, c := range sessions[client.SessionID] {
			if c == client {
				sessions[client.SessionID] = append(sessions[client.SessionID][:i], sessions[client.SessionID][i+1:]...)
				break
			}
		}
		if len(sessions[client.SessionID]) == 0 {
			delete(sessions, client.SessionID)
		}
		mutex.Unlock()
		client.Conn.Close()
	}()

	for {
		var msg Message
		err := client.Conn.ReadJSON(&msg)
		if err != nil {
			break
		}
		broadcastToSession(msg, client.SessionID)
	}
}

func broadcastToSession(msg Message, sessionID string) {
	mutex.RLock()
	defer mutex.RUnlock()

	for _, client := range sessions[sessionID] {
		err := client.Conn.WriteJSON(msg)
		if err != nil {
			log.Printf("Error broadcasting: %v", err)
		}
	}
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/ws", handleWebSocket)

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:300"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	handler := c.Handler(mux)
	log.Println("WebSocket server starting on :8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
