# 🔧 Fix n8n Internal Links - Guide Rapide

## 🎯 Problème Identifié

L'API `/api/all-games` fonctionne correctement, mais le code JavaScript dans n8n ne récupère pas les données correctement depuis la réponse HTTP.

## ✅ Solution

### Étape 1 : Mettre à jour le prompt Gemini

Dans n8n, va dans le nœud **"Message a model"** (Gemini) et remplace le prompt par le contenu de :

```
n8n-gemini-prompt-with-placeholders.txt
```

✅ Vérifie que le prompt se termine bien par les instructions avec `__RELATED_GAME_1__`, `__RELATED_GAME_2__`, `__CATEGORY_LINK__`

### Étape 2 : Mettre à jour le code JavaScript

Dans n8n, va dans le nœud **"Code in JavaScript"** et remplace tout le code par le contenu de :

```
n8n-javascript-fixed.js
```

### Étape 3 : Vérifier la connexion des nœuds

```
Loop Over Items
  ↓
Message a model (Gemini)
  ↓
Code in JavaScript
  ↓
HTTP Request
```

### Étape 4 : Tester avec UN jeu

1. Lance le workflow
2. Regarde les **logs du nœud "Code in JavaScript"**
3. Tu devrais voir :

```
✅ Jeux chargés via HTTP ! Nombre: 77
🔍 Jeux de la catégorie Driving: 3
  - Truck Simulator Real
  - DriveOff
  - Escape Road 2
🎯 Jeux similaires trouvés: 2
✅ Remplacé RELATED_GAME_1 par: DriveOff
✅ Remplacé RELATED_GAME_2 par: Escape Road 2
✅ Remplacé CATEGORY_LINK
```

### Étape 5 : Vérifier le résultat

Le dernier paragraphe de la description devrait contenir :

```html
<p>
  Ready to start playing? Jump into Truck Simulator Real now! If you're hooked
  on Driving games, you'll love <a href="/play/driveoff">DriveOff</a> and
  <a href="/play/escape-road-2">Escape Road 2</a>. Want more? Explore our
  <a href="/play?category=driving">Driving games collection</a> for endless
  entertainment!
</p>
```

## 🐛 Debugging

Si ça ne fonctionne toujours pas, regarde les logs du nœud Code et cherche :

### Problème 1 : `Nombre: 0`

**Cause** : L'API ne retourne pas de données
**Solution** : Vérifie que le container Next.js est bien démarré avec `docker ps`

### Problème 2 : `ERREUR HTTP: ...`

**Cause** : Le container n8n ne peut pas accéder à l'API
**Solution** : Vérifie l'URL dans le code : `http://147.93.7.103:3000/api/all-games`

### Problème 3 : `Jeux de la catégorie X: 0`

**Cause** : Pas de jeux dans cette catégorie
**Solution** : C'est normal, les fallbacks seront utilisés ("other exciting games")

## 📊 Résultat Final Attendu

Une fois que tout fonctionne, chaque jeu importé aura :

- ✅ Une description SEO-optimized générée par Gemini
- ✅ 2 liens vers des jeux similaires de la même catégorie
- ✅ 1 lien vers la page de catégorie
- ✅ Un style cohérent avec le thème du site (violet/dark)

## 🚀 Lancement en Production

Une fois que les tests fonctionnent avec 1-2 jeux, tu peux lancer l'import en masse :

1. Supprime la limite dans le scraper (si elle existe)
2. Lance le workflow
3. Laisse-le tourner (peut prendre du temps avec Gemini)
4. Les jeux seront importés avec descriptions optimisées !

---

✅ **API Next.js déployée** : http://147.93.7.103:3000/api/all-games  
✅ **Prompt Gemini mis à jour** : Avec placeholders  
✅ **Code JavaScript corrigé** : Avec meilleur handling HTTP

Tout est prêt ! 🎉
