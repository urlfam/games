#!/bin/bash
# Enable error handling
set -e

PASSWORD="Aissayoub21"
HOST="root@147.93.7.103"
REMOTE_DIR="/root/puzzio"

echo "Step 1: Uploading route.ts..."
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no app/api/import-games/route.ts $HOST:$REMOTE_DIR/app/api/import-games/route.ts

echo "Step 2: Rebuilding and recreating container..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $HOST "cd $REMOTE_DIR && docker-compose up -d --build --force-recreate web"

echo "Step 3: Checking logs..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $HOST "docker logs --tail 20 puzzio-web-container"

echo "Done."
