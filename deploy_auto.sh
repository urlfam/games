#!/bin/bash
set -e

# Colors
GREEN=$'\033[0;32m'
BLUE=$'\033[0;34m'
YELLOW=$'\033[1;33m'
RED=$'\033[0;31m'
NC=$'\033[0m'

echo "${BLUE}=== PUZZIO AUTO DEPLOY ===${NC}"
echo ""

if [ -z "$1" ]; then
    echo "${YELLOW}Error: No commit message provided.${NC}"
    echo "Usage: ./deploy_auto.sh \"Commit message\""
    exit 1
fi

MSG="$1"

echo "${BLUE}Status check...${NC}"
git status --short
echo ""

echo "${BLUE}git add .${NC}"
git add .

echo "${BLUE}git commit...${NC}"
if git diff --cached --quiet; then
    echo "${YELLOW}No changes. Creating empty commit...${NC}"
    git commit --allow-empty -m "$MSG"
else
    git commit -m "$MSG"
fi

echo "${BLUE}git push...${NC}"
git push origin main

echo "${YELLOW}Waiting for workflow (10s)...${NC}"
sleep 10

echo "${BLUE}Monitoring...${NC}"

MAX=40
I=0

while [ $I -lt $MAX ]; do
    I=$((I + 1))
    
    # Fetch status with cleaner parsing
    RESPONSE=$(curl -s "https://api.github.com/repos/urlfam/games/actions/runs?per_page=1")
    STATUS=$(echo "$RESPONSE" | grep -o "\"status\": *\"[^\"]*\"" | head -1 | sed 's/.*: *"//;s/"//')
    CONCLUSION=$(echo "$RESPONSE" | grep -o "\"conclusion\": *\"[^\"]*\"" | head -1 | sed 's/.*: *"//;s/"//')

    if [ "$STATUS" = "in_progress" ] || [ "$STATUS" = "queued" ] || [ "$STATUS" = "waiting" ]; then
        echo "[$I/$MAX] 🔄 In progress: $STATUS"
    elif [ "$STATUS" = "completed" ]; then
        echo ""
        if [ "$CONCLUSION" = "success" ]; then
            echo "${GREEN}✅ SUCCESS! Deployed.${NC}"
            echo "${GREEN}🌐 https://puzzio.io${NC}"
            exit 0
        else
            echo "${RED}❌ FAILED! Check logs.${NC}"
            echo "${RED}📋 https://github.com/urlfam/games/actions${NC}"
            exit 1
        fi
        break
    else
        echo "[$I/$MAX] ⚠️  Unknown status: $STATUS"
    fi
    sleep 15
done

echo "${YELLOW}⏱️  Timeout.${NC}"
exit 1
