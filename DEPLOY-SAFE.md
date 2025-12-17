# 🚨 IMPORTANT - Déploiement Serveur

## ⚠️ ATTENTION : games.json

Le fichier `data/games.json` est **généré dynamiquement** par le workflow n8n et ne doit **JAMAIS** être écrasé par Git.

### Problème rencontré (18 déc 2024)

Un `git pull` sur le serveur a écrasé `games.json` avec une version vide du repo, cassant tout le site.

### ✅ Solutions mises en place

1. **games.json est maintenant dans .gitignore**
   - Le fichier ne sera plus tracké par Git
   - Les `git pull` ne l'écraseront plus

2. **Script de backup automatique : `safe-pull.sh`**
   ```bash
   # Sur le serveur, utiliser ce script au lieu de git pull
   ./safe-pull.sh
   ```
   - Sauvegarde automatiquement `games.json` avant le pull
   - Garde les 10 derniers backups dans `/root/puzzio-backups/`

3. **Restauration en cas de problème**
   ```bash
   # Trouver le dernier backup
   ls -lht /root/puzzio-backups/
   
   # Restaurer
   cp /root/puzzio-backups/games_YYYYMMDD_HHMMSS.json /root/puzzio/data/games.json
   
   # Redémarrer
   cd /root/puzzio && docker-compose restart web
   ```

### 🔄 Workflow de déploiement recommandé

```bash
# 1. Backup automatique + pull
ssh root@147.93.7.103 "cd /root/puzzio && ./safe-pull.sh"

# 2. Rebuild si nécessaire
ssh root@147.93.7.103 "cd /root/puzzio && docker-compose up -d --build"

# 3. Vérifier que games.json existe et n'est pas vide
ssh root@147.93.7.103 "ls -lh /root/puzzio/data/games.json"
```

### 🛡️ Prévention

- **Ne JAMAIS** faire `git pull` directement sur le serveur
- **Toujours** utiliser `./safe-pull.sh`
- **Vérifier** que `games.json` n'est pas vide après un pull
- En cas de doute, relancer le workflow n8n pour régénérer les données

### 📊 Monitoring

Vérifier la taille de games.json régulièrement :
```bash
ssh root@147.93.7.103 "wc -l /root/puzzio/data/games.json"
# Devrait afficher plusieurs milliers de lignes
```

### 🔗 Fichiers concernés

- `/root/puzzio/data/games.json` - Données des jeux (NE PAS ÉCRASER)
- `/root/puzzio/safe-pull.sh` - Script de déploiement sécurisé
- `/root/puzzio-backups/` - Dossier des backups automatiques
- `.gitignore` - games.json est maintenant ignoré par Git
