#!/bin/bash#!/bin/bash#!/bin/bash#!/bin/bash#!/bin/bash



# Script de déploiement automatique pour Puzzio

# Usage: ./deploy.sh "Message de commit"

# Script de déploiement automatique pour Puzzio

set -e

# Usage: ./deploy.sh "Message de commit"

# Couleurs

GREEN=$'\033[0;32m'# Script de déploiement automatique pour Puzzio

BLUE=$'\033[0;34m'

RED=$'\033[0;31m'set -e

YELLOW=$'\033[1;33m'

NC=$'\033[0m'# Usage: ./deploy.sh "Message de commit"



echo "${BLUE}╔════════════════════════════════════════╗${NC}"# Couleurs

echo "${BLUE}║   🚀 DÉPLOIEMENT AUTOMATIQUE PUZZIO   ║${NC}"

echo "${BLUE}╔════════════════════════════════════════╗${NC}"GREEN=$'\033[0;32m'# Script de déploiement automatique pour Puzzio# Script de déploiement automatique pour Puzzio

echo ""

BLUE=$'\033[0;34m'

if [ -z "$1" ]; then

    echo "${YELLOW}⚠️  Aucun message de commit fourni${NC}"RED=$'\033[0;31m'set -e

    echo "${YELLOW}Usage: ./deploy.sh \"Votre message de commit\"${NC}"

    exit 1YELLOW=$'\033[1;33m'

fi

NC=$'\033[0m'# Usage: ./deploy.sh "Message de commit"# Usage: ./deploy.sh "Message de commit"

COMMIT_MESSAGE="$1"



echo "${BLUE}📋 Fichiers modifiés:${NC}"

git status --shortecho "${BLUE}╔════════════════════════════════════════╗${NC}"# Couleurs

echo ""

echo "${BLUE}║   🚀 DÉPLOIEMENT AUTOMATIQUE PUZZIO   ║${NC}"

echo "${BLUE}➕ Ajout des fichiers...${NC}"

git add .echo "${BLUE}╔════════════════════════════════════════╗${NC}"GREEN='\033[0;32m'



if git diff --cached --quiet; thenecho ""

    echo "${YELLOW}⚠️  Aucun changement détecté. Création d'un commit vide...${NC}"

    git commit --allow-empty -m "$COMMIT_MESSAGE"BLUE='\033[0;34m'

else

    echo "${BLUE}💾 Commit: ${COMMIT_MESSAGE}${NC}"if [ -z "$1" ]; then

    git commit -m "$COMMIT_MESSAGE"

fi    echo "${YELLOW}⚠️  Aucun message de commit fourni${NC}"RED='\033[0;31m'set -e  # Arrêter si une commande échoueset -e  # Arrêter si une commande échoue



echo "${BLUE}📤 Push vers GitHub...${NC}"    echo "${YELLOW}Usage: ./deploy.sh \"Votre message de commit\"${NC}"

git push origin main

echo ""    exit 1YELLOW='\033[1;33m'



echo "${YELLOW}⏳ Attente du démarrage de GitHub Actions (10s)...${NC}"fi

sleep 10

NC='\033[0m'

echo "${BLUE}👀 Monitoring du déploiement...${NC}"

echo ""COMMIT_MESSAGE="$1"



MAX_ATTEMPTS=40

ATTEMPT=0

echo "${BLUE}📋 Fichiers modifiés:${NC}"

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do

    ATTEMPT=$((ATTEMPT + 1))git status --shortecho -e "${BLUE}╔════════════════════════════════════════╗${NC}"# Couleurs pour les messages# Couleurs pour les messages

    

    RESPONSE=$(curl -s "https://api.github.com/repos/urlfam/games/actions/runs?per_page=1")echo ""

    STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)

    CONCLUSION=$(echo "$RESPONSE" | grep -o '"conclusion":"[^"]*"' | head -1 | cut -d'"' -f4)echo -e "${BLUE}║   🚀 DÉPLOIEMENT AUTOMATIQUE PUZZIO   ║${NC}"

    

    if [ "$STATUS" = "in_progress" ] || [ "$STATUS" = "queued" ]; thenecho "${BLUE}➕ Ajout des fichiers...${NC}"

        echo "$(date '+%H:%M:%S') - [$ATTEMPT/$MAX_ATTEMPTS] 🔄 En cours: $STATUS"

    elif [ "$STATUS" = "completed" ]; thengit add .echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"GREEN='\033[0;32m'GREEN='\033[0;32m'

        echo ""

        if [ "$CONCLUSION" = "success" ]; then

            echo "${GREEN}✅ DÉPLOIEMENT RÉUSSI !${NC}"

            echo "${GREEN}🌐 https://puzzio.io${NC}"if git diff --cached --quiet; thenecho ""

            exit 0

        else    echo "${YELLOW}⚠️  Aucun changement détecté. Création d'un commit vide...${NC}"

            echo "${RED}❌ DÉPLOIEMENT ÉCHOUÉ !${NC}"

            echo "${RED}📋 https://github.com/urlfam/games/actions${NC}"    git commit --allow-empty -m "$COMMIT_MESSAGE"BLUE='\033[0;34m'BLUE='\033[0;34m'

            exit 1

        fielse

        break

    else    echo "${BLUE}💾 Commit: ${COMMIT_MESSAGE}${NC}"if [ -z "$1" ]; then

        echo "$(date '+%H:%M:%S') - [$ATTEMPT/$MAX_ATTEMPTS] ⚠️  Statut inconnu: $STATUS"

    fi    git commit -m "$COMMIT_MESSAGE"

    sleep 15

