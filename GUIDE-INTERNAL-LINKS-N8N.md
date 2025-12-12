# 📋 Guide d'Intégration des Internal Links dans n8n

## 🎯 Objectif
Ajouter automatiquement 3 liens internes dans chaque description de jeu :
- 2 liens vers des jeux similaires de la même catégorie
- 1 lien vers la page de la catégorie

## 📦 Fichiers Créés

1. **n8n-gemini-prompt-with-placeholders.txt** : Prompt pour Gemini avec placeholders
2. **n8n-javascript-optimized.js** : Script JavaScript pour remplacer les placeholders

## 🔧 Configuration dans n8n

### Workflow Actuel
```
When clicking 'Execute workflow' 
  → Execute Command (scraper Python)
  → Code in JavaScript (parse JSON)
  → Loop Over Items
  → HTTP Request (envoie à API)
  → Wait
```

### Nouveau Workflow avec Internal Links
```
When clicking 'Execute workflow' 
  → Execute Command (scraper Python)
  → Code in JavaScript (parse JSON)
  → Loop Over Items
  → ✨ Google Gemini (génère description avec placeholders)
  → ✨ Code in JavaScript (remplace placeholders par vrais liens)
  → HTTP Request (envoie à API)
  → Wait
```

## 📝 Étape par Étape

### Étape 1 : Ajouter le nœud Google Gemini

1. **Ajouter un nœud** entre "Loop Over Items" et "HTTP Request"
2. **Type** : Google Gemini
3. **Credential** : Ta clé API Gemini
4. **Model** : `gemini-1.5-flash` (rapide) ou `gemini-1.5-pro` (qualité)
5. **Prompt** : Copier tout le contenu de `n8n-gemini-prompt-with-placeholders.txt`

### Étape 2 : Ajouter le nœud Code JavaScript

1. **Ajouter un nœud** après "Google Gemini"
2. **Type** : Code
3. **Language** : JavaScript
4. **Code** : Copier tout le contenu de `n8n-javascript-optimized.js`

**⚠️ IMPORTANT** : Le script lit `/data/games.json` dans le container n8n

#### Option A : Monter le volume dans n8n (✅ DÉJÀ FAIT)
Le volume est déjà monté avec cette commande :
```bash
docker run -d --name n8n --restart unless-stopped -p 127.0.0.1:5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /root/crazygames-import:/root/crazygames-import \
  -v /root/puzzio/data:/data:ro \
  --group-add 113 n8n-custom
```
Le dossier `/root/puzzio/data` du serveur est accessible dans `/data` dans n8n.

#### Option B : Alternative sans accès au fichier
Si n8n ne peut pas accéder à `games.json`, le script utilisera des fallbacks :
- `{{RELATED_GAME_1}}` → "other exciting games"
- `{{RELATED_GAME_2}}` → "similar titles"
- `{{CATEGORY_LINK}}` → Lien vers la catégorie (toujours fonctionnel)

### Étape 3 : Connecter les nœuds

```
Loop Over Items 
  ↓
Google Gemini
  ↓
Code (JavaScript)
  ↓
HTTP Request
```

### Étape 4 : Mapper les champs

Dans le nœud **Google Gemini**, assure-toi que :
- `{{ $json.title }}` est correctement mappé
- `{{ $json.description }}` pointe vers la description originale
- `{{ $json.category }}` est disponible

Dans le nœud **HTTP Request**, assure-toi d'utiliser :
- `{{ $json.description }}` (la nouvelle description avec liens)

## 🧪 Test

1. **Lance le workflow** avec quelques jeux
2. **Vérifie la sortie** du nœud "Code (JavaScript)"
3. **Ouvre un jeu** sur le site : http://147.93.7.103/play/[slug]
4. **Vérifie les liens** en bas de la description

## 📊 Résultat Attendu

Dans chaque description de jeu, tu devrais voir :

```html
<p>Think you can handle the challenge? Play Card Solitaire now! 
If you love Puzzle games, you might also enjoy 
<a href="/play/mahjong-puzzle">Mahjong Puzzle</a> and 
<a href="/play/sudoku-master">Sudoku Master</a>, 
or explore our complete 
<a href="/play?category=puzzle">Puzzle games collection</a> 
for even more exciting challenges!</p>
```

## 🎨 Style CSS

Les liens utilisent ces classes Tailwind :
- `text-purple-400` : Couleur violette
- `hover:text-purple-300` : Plus clair au survol
- `underline` : Souligné
- `transition-colors` : Animation fluide

Ces styles sont déjà dans `globals.css`, rien à faire !

## 🐛 Dépannage

### Problème : Les placeholders ne sont pas remplacés
**Solution** : Vérifie que le nœud Code s'exécute bien après Gemini

### Problème : games.json non accessible
**Solution** : Monte le volume ou utilise l'Option B (fallbacks)

### Problème : Liens cassés
**Solution** : Vérifie que `page_url` existe dans tes données

## ✅ Checklist Finale

- [ ] Prompt Gemini copié avec les 3 placeholders
- [ ] Script JavaScript copié dans le nœud Code
- [ ] Nœuds connectés dans le bon ordre
- [ ] Volume monté (optionnel mais recommandé)
- [ ] Test effectué sur 1-2 jeux
- [ ] Liens visibles et cliquables sur le site

## 🚀 Lancement

Une fois tout configuré, lance le workflow et profite de ton maillage interne automatisé !
