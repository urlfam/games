#!/bin/bash
# Cache Warming Script for Puzzio CDN
# This script pre-warms the Cloudflare cache for homepage images

echo "🔥 Puzzio CDN Cache Warming Script"
echo "=================================="

# Fetch homepage and extract all cdn.puzzio.io image URLs
echo "📥 Fetching homepage image URLs..."

URLS=$(curl -s "https://puzzio.io/" | grep -oE 'https://cdn\.puzzio\.io/[^"]+' | sort -u)

COUNT=$(echo "$URLS" | wc -l | tr -d ' ')
echo "📊 Found $COUNT unique CDN image URLs"
echo ""

# Warm cache for each URL
WARMED=0
MISS=0
HIT=0

echo "🚀 Warming cache..."
echo ""

for URL in $URLS; do
  # Make a HEAD request to warm the cache
  STATUS=$(curl -sI "$URL" | grep -i "cf-cache-status" | awk '{print $2}' | tr -d '\r')
  
  if [ "$STATUS" = "HIT" ]; then
    ((HIT++))
    echo "✅ HIT: $(basename "$URL" | cut -c1-50)..."
  elif [ "$STATUS" = "MISS" ]; then
    ((MISS++))
    echo "🔄 MISS (now cached): $(basename "$URL" | cut -c1-50)..."
  else
    echo "⚠️  $STATUS: $(basename "$URL" | cut -c1-50)..."
  fi
  
  ((WARMED++))
done

echo ""
echo "=================================="
echo "📊 Cache Warming Complete!"
echo "   Total URLs: $WARMED"
echo "   Already cached (HIT): $HIT"
echo "   Newly cached (MISS): $MISS"
echo ""
echo "💡 Run this script again to verify all images are now HIT"
