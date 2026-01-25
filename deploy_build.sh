#!/bin/bash

echo "📦 Copying .next build folder to server..."

# Create tar archive of .next folder
tar -czf next-build.tar.gz .next

# Upload to server
scp next-build.tar.gz root@147.93.7.103:/root/puzzio/

# Extract on server and restart
ssh root@147.93.7.103 << 'ENDSSH'
cd /root/puzzio
tar -xzf next-build.tar.gz
rm next-build.tar.gz
docker restart puzzio-web-container
echo "✅ Build deployed and container restarted!"
ENDSSH

# Clean up local tar
rm next-build.tar.gz

echo "✅ Deployment complete!"
