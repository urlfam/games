# Makefile for local npm workflow

.PHONY: help dev build start install lint test clean

help:
	@echo "Usage: make <target>"
	@echo "Targets:"
	@echo "  dev       Run development server (npm run dev)"
	@echo "  build     Build the app for production (npm run build)"
	@echo "  start     Run the production server (npm start)"
	@echo "  install   Install npm dependencies (npm install)"
	@echo "  lint      Run linter (npm run lint)"
	@echo "  test      Run tests (npm test)"
	@echo "  clean     Remove node_modules and .next (fresh state)"

dev:
	@echo "Starting dev server (npm run dev)"
	npm run dev

build:
	@echo "Building for production (npm run build)"
	npm run build

start:
	@echo "Starting production server (npm start)"
	npm start

install:
	@echo "Installing dependencies (npm install)"
	npm install

lint:
	@echo "Running linter (npm run lint)"
	npm run lint

test:
	@echo "Running tests (npm test)"
	npm test

clean:
	@echo "Removing node_modules and .next"
	rm -rf node_modules .next

