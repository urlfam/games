#!/bin/bash
set -e

PASSWORD="Aissayoub21"
HOST="root@147.93.7.103"
REMOTE_DIR="/root/puzzio"

# 1. Upload files
echo "Step 1: Uploading CMS Upgrade..."

echo "  - Uploading App Pages..."
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no "app/page.tsx" "$HOST:$REMOTE_DIR/app/page.tsx"
sshpass -p "$PASSWORD" scp -r -o StrictHostKeyChecking=no "app/[slug]" "$HOST:$REMOTE_DIR/app/"

echo "  - Uploading Admin Panel..."
sshpass -p "$PASSWORD" scp -r -o StrictHostKeyChecking=no "app/admin" "$HOST:$REMOTE_DIR/app/"

echo "  - Uploading Libs..."
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no "lib/cms.ts" "$HOST:$REMOTE_DIR/lib/cms.ts"
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no "lib/games.ts" "$HOST:$REMOTE_DIR/lib/games.ts"
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no "lib/cloudinaryLoader.ts" "$HOST:$REMOTE_DIR/lib/cloudinaryLoader.ts"

# 2. Remote execution
echo "Step 2: Building and Redeploying..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $HOST "
    cd $REMOTE_DIR
    
    # Ensure upload directory exists on host
    mkdir -p public/uploads
    mkdir -p data

    NETWORK=\$(docker network ls | grep puzzio_default | awk '{print \$2}')
    if [ -z \"\$NETWORK\" ]; then
        docker network create puzzio_default || true
        NETWORK=\"puzzio_default\"
    fi

    echo \"Building image...\"
    docker build -t puzzio_web:latest .

    echo \"Restarting container...\"
    docker rm -f puzzio-web-container || true

    docker run -d \\
        --name puzzio-web-container \\
        --restart unless-stopped \\
        --network \$NETWORK \\
        -p 3000:3000 \\
        --env-file .env.local \\
        -e NODE_ENV=production \\
        -v $REMOTE_DIR/data:/app/data \\
        -v $REMOTE_DIR/public/previews:/app/public/previews \\
        -v $REMOTE_DIR/public/uploads:/app/public/uploads \\
        puzzio_web:latest

    echo \"Deployment complete.\"
"