donefi    echo -e "${YELLOW}⚠️  Aucun message de commit fourni${NC}"RED='\033[0;31m'RED='\033[0;31m'



echo ""

echo "${YELLOW}⏱️  Timeout${NC}"

exit 1echo "${BLUE}📤 Push vers GitHub...${NC}"    echo -e "${YELLOW}Usage: ./deploy.sh \"Votre message de commit\"${NC}"


git push origin main

echo ""    exit 1YELLOW='\033[1;33m'YELLOW='\033[1;33m'



echo "${YELLOW}⏳ Attente du démarrage de GitHub Actions (10s)...${NC}"fi

sleep 10

NC='\033[0m' # No ColorNC='\033[0m' # No Color

echo "${BLUE}👀 Monitoring du déploiement...${NC}"

echo ""COMMIT_MESSAGE="$1"



MAX_ATTEMPTS=40

ATTEMPT=0

echo -e "${BLUE}📋 Fichiers modifiés:${NC}"

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do

    ATTEMPT=$((ATTEMPT + 1))git status --shortecho -e "${BLUE}╔════════════════════════════════════════╗${NC}"echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"

    

    RESPONSE=$(curl -s "https://api.github.com/repos/urlfam/games/actions/runs?per_page=1")echo ""

    STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)

    CONCLUSION=$(echo "$RESPONSE" | grep -o '"conclusion":"[^"]*"' | head -1 | cut -d'"' -f4)echo -e "${BLUE}║   🚀 DÉPLOIEMENT AUTOMATIQUE PUZZIO   ║${NC}"echo -e "${BLUE}║   🚀 DÉPLOIEMENT AUTOMATIQUE PUZZIO   ║${NC}"

    

    if [ "$STATUS" = "in_progress" ] || [ "$STATUS" = "queued" ]; thenecho -e "${BLUE}➕ Ajout des fichiers...${NC}"

        echo "$(date '+%H:%M:%S') - [$ATTEMPT/$MAX_ATTEMPTS] 🔄 En cours: $STATUS"

    elif [ "$STATUS" = "completed" ]; thengit add .echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"

        echo ""

        if [ "$CONCLUSION" = "success" ]; then

            echo "${GREEN}✅ DÉPLOIEMENT RÉUSSI !${NC}"

            echo "${GREEN}🌐 https://puzzio.io${NC}"if git diff --cached --quiet; thenecho ""echo ""

            exit 0

        else    echo -e "${YELLOW}⚠️  Aucun changement détecté. Création d'un commit vide...${NC}"

            echo "${RED}❌ DÉPLOIEMENT ÉCHOUÉ !${NC}"

            echo "${RED}📋 https://github.com/urlfam/games/actions${NC}"    git commit --allow-empty -m "$COMMIT_MESSAGE"

            exit 1

        fielse

        break

    else    echo -e "${BLUE}💾 Commit: ${COMMIT_MESSAGE}${NC}"# Vérifier si un message de commit est fourni# Vérifier si un message de commit est fourni

        echo "$(date '+%H:%M:%S') - [$ATTEMPT/$MAX_ATTEMPTS] ⚠️  Statut inconnu: $STATUS"

    fi    git commit -m "$COMMIT_MESSAGE"

    sleep 15

donefiif [ -z "$1" ]; thenif [ -z "$1" ]; then



echo ""

