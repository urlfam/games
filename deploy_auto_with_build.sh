#!/bin/bash

SERVER_PASSWORD="Aissayoub21"
SERVER="root@147.93.7.103"

echo "🚀 Starting automated deployment..."

# 1. Build locally
echo "📦 Building Next.js locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# 2. Create tar archive
echo "📦 Creating build archive..."
tar -czf next-build.tar.gz .next

# 3. Upload to server using sshpass
echo "⬆️  Uploading build to server..."
sshpass -p "$SERVER_PASSWORD" scp next-build.tar.gz $SERVER:/root/puzzio/

# 4. Deploy on server
echo "🔧 Deploying on server..."
sshpass -p "$SERVER_PASSWORD" ssh $SERVER << 'ENDSSH'
cd /root/puzzio
echo "📦 Extracting build..."
tar -xzf next-build.tar.gz
rm next-build.tar.gz

echo "🐳 Copying to Docker container..."
docker cp .next puzzio-web-container:/app/

echo "🔄 Restarting container..."
docker restart puzzio-web-container

echo "✅ Deployment complete!"
ENDSSH

# 5. Clean up
rm next-build.tar.gz

echo ""
echo "✅ Deployment finished successfully!"
echo "🌐 Testing site..."
sleep 5
curl -s -o /dev/null -w "Homepage: %{http_code}\n" https://puzzio.io/

echo ""
echo "🎉 All done!"
