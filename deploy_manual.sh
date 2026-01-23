#!/bin/bash
set -e

PASSWORD="Aissayoub21"
HOST="root@147.93.7.103"
REMOTE_DIR="/root/puzzio"

# 1. Upload files
echo "Step 1: Uploading code changes..."

echo "  - Uploading App Pages..."
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no "app/page.tsx" "$HOST:$REMOTE_DIR/app/page.tsx"
sshpass -p "$PASSWORD" scp -r -o StrictHostKeyChecking=no "app/contact" "$HOST:$REMOTE_DIR/app/"
sshpass -p "$PASSWORD" scp -r -o StrictHostKeyChecking=no "app/game" "$HOST:$REMOTE_DIR/app/"

echo "  - Uploading Admin Panel..."
sshpass -p "$PASSWORD" scp -r -o StrictHostKeyChecking=no "app/admin" "$HOST:$REMOTE_DIR/app/"

echo "  - Uploading Libs..."
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no "lib/games.ts" "$HOST:$REMOTE_DIR/lib/games.ts"
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no "lib/seo.ts" "$HOST:$REMOTE_DIR/lib/seo.ts"
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no "lib/cloudinaryLoader.ts" "$HOST:$REMOTE_DIR/lib/cloudinaryLoader.ts"

# 2. Remote execution
echo "Step 2: Restarting with existing image..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $HOST "
    cd $REMOTE_DIR
    
    # Ensure directories exist
    mkdir -p public/uploads
    mkdir -p data

    NETWORK=\$(docker network ls | grep puzzio_default | awk '{print \$2}')
    if [ -z \"\$NETWORK\" ]; then
        docker network create puzzio_default || true
        NETWORK=\"puzzio_default\"
    fi

    echo \"Stopping container...\"
    docker rm -f puzzio-web-container || true

    echo \"Starting with updated code (using existing image)...\"
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
        -v $REMOTE_DIR/app:/app/app \\
        -v $REMOTE_DIR/lib:/app/lib \\
        -v $REMOTE_DIR/.next:/app/.next \\
        puzzio_web:latest

    echo \"Clearing Next.js cache and restarting...\"
    docker exec puzzio-web-container sh -c 'rm -rf .next/cache/* || true'
    docker restart puzzio-web-container

    echo \"Deployment complete!\"
"
