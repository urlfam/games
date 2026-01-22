#!/bin/bash
set -e

PASSWORD="Aissayoub21"
HOST="root@147.93.7.103"
REMOTE_DIR="/root/puzzio"

echo "Deploying Login Fix..."

echo "1. Uploading app/admin/actions.ts..."
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no app/admin/actions.ts $HOST:$REMOTE_DIR/app/admin/actions.ts

echo "2. Rebuilding Docker Container..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $HOST "cd $REMOTE_DIR && docker stop puzzio-web-container || true && docker rm -f puzzio-web-container || true && docker-compose up -d --build web"

echo "Done."
