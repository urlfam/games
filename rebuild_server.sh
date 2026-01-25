#!/bin/bash

echo "Rebuilding on server with memory limit..."

ssh root@147.93.7.103 << 'ENDSSH'
cd /root/puzzio
git pull

# Stop container to free memory
docker stop puzzio-web-container

# Build with memory limit
docker compose build web --build-arg NODE_OPTIONS="--max-old-space-size=2048"

# Start container
docker compose up -d web

echo "Build and restart complete!"
ENDSSH
