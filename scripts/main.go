// KayBiT_CEHinteractive - Go / Golang Single-Binary Embedded Microservice
// Package this application into a self-contained, zero-dependency executable
// using standard Go embed package.
//
// Build instructions:
//   npm run build
//   go build -ldflags="-s -w" -o kaybit_ceh_srv scripts/main.go
//   ./kaybit_ceh_srv

package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// In production, embed the compiled dist directory:
//
//go:embed all:dist
var embeddedDist embed.FS

func main() {
	port := "8080"
	if envPort := os.Getenv("PORT"); envPort != "" {
		port = envPort
	}

	distSub, err := fs.Sub(embeddedDist, "dist")
	var fileServer http.Handler
	if err != nil {
		// Fallback to local directory if not yet compiled into binary
		log.Println("[!] Embedded 'dist' not found. Falling back to filesystem './dist'")
		fileServer = http.FileServer(http.Dir("./dist"))
	} else {
		fileServer = http.FileServer(http.FS(distSub))
	}

	mux := http.NewServeMux()

	// Health check endpoint
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"status":"ok","app":"KayBiT_CEHinteractive","version":"1.0.0"}`)
	})

	// Static file serving with cache headers
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "SAMEORIGIN")
		fileServer.ServeHTTP(w, r)
	})

	server := &http.Server{
		Addr:         "127.0.0.1:" + port,
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	fmt.Println("================================================================")
	fmt.Println("  KayBiT_CEHinteractive - Go Embedded Single-Binary Microservice")
	fmt.Printf("  Serving application at: http://127.0.0.1:%s\\n", port)
	fmt.Println("  Compile into portable standalone binary via: go build")
	fmt.Println("================================================================")

	// Graceful shutdown channel
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %s", err)
		}
	}()

	<-stop
	fmt.Println("\\n[*] Shutting down Go microservice cleanly...")
}
