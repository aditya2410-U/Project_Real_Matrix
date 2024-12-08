// package main

// import (
//     "fmt"
//     "log"
//     "net/http"
//     "github.com/gorilla/mux"
//     "github.com/rs/cors"
// )

// func helloHandler(w http.ResponseWriter, r *http.Request) {
//     w.Header().Set("Content-Type", "application/json")
//     w.WriteHeader(http.StatusOK)
//     fmt.Fprintf(w, `{"message": "Hello from Go Backend!"}`)
// }

// func main() {
//     r := mux.NewRouter()
//     r.HandleFunc("/api/hello", helloHandler).Methods("GET")
//     // Enabling CORS
//     c := cors.New(cors.Options{
//         AllowedOrigins: []string{"http://localhost:3000"}, // Your frontend's URL
//         AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
//         AllowedHeaders: []string{"Content-Type"},
//     })
    
//     // Wrapping the router with CORS middleware
//     handler := c.Handler(r)

//     fmt.Println("Go server running on http://localhost:8083")
//     log.Fatal(http.ListenAndServe(":8083", handler))
// }


// package main

// import (
// 	"context"
// 	"encoding/json"
// 	"fmt"
// 	"log"
// 	"net/http"
// 	"os"
// 	"time"

// 	"github.com/golang-jwt/jwt/v5"
// 	"github.com/joho/godotenv"
// 	"github.com/rs/cors"
// 	"go.mongodb.org/mongo-driver/bson"
// 	"go.mongodb.org/mongo-driver/mongo"
// 	"go.mongodb.org/mongo-driver/mongo/options"
// 	"golang.org/x/crypto/bcrypt"
// )

// type User struct {
// 	Username  string    `json:"username" bson:"username"`
// 	Email     string    `json:"email" bson:"email"`
// 	Password  string    `json:"password" bson:"password"`
// 	CreatedAt time.Time `json:"createdAt" bson:"createdAt"`
// }

// type AuthHandler struct {
// 	mongoClient *mongo.Client
// 	database    *mongo.Database
// }

// type RegisterRequest struct {
// 	Username string `json:"username"`
// 	Email    string `json:"email"`
// 	Password string `json:"password"`
// }

// type LoginRequest struct {
// 	Email    string `json:"email"`
// 	Password string `json:"password"`
// }

// type TokenResponse struct {
// 	Token string `json:"token"`
// }

// func NewAuthHandler(mongoURI, dbName string) (*AuthHandler, error) {
// 	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
// 	defer cancel()

// 	clientOptions := options.Client().ApplyURI(mongoURI)
// 	client, err := mongo.Connect(ctx, clientOptions)
// 	if err != nil {
// 		return nil, err
// 	}

// 	// Verify connection
// 	err = client.Ping(ctx, nil)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return &AuthHandler{
// 		mongoClient: client,
// 		database:    client.Database(dbName),
// 	}, nil
// }

// func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
// 	var req RegisterRequest
// 	decoder := json.NewDecoder(r.Body)
// 	if err := decoder.Decode(&req); err != nil {
// 		http.Error(w, "Invalid request payload", http.StatusBadRequest)
// 		return
// 	}
// 	defer r.Body.Close()

// 	// Validate input
// 	if req.Username == "" || req.Email == "" || req.Password == "" {
// 		http.Error(w, "All fields are required", http.StatusBadRequest)
// 		return
// 	}

// 	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
// 	defer cancel()

// 	collection := h.database.Collection("users")

// 	// Check if user already exists
// 	var existingUser User
// 	err := collection.FindOne(ctx, bson.M{
// 		"$or": []bson.M{
// 			{"email": req.Email},
// 			{"username": req.Username},
// 		},
// 	}).Decode(&existingUser)

// 	if err == nil {
// 		http.Error(w, "User already exists", http.StatusConflict)
// 		return
// 	}

// 	// Hash password
// 	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
// 	if err != nil {
// 		http.Error(w, "Error hashing password", http.StatusInternalServerError)
// 		return
// 	}

// 	// Create new user
// 	newUser := User{
// 		Username:  req.Username,
// 		Email:     req.Email,
// 		Password:  string(hashedPassword),
// 		CreatedAt: time.Now(),
// 	}

// 	_, err = collection.InsertOne(ctx, newUser)
// 	if err != nil {
// 		http.Error(w, "Error creating user", http.StatusInternalServerError)
// 		return
// 	}

// 	w.WriteHeader(http.StatusCreated)
// 	json.NewEncoder(w).Encode(map[string]string{
// 		"message": "User registered successfully",
// 	})
// }

// func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
// 	var req LoginRequest
// 	decoder := json.NewDecoder(r.Body)
// 	if err := decoder.Decode(&req); err != nil {
// 		http.Error(w, "Invalid request payload", http.StatusBadRequest)
// 		return
// 	}
// 	defer r.Body.Close()

// 	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
// 	defer cancel()

// 	collection := h.database.Collection("users")

// 	// Find user by email
// 	var user User
// 	err := collection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&user)
// 	if err != nil {
// 		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
// 		return
// 	}