echo "${YELLOW}⏱️  Timeout${NC}"

exit 1echo -e "${BLUE}📤 Push vers GitHub...${NC}"    echo -e "${YELLOW}⚠️  Aucun message de commit fourni${NC}"    echo -e "${YELLOW}⚠️  Aucun message de commit fourni${NC}"

git push origin main

echo ""    echo -e "${YELLOW}Usage: ./deploy.sh \"Votre message de commit\"${NC}"    echo -e "${YELLOW}Usage: ./deploy.sh \"Votre message de commit\"${NC}"



echo -e "${YELLOW}⏳ Attente du démarrage de GitHub Actions (10s)...${NC}"    exit 1    exit 1

sleep 10

fifi

echo -e "${BLUE}👀 Monitoring du déploiement...${NC}"

echo ""



MAX_ATTEMPTS=40COMMIT_MESSAGE="$1"COMMIT_MESSAGE="$1"

ATTEMPT=0



while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do

    ATTEMPT=$((ATTEMPT + 1))# 1. Vérifier les fichiers modifiés# 1. Vérifier les fichiers modifiés

    

    RESPONSE=$(curl -s "https://api.github.com/repos/urlfam/games/actions/runs?per_page=1")echo -e "${BLUE}📋 Fichiers modifiés:${NC}"echo -e "${BLUE}📋 Fichiers modifiés:${NC}"

    STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)

    CONCLUSION=$(echo "$RESPONSE" | grep -o '"conclusion":"[^"]*"' | head -1 | cut -d'"' -f4)git status --shortgit status --short

    

    if [ "$STATUS" = "in_progress" ] || [ "$STATUS" = "queued" ]; thenecho ""echo ""

        echo -e "$(date '+%H:%M:%S') - [$ATTEMPT/$MAX_ATTEMPTS] 🔄 En cours: $STATUS"

    elif [ "$STATUS" = "completed" ]; then

        echo ""

        if [ "$CONCLUSION" = "success" ]; then# 2. Ajouter tous les fichiers modifiés# 2. Ajouter tous les fichiers modifiés

            echo -e "${GREEN}✅ DÉPLOIEMENT RÉUSSI !${NC}"

            echo -e "${GREEN}🌐 https://puzzio.io${NC}"echo -e "${BLUE}➕ Ajout des fichiers...${NC}"echo -e "${BLUE}➕ Ajout des fichiers...${NC}"

            exit 0

        elsegit add .git add .

            echo -e "${RED}❌ DÉPLOIEMENT ÉCHOUÉ !${NC}"

            echo -e "${RED}📋 https://github.com/urlfam/games/actions${NC}"

            exit 1

        fi# 3. Commit# 3. Commit

        break

    else# Vérifier s'il y a des changements à commiterecho -e "${BLUE}💾 Commit: ${COMMIT_MESSAGE}${NC}"

        echo -e "$(date '+%H:%M:%S') - [$ATTEMPT/$MAX_ATTEMPTS] ⚠️  Statut inconnu: $STATUS"

    fiif git diff --cached --quiet; thengit commit -m "$COMMIT_MESSAGE"

    sleep 15

done    echo -e "${YELLOW}⚠️  Aucun changement détecté. Création d'un commit vide pour déclencher le déploiement...${NC}"



echo ""    git commit --allow-empty -m "$COMMIT_MESSAGE"# 4. Push vers GitHub

echo -e "${YELLOW}⏱️  Timeout${NC}"

exit 1elseecho -e "${BLUE}📤 Push vers GitHub...${NC}"

    echo -e "${BLUE}💾 Commit: ${COMMIT_MESSAGE}${NC}"git push origin main

    git commit -m "$COMMIT_MESSAGE"echo ""

fi

# 5. Attendre quelques secondes pour que GitHub Actions démarre

# 4. Push vers GitHubecho -e "${YELLOW}⏳ Attente du démarrage du workflow GitHub Actions (10s)...${NC}"

echo -e "${BLUE}📤 Push vers GitHub...${NC}"sleep 10

git push origin main

echo ""# 6. Monitorer le déploiement

echo -e "${BLUE}👀 Monitoring du déploiement...${NC}"

# 5. Attendre quelques secondes pour que GitHub Actions démarreecho ""

echo -e "${YELLOW}⏳ Attente du démarrage du workflow GitHub Actions (10s)...${NC}"

sleep 10MAX_ATTEMPTS=40  # 40 * 15s = 10 minutes max

ATTEMPT=0

