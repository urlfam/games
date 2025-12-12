# 🔐 Configuration Authentification n8n (SIMPLIFIÉ)

## ✅ Le token existe déjà !

Le token est : `changeMe_a1b2c3d4e5f6_make_this_secret_and_long`

Pas besoin de modifier le serveur, il faut juste configurer n8n !

---

## 📋 Configuration dans n8n (ÉTAPE UNIQUE)

### 1. Ouvre ton workflow n8n

https://n8n.urlfam-review.com/

### 2. Configure le nœud "HTTP Request" (celui qui POST vers /api/import-games)

Clique sur le nœud **HTTP Request** (le dernier avant "Wait")

### 3. Section "Authentication"

- **Authentication** : Sélectionne `Generic Credential Type`
- **Generic Auth Type** : Sélectionne `Header Auth`

### 4. Section "Credential for Header Auth"

Clique sur **"Create New Credential"**

Dans la fenêtre qui s'ouvre :

- **Credential Name** : `Puzzio API Token`
- **Name** : `Authorization`
- **Value** : `Bearer changeMe_a1b2c3d4e5f6_make_this_secret_and_long`

⚠️ **IMPORTANT** : Le format EXACT est :
```
Bearer changeMe_a1b2c3d4e5f6_make_this_secret_and_long
```
(Avec "Bearer" suivi d'un espace, puis le token)

### 5. Sauvegarde

1. Clique sur **"Save"** dans la fenêtre du credential
2. Clique sur **"Save"** dans le workflow

---

## ✅ C'est tout !

Relance ton workflow, ça devrait fonctionner maintenant ! 🚀

Le nœud HTTP Request POST enverra automatiquement le header :
```
Authorization: Bearer changeMe_a1b2c3d4e5f6_make_this_secret_and_long
```

Et l'API l'acceptera ! ✅
