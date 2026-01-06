import requests
from bs4 import BeautifulSoup
import json
import time
import sys
from datetime import datetime

# --- Configuration ---
BASE_URL = "https://www.crazygames.com"
NEW_GAMES_URL = f"{BASE_URL}/new"
IMAGE_BASE_URL = "https://imgs.crazygames.com"
VIDEO_BASE_URL = "https://videos.crazygames.com" # Base pour les previews vidéo
MAX_GAMES_TO_PROCESS = 70 

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
}

def log_message(message):
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {message}", file=sys.stderr)

def get_new_games_list():
    log_message(f"Récupération de la liste des jeux depuis : {NEW_GAMES_URL}")
    try:
        resp = requests.get(NEW_GAMES_URL, headers=HEADERS, timeout=10)
        resp.raise_for_status()
    except requests.exceptions.RequestException as e:
        log_message(f"  -> Erreur: {e}")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    script_tag = soup.find('script', {'id': '__NEXT_DATA__'})
    if not script_tag:
        return []

    try:
        data = json.loads(script_tag.string)
        games_list_data = []
        
        # Exploration de la structure Next.js pour trouver la liste des jeux
        if 'props' in data and 'pageProps' in data['props']:
            page_props = data['props']['pageProps']
            if 'games' in page_props and 'items' in page_props['games']:
                games_list_data = page_props['games']['items']
            elif 'apolloState' in page_props and 'ROOT_QUERY' in page_props['apolloState']:
                root_query = page_props['apolloState']['ROOT_QUERY']
                for key, value in root_query.items():
                    if 'newGames' in key or 'games' in key:
                        if isinstance(value, list):
                            games_list_data.extend(value)
                        elif isinstance(value, dict) and 'items' in value:
                            games_list_data.extend(value['items'])
        
        games = []
        for game in games_list_data:
            if isinstance(game, dict):
                slug = game.get('slug')
                if not slug and '__ref' in game:
                    ref = game['__ref']
                    if ':' in ref: slug = ref.split(':')[-1]
                if slug:
                    games.append({'url': f"{BASE_URL}/game/{slug}", 'slug': slug})
        
        return games
    except Exception as e:
        log_message(f"  -> Erreur parsing liste: {e}")
        return []

def get_game_details_from_page(game_url):
    try:
        resp = requests.get(game_url, headers=HEADERS, timeout=10)
        resp.raise_for_status()
    except Exception as e:
        return None

    soup = BeautifulSoup(resp.text, "html.parser")
    # --- Extraction de l'URL Youtube via JSON-LD ---
    youtube_video_url = None
    try:
        json_ld_scripts = soup.find_all('script', type="application/ld+json")
        for script in json_ld_scripts:
            if script.string:
                try:
                    data = json.loads(script.string)
                    if isinstance(data, dict): data = [data]
                    for item in data:
                        if item.get('@type') == 'VideoObject' and 'embedUrl' in item:
                            youtube_video_url = item['embedUrl']
                            break
                except: continue
            if youtube_video_url: break
    except Exception: pass
    # -----------------------------------------------

    script_tag = soup.find('script', {'id': '__NEXT_DATA__'})
    if not script_tag: return None

    try:
        data = json.loads(script_tag.string)
        game_data = data['props']['pageProps']['game']

        title = game_data.get('name')
        
        # Nettoyage de la description
        description_raw = game_data.get('descriptionFirst') or game_data.get('description')
        description = "Pas de description"
        if description_raw:
            description = BeautifulSoup(description_raw, "html.parser").get_text(separator=" ").strip()
        
        # iframe_url = game_data.get('desktopUrl') or game_data.get('url')
        # Modification pour utiliser le proxy
        slug = game_url.rstrip('/').split('/')[-1]
        iframe_url = f"http://147.93.7.103:9999/game/{slug}"

        cover_path = game_data.get('cover')
        image_url = f"{IMAGE_BASE_URL}/{cover_path}" if cover_path else "Non trouvée"

        # --- DEBUT AJOUT : EXTRACTION IMAGES MOBILES (2x3 ET 1x1) ---
        mobile_image_url = image_url # Par défaut (fallback)
        mobile_1x1_url = "Non trouvée" # Par défaut pour la 1x1

        covers = game_data.get('covers')
        if covers and isinstance(covers, dict):
            # 1. Image Portrait (2x3)
            path_2x3 = covers.get('2x3')
            path_1x1 = covers.get('1x1')

            # Logique pour l'image mobile principale (priorité 2x3, sinon 1x1)
            if path_2x3:
                mobile_image_url = f"{IMAGE_BASE_URL}/{path_2x3}"
            elif path_1x1:
                mobile_image_url = f"{IMAGE_BASE_URL}/{path_1x1}"
            
            # 2. Image Carrée (1x1) spécifique
            if path_1x1:
                mobile_1x1_url = f"{IMAGE_BASE_URL}/{path_1x1}"
        # --- FIN AJOUT ---
        
        # --- LOGIQUE CATÉGORIE (Genre Principal) ---
        category = "Non classé"
        primary_cat = game_data.get('category')
        if primary_cat and isinstance(primary_cat, dict):
            category = primary_cat.get('name')
        
        # --- LOGIQUE TAGS (Étiquettes secondaires) ---
        raw_tags = game_data.get('tags', [])
        tags = []
        if raw_tags:
            # On prend tous les tags sauf celui qui est déjà la catégorie
            tags = [t.get('name') for t in raw_tags if isinstance(t, dict) and t.get('name') != category]

        # --- LOGIQUE VIDÉO (Hover Preview) ---
        video_url = None
        videos_obj = game_data.get('videos')
        if videos_obj and isinstance(videos_obj, dict):
            # Sélection de la meilleure qualité disponible
            path = videos_obj.get('original') or videos_obj.get('high') or videos_obj.get('medium')
            if path:
                video_url = f"{VIDEO_BASE_URL}/{path}" # Construction de l'URL complète

        return {
            'title': title,
            'description': description,
            'iframe_url': iframe_url,
            'image_url': image_url,       # Image desktop (16x9 généralement)
            'mobile_image_url': mobile_image_url, # Image mobile portrait (2x3)
            'mobile_1x1_url': mobile_1x1_url,     # Image mobile carrée (1x1) <--- AJOUTÉ ICI
            'category': category,
            'tags': tags,           
            'video_url': video_url, 
            'youtube_video_url': youtube_video_url,
            'page_url': game_url
        }
    except Exception as e:
        log_message(f"  -> Erreur parsing {game_url}: {e}")
        return None

if __name__ == "__main__":
    games_today = get_new_games_list()
    
    # Limitation du nombre de jeux à traiter pour éviter les surcharges
    games_to_process = games_today[:MAX_GAMES_TO_PROCESS] if MAX_GAMES_TO_PROCESS else games_today

    results = []
    if games_to_process:
        log_message(f"Traitement de {len(games_to_process)} jeux...")
        for game in games_to_process:
            game_details = get_game_details_from_page(game['url'])
            if game_details:
                results.append(game_details)
            time.sleep(1) # Délai de courtoisie entre les requêtes
    
    # Sortie JSON finale pour capture par n8n
    print(json.dumps(results, indent=2, ensure_ascii=False))
