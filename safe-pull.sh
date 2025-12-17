#!/bin/bash
# Script de backup automatique pour games.json avant git pull

BACKUP_DIR="/root/puzzio-backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Créer le dossier de backup s'il n'existe pas
mkdir -p "$BACKUP_DIR"

# Sauvegarder games.json si il existe et n'est pas vide
if [ -f "/root/puzzio/data/games.json" ] && [ -s "/root/puzzio/data/games.json" ]; then
    echo "📦 Backup de games.json..."
    cp /root/puzzio/data/games.json "$BACKUP_DIR/games_${TIMESTAMP}.json"
    echo "✅ Backup créé : $BACKUP_DIR/games_${TIMESTAMP}.json"
    
    # Garder seulement les 10 derniers backups
    cd "$BACKUP_DIR"
    ls -t games_*.json | tail -n +11 | xargs -r rm
    echo "🧹 Anciens backups nettoyés (max 10)"
else
    echo "⚠️  games.json est vide ou n'existe pas, pas de backup"
fi

# Faire le git pull
cd /root/puzzio
echo "🔄 Git pull en cours..."
git pull

echo "✅ Mise à jour terminée !"
