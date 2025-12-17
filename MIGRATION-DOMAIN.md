# 🔄 MIGRATION VERS PUZZIO.IO

Ce fichier documente comment remplacer `http://147.93.7.103` par `https://puzzio.io` quand le domaine sera configuré.

## 📋 Fichiers à modifier

### 1. nginx.conf (proxy)
**Emplacement**: `/root/puzzio/nginx.conf`

**Remplacements à faire** (rechercher/remplacer):
```bash
# ANCIEN
http://147.93.7.103

# NOUVEAU
https://puzzio.io
```

**Lignes concernées** (~25 occurrences):
- Ligne ~155-170: SEO Hijacking (canonical, og:url, twitter:url)
- Ligne ~145-150: API rewrites

### 2. injector.js (script anti-pub)
**Emplacement**: `/root/puzzio/injector.js`

**Remplacements à faire**:
```javascript
// ANCIEN (ligne ~300)
var domains = {
    "api.intentia.com": "147.93.7.103:9999/proxy/api.intentia.com",
    ...
}

// NOUVEAU
var domains = {
    "api.intentia.com": "puzzio.io/proxy/api.intentia.com",
    ...
}
```

**Note**: Retirer le port `:9999` car nginx sera sur le port 80/443 standard avec le domaine.

### 3. app/play/[slug]/page.tsx (Next.js)
**Emplacement**: `/app/play/[slug]/page.tsx`

**Remplacements à faire** (ligne ~53):
```typescript
// ANCIEN
const proxyBaseUrl = process.env.NEXT_PUBLIC_PROXY_URL || 'http://147.93.7.103:9999';

// NOUVEAU
const proxyBaseUrl = process.env.NEXT_PUBLIC_PROXY_URL || 'https://puzzio.io/proxy';
```

**Ou mieux** - Utiliser une variable d'environnement:
```bash
# .env.production
NEXT_PUBLIC_PROXY_URL=https://puzzio.io/proxy
```

## 🚀 Commande de déploiement après modification

```bash
# 1. Redéployer le proxy nginx
cd /root/puzzio
./deploy-proxy.sh

# 2. Redéployer Next.js (si modifié)
docker-compose down
docker-compose up -d --build
```

## ✅ Vérifications SEO après migration

1. **Canonical URL**:
   ```bash
   curl -s https://puzzio.io/play/entropy | grep "canonical"
   # Doit afficher: <link rel="canonical" href="https://puzzio.io/...">
   ```

2. **Open Graph URL**:
   ```bash
   curl -s https://puzzio.io/play/entropy | grep "og:url"
   # Doit afficher: <meta property="og:url" content="https://puzzio.io/...">
   ```

3. **Test de partage social**:
   - Facebook Debugger: https://developers.facebook.com/tools/debug/
   - Twitter Card Validator: https://cards-dev.twitter.com/validator

## 📝 Notes importantes

- ⚠️ **HTTPS obligatoire** : Utiliser Let's Encrypt pour le certificat SSL
- ⚠️ **Nginx config** : Ajouter une redirection 80 → 443 (HTTP → HTTPS)
- ⚠️ **Port 9999** : Sera accessible uniquement en interne (localhost)
- ⚠️ **CDN** : Considérer Cloudflare pour la performance

## 🔐 Configuration SSL recommandée

```nginx
server {
    listen 80;
    server_name puzzio.io www.puzzio.io;
    return 301 https://puzzio.io$request_uri;
}

server {
    listen 443 ssl http2;
    server_name puzzio.io www.puzzio.io;
    
    ssl_certificate /etc/letsencrypt/live/puzzio.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/puzzio.io/privkey.pem;
    
    # ... reste de la config
}
```

## 📞 Contact
En cas de problème lors de la migration, vérifier :
1. DNS pointe bien vers 147.93.7.103
2. Certificat SSL est valide
3. Ports 80 et 443 sont ouverts
4. Nginx redémarre sans erreur