// 	// Verify password
// 	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
// 	if err != nil {
// 		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
// 		return
// 	}

// 	// Generate JWT token
// 	token, err := generateJWTToken(user)
// 	if err != nil {
// 		http.Error(w, "Error generating token", http.StatusInternalServerError)
// 		return
// 	}

// 	w.WriteHeader(http.StatusOK)
// 	json.NewEncoder(w).Encode(TokenResponse{Token: token})
// }

// func generateJWTToken(user User) (string, error) {
// 	secretKey := os.Getenv("JWT_SECRET")
// 	if secretKey == "" {
// 		return "", fmt.Errorf("JWT_SECRET not set")
// 	}

// 	claims := jwt.MapClaims{
// 		"email":    user.Email,
// 		"username": user.Username,
// 		"exp":      time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
// 	}

// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	return token.SignedString([]byte(secretKey))
// }

// func main() {
// 	// Load environment variables
// 	err := godotenv.Load()
// 	if err != nil {
// 		log.Fatal("Error loading .env file")
// 	}

// 	// Get environment variables
// 	mongoURI := os.Getenv("MONGODB_URI")
// 	dbName := os.Getenv("MONGODB_DB")
// 	port := os.Getenv("PORT")

// 	if mongoURI == "" || dbName == "" {
// 		log.Fatal("MongoDB URI or Database name not set")
// 	}

// 	// Create auth handler
// 	authHandler, err := NewAuthHandler(mongoURI, dbName)
// 	if err != nil {
// 		log.Fatalf("Failed to connect to MongoDB: %v", err)
// 	}

// 	// Create mux router
// 	mux := http.NewServeMux()
// 	mux.HandleFunc("/api/auth/register", authHandler.Register)
// 	mux.HandleFunc("/api/auth/login", authHandler.Login)

// 	// Add CORS support
// 	handler := cors.Default().Handler(mux)

// 	// Start server
// 	log.Printf("Server starting on port %s", port)
// 	log.Fatal(http.ListenAndServe(":"+port, handler))
// }
package main
import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"github.com/rs/cors"
)

// User represents the structure of a user registration request
type User struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthHandler - Example structure for handling authentication
type AuthHandler struct {
	mongoURI string
	dbName   string
}

// NewAuthHandler - Initializes a new AuthHandler
func NewAuthHandler(mongoURI, dbName string) (*AuthHandler, error) {
	if mongoURI == "" || dbName == "" {
		return nil, fmt.Errorf("invalid MongoDB URI or database name")
	}
	return &AuthHandler{mongoURI: mongoURI, dbName: dbName}, nil
}

// Register - Improved register handler with JSON response
func (a *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	// Set content type to JSON
	w.Header().Set("Content-Type", "application/json")

	// Decode incoming JSON request body
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		errorResponse := map[string]string{
			"error": "Invalid request body",
		}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(errorResponse)
		return
	}

	// Validate input (basic example)
	if user.Username == "" || user.Email == "" || user.Password == "" {
		errorResponse := map[string]string{
			"error": "Missing required fields",
		}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(errorResponse)
		return
	}

	// TODO: Implement actual registration logic (e.g., save to MongoDB)
	response := map[string]interface{}{
		"message": "User registered successfully",
		"user": map[string]string{
			"username": user.Username,
			"email":    user.Email,
		},
	}

	// Write successful JSON response
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// Login - Example login handler with JSON response
func (a *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		errorResponse := map[string]string{
			"error": "Invalid request body",
		}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(errorResponse)
		return
	}

	// TODO: Implement actual login authentication logic

	response := map[string]interface{}{
		"message": "Login successful",
		"user": map[string]string{
			"username": user.Username,
		},
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func main() {
	// Get MongoDB details from environment variables
	mongoURI := os.Getenv("MONGO_URI")
	dbName := os.Getenv("DB_NAME")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017" // Default URI
	}
	if dbName == "" {
		dbName = "testDB" // Default database name
	}
	// Create auth handler
	authHandler, err := NewAuthHandler(mongoURI, dbName)
	if err != nil {
		log.Fatalf("Failed to initialize AuthHandler: %v", err)
	}
	// Create router with explicit route handling
	router := http.NewServeMux()
	router.HandleFunc("/api/auth/register", authHandler.Register)
	router.HandleFunc("/api/auth/login", authHandler.Login)
	// Add detailed logging middleware
	loggingMiddleware := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			log.Printf("Received %s request to %s", r.Method, r.URL.Path)
			next.ServeHTTP(w, r)
		})
	}
	// Wrap router with logging and CORS
	handler := loggingMiddleware(cors.Default().Handler(router))
	// Start server with more verbose logging
	port := os.Getenv("PORT")
	if port == "" {
		port = "8083" // Default port if not set
	}
	
	serverAddr := fmt.Sprintf(":%s", port)
	log.Printf("🚀 Server starting on %s", serverAddr)
	
	if err := http.ListenAndServe(serverAddr, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}