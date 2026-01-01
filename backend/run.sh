#!/bin/bash
export GOROOT=$HOME/go-install/go
export PATH=$PATH:$GOROOT/bin
cd "$(dirname "$0")"
go run cmd/server/main.go
