# Configuration de l'authentification n8n → API

## 📋 Étapes à suivre sur le serveur 147.93.7.103

### 1. Se connecter au serveur

```bash
ssh root@147.93.7.103
# Mot de passe : Aissayoub21
```

### 2. Créer un token secret

Génère un token aléatoire sécurisé :

```bash
openssl rand -hex 32
```

**Exemple de résultat :**
```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345
```

**Copie ce token !** Tu en auras besoin pour n8n.

### 3. Ajouter le token dans docker-compose.yml

Édite le fichier docker-compose :

```bash
cd /root/puzzio
nano docker-compose.yml
```

Trouve la section `web:` (ton service Next.js) et ajoute la variable d'environnement :

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - N8N_SECRET_TOKEN=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345  # ← TON TOKEN ICI
    volumes:
      - ./data:/app/data
```

**Sauvegarde** : `Ctrl+X`, puis `Y`, puis `Enter`

### 4. Redémarrer le container Next.js

```bash
docker compose down
docker compose up -d --build
```

Vérifie que ça fonctionne :

```bash
docker compose ps
docker compose logs web | tail -20
```

---

## 🔧 Configuration dans n8n

### 1. Ouvre ton workflow n8n

Va sur : https://n8n.urlfam-review.com/

### 2. Configure le nœud "HTTP Request" (POST /api/import-games)

Dans le nœud HTTP Request qui envoie le jeu à l'API :

#### a) Activer l'authentification

- **Authentication** : `Generic Credential Type`

#### b) Configurer le type d'auth

- **Generic Auth Type** : `Header Auth`

#### c) Créer/Sélectionner les credentials

Clique sur **"Create New Credential"** ou sélectionne "Header Auth account"

**Configuration du credential :**
- **Credential Name** : `N8N API Auth Token`
- **Name** : `Authorization`
- **Value** : `Bearer a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345`
  
  ⚠️ **Important** : Le format doit être `Bearer TON_TOKEN` (avec "Bearer" suivi d'un espace)

#### d) Sauvegarde

Clique sur **"Save"** puis **"Save"** à nouveau pour enregistrer le workflow.

---

## ✅ Test final

Relance ton workflow n8n complet. Tu devrais maintenant voir :

- ✅ Le nœud HTTP Request POST réussit (status 200)
- ✅ Le jeu est importé dans `/root/puzzio/data/games.json`
- ✅ Le jeu est visible sur http://147.93.7.103:3000

---

## 🔍 Dépannage

Si tu as encore une erreur "Unauthorized" :

1. **Vérifie que le token est identique** dans :
   - `docker-compose.yml` (variable `N8N_SECRET_TOKEN`)
   - n8n (credential `Authorization: Bearer ...`)

2. **Vérifie que le container a bien redémarré** :
   ```bash
   docker compose ps
   docker compose logs web | grep N8N_SECRET_TOKEN
   ```

3. **Teste l'API manuellement** depuis le serveur :
   ```bash
   curl -X POST http://147.93.7.103:3000/api/import-games \
     -H "Authorization: Bearer TON_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","iframe_url":"https://test.com","category":"Action"}'
   ```

   Si ça fonctionne, tu verras un message de succès.