# 6. Monitorer le déploiement

echo -e "${BLUE}👀 Monitoring du déploiement...${NC}"while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do

echo ""    ATTEMPT=$((ATTEMPT + 1))

    

MAX_ATTEMPTS=40  # 40 * 15s = 10 minutes max    # Récupérer le statut du dernier workflow

ATTEMPT=0    RESPONSE=$(curl -s "https://api.github.com/repos/urlfam/games/actions/runs?per_page=1")

    STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do    CONCLUSION=$(echo "$RESPONSE" | grep -o '"conclusion":"[^"]*"' | head -1 | cut -d'"' -f4)

    ATTEMPT=$((ATTEMPT + 1))    

        # Afficher le statut

    # Récupérer le statut du dernier workflow    if [ "$STATUS" = "in_progress" ] || [ "$STATUS" = "queued" ]; then

    RESPONSE=$(curl -s "https://api.github.com/repos/urlfam/games/actions/runs?per_page=1")        echo -e "$(date '+%H:%M:%S') - [$ATTEMPT/$MAX_ATTEMPTS] 🔄 En cours: $STATUS"

    STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)    elif [ "$STATUS" = "completed" ]; then

    CONCLUSION=$(echo "$RESPONSE" | grep -o '"conclusion":"[^"]*"' | head -1 | cut -d'"' -f4)        echo ""

            if [ "$CONCLUSION" = "success" ]; then

    # Afficher le statut            echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"

    if [ "$STATUS" = "in_progress" ] || [ "$STATUS" = "queued" ]; then            echo -e "${GREEN}║  ✅ DÉPLOIEMENT RÉUSSI !               ║${NC}"

        echo -e "$(date '+%H:%M:%S') - [$ATTEMPT/$MAX_ATTEMPTS] 🔄 En cours: $STATUS"            echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"

    elif [ "$STATUS" = "completed" ]; then            echo ""

        echo ""            echo -e "${GREEN}🌐 Site en ligne: https://puzzio.io${NC}"

        if [ "$CONCLUSION" = "success" ]; then            echo -e "${GREEN}📊 Actions: https://github.com/urlfam/games/actions${NC}"

            echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"            exit 0

            echo -e "${GREEN}║  ✅ DÉPLOIEMENT RÉUSSI !               ║${NC}"        else

            echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"            echo -e "${RED}╔════════════════════════════════════════╗${NC}"

            echo ""            echo -e "${RED}║  ❌ DÉPLOIEMENT ÉCHOUÉ !               ║${NC}"

            echo -e "${GREEN}🌐 Site en ligne: https://puzzio.io${NC}"            echo -e "${RED}╚════════════════════════════════════════╝${NC}"

            echo -e "${GREEN}📊 Actions: https://github.com/urlfam/games/actions${NC}"            echo ""

            exit 0            echo -e "${RED}📋 Vérifiez les logs: https://github.com/urlfam/games/actions${NC}"

        else            exit 1

            echo -e "${RED}╔════════════════════════════════════════╗${NC}"        fi

            echo -e "${RED}║  ❌ DÉPLOIEMENT ÉCHOUÉ !               ║${NC}"        break  # Sortir de la boucle dans tous les cas si completed

            echo -e "${RED}╚════════════════════════════════════════╝${NC}"    else

            echo ""        echo -e "$(date '+%H:%M:%S') - [$ATTEMPT/$MAX_ATTEMPTS] ⚠️  Statut inconnu: $STATUS"

            echo -e "${RED}📋 Vérifiez les logs: https://github.com/urlfam/games/actions${NC}"    fi

            exit 1    

        fi    # Attendre avant la prochaine vérification

        break    sleep 15

    elsedone

        echo -e "$(date '+%H:%M:%S') - [$ATTEMPT/$MAX_ATTEMPTS] ⚠️  Statut inconnu: $STATUS"

    fi# Timeout

    echo ""

    # Attendre avant la prochaine vérificationecho -e "${YELLOW}⏱️  Timeout - Le déploiement prend plus de 10 minutes${NC}"

    sleep 15echo -e "${YELLOW}📋 Vérifiez manuellement: https://github.com/urlfam/games/actions${NC}"

doneexit 1


# Timeout
echo ""
echo -e "${YELLOW}⏱️  Timeout - Le déploiement prend plus de 10 minutes${NC}"
echo -e "${YELLOW}📋 Vérifiez manuellement: https://github.com/urlfam/games/actions${NC}"
exit 1
