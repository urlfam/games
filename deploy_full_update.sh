#!/bin/bash
set -e

PASSWORD="Aissayoub21"
HOST="root@147.93.7.103"
REMOTE_DIR="/root/puzzio"

echo "Step 1: Uploading Source Code..."

# Upload App directories
echo "  - Uploading App..."
sshpass -p "$PASSWORD" scp -r -o StrictHostKeyChecking=no app "$HOST:$REMOTE_DIR/"

echo "  - Uploading Components..."
sshpass -p "$PASSWORD" scp -r -o StrictHostKeyChecking=no components "$HOST:$REMOTE_DIR/"

echo "  - Uploading Lib..."
sshpass -p "$PASSWORD" scp -r -o StrictHostKeyChecking=no lib "$HOST:$REMOTE_DIR/"

echo "  - Uploading Public..."
sshpass -p "$PASSWORD" scp -r -o StrictHostKeyChecking=no public "$HOST:$REMOTE_DIR/"

echo "  - Uploading Configs..."
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no middleware.ts "$HOST:$REMOTE_DIR/"
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no next.config.js "$HOST:$REMOTE_DIR/"
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no package.json "$HOST:$REMOTE_DIR/"
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no tailwind.config.js "$HOST:$REMOTE_DIR/"

echo "Step 2: Rebuilding and Restarting..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $HOST "
    cd $REMOTE_DIR && \
    mkdir -p public/uploads && \
    mkdir -p data && \
    echo 'Building image...' && \
    docker build -t puzzio_web:latest . && \
    echo 'Stopping old container...' && \
    docker rm -f puzzio-web-container || true && \
    echo 'Starting new container...' && \
    docker run -d \
        --name puzzio-web-container \
        --restart unless-stopped \
        --network puzzio_default \
        -p 3000:3000 \
        --env-file .env.local \
        -e NODE_ENV=production \
        -v $REMOTE_DIR/data:/app/data \
        -v $REMOTE_DIR/public/previews:/app/public/previews \
        -v $REMOTE_DIR/public/uploads:/app/public/uploads \
        puzzio_web:latest
"

echo "Step 3: Checking logs..."
sleep 5
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $HOST "docker logs --tail 50 puzzio-web-container"

echo "Deployment Finished."
