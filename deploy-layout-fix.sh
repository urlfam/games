#!/bin/bash
set -e

PASSWORD="Aissayoub21"
HOST="root@147.93.7.103"
REMOTE_DIR="/root/puzzio"

echo "Deploying Layout Fix for Admin Isolation..."

echo "1. Uploading modified Middleware..."
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no middleware.ts $HOST:$REMOTE_DIR/middleware.ts

echo "2. Uploading modified Root Layout..."
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no app/layout.tsx $HOST:$REMOTE_DIR/app/layout.tsx

echo "3. Rebuilding Docker Container (forcing removal of old container)..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $HOST "cd $REMOTE_DIR && docker stop puzzio-web-container || true && docker rm -f puzzio-web-container || true && docker-compose up -d --build web"

echo "4. Done! Admin panel should now be isolated."
