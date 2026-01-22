#!/bin/bash
# ============================================
# SCRIPT DE DÉPLOIEMENT DU PROXY ANTI-PUB v2.0
# ============================================

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement du Proxy Anti-Pub v2.0 pour Puzzio.io"
echo "=================================================="

# 1. Vérifier que les fichiers existent
echo "✓ Vérification des fichiers..."
if [ ! -f "nginx.conf" ]; then
    echo "❌ Erreur: nginx.conf introuvable"
    exit 1
fi

if [ ! -f "injector.js" ]; then
    echo "❌ Erreur: injector.js introuvable"
    exit 1
fi

if [ ! -f "Dockerfile.proxy" ]; then
    echo "❌ Erreur: Dockerfile.proxy introuvable"
    exit 1
fi

echo "✓ Tous les fichiers sont présents"

# 2. Build de l'image Docker (No Cache pour s'assurer que injector.js est pris en compte)
echo ""
echo "🔨 Construction de l'image Docker (No Cache)..."
docker build --no-cache -f Dockerfile.proxy -t puzzio-proxy:latest .

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build Docker"
    exit 1
fi

echo "✓ Image Docker construite avec succès"

# 3. Arrêter l'ancien conteneur (s'il existe)
echo ""
echo "🛑 Arrêt de l'ancien conteneur..."
docker stop puzzio-proxy-container 2>/dev/null || true
docker rm puzzio-proxy-container 2>/dev/null || true
echo "✓ Ancien conteneur supprimé"

# 4. Démarrer le nouveau conteneur
echo ""
echo "🚀 Démarrage du nouveau conteneur..."
docker run -d \
    --name puzzio-proxy-container \
    --restart unless-stopped \
    --network puzzio_default \
    -p 127.0.0.1:8090:80 \
    -p 9999:9999 \
    puzzio-proxy:latest

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du démarrage du conteneur"
    exit 1
fi

echo "✓ Conteneur démarré avec succès"

# 5. Vérifier que le conteneur tourne
echo ""
echo "🔍 Vérification du conteneur..."
sleep 2
docker ps | grep puzzio-proxy-container

if [ $? -ne 0 ]; then
    echo "❌ Le conteneur ne semble pas tourner"
    echo "Logs du conteneur:"
    docker logs puzzio-proxy-container
    exit 1
fi

# 6. Tester le proxy
echo ""
echo "🧪 Test du proxy..."
curl -s http://localhost:9999/ > /dev/null

if [ $? -eq 0 ]; then
    echo "✓ Proxy répond correctement"
else
    echo "⚠️  Le proxy ne répond pas (vérifiez les logs)"
fi

# 7. Afficher les informations
echo ""
echo "=================================================="
echo "✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !"
echo "=================================================="
echo ""
echo "📊 Informations du conteneur:"
docker ps | grep puzzio-proxy-container
echo ""
echo "🔗 URL du proxy: http://147.93.7.103:9999"
echo "📝 Voir les logs: docker logs -f puzzio-proxy-container"
echo "🛑 Arrêter: docker stop puzzio-proxy-container"
echo ""
echo "🎉 Le proxy Anti-Pub v2.0 est maintenant actif !"
