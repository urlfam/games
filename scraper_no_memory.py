import requests
from bs4 import BeautifulSoup
import json
import time
import os
import sys
from datetime import datetime

# --- Configuration ---
BASE_URL = "https://www.crazygames.com"
NEW_GAMES_URL = f"{BASE_URL}/new"
# DATABASE_FILE = "jeux_traites.json" # DÉSACTIVÉ : On ne filtre plus localement
IMAGE_BASE_URL = "https://imgs.crazygames.com"
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
        log_message("  -> Balise __NEXT_DATA__ non trouvée")
        return []

    try:
        data = json.loads(script_tag.string)
        # Adaptation aux différentes structures possibles de CrazyGames
        games_list_data = []
        
        if 'props' in data and 'pageProps' in data['props']:
            page_props = data['props']['pageProps']
            if 'games' in page_props and 'items' in page_props['games']:
                games_list_data = page_props['games']['items']
            elif 'apolloState' in page_props and 'ROOT_QUERY' in page_props['apolloState']:
                # Fallback pour structure Apollo/GraphQL
                root_query = page_props['apolloState']['ROOT_QUERY']
                for key, value in root_query.items():
                    if 'newGames' in key or 'games' in key:
                        if isinstance(value, list):
                            games_list_data.extend(value)
                        elif isinstance(value, dict) and 'items' in value:
                            games_list_data.extend(value['items'])
        
        games = []
        for game in games_list_data:
            # Gestion des références Apollo (ex: {"__ref": "Game:slug"})
            if isinstance(game, dict):
                slug = game.get('slug')
                if not slug and '__ref' in game:
                    ref = game['__ref']
                    if ':' in ref:
                        slug = ref.split(':')[-1]
                
                if slug:
                    games.append({'url': f"{BASE_URL}/game/{slug}", 'slug': slug})
        
        log_message(f"  -> {len(games)} jeux trouvés sur la page New")
        return games
    except (json.JSONDecodeError, KeyError, AttributeError) as e:
        log_message(f"  -> Erreur parsing JSON liste: {e}")
        return []

def get_game_details_from_page(game_url):
    # log_message(f"Analyse : {game_url}")
    try:
        resp = requests.get(game_url, headers=HEADERS, timeout=10)
        resp.raise_for_status()
    except requests.exceptions.RequestException as e:
        log_message(f"  -> Erreur d'accès {game_url} : {e}")
        return None

    soup = BeautifulSoup(resp.text, "html.parser")
    script_tag = soup.find('script', {'id': '__NEXT_DATA__'})
    if not script_tag:
        return None

    try:
        data = json.loads(script_tag.string)
        game_data = data['props']['pageProps']['game']

        title = game_data.get('name')
        
        description_raw = game_data.get('descriptionFirst') or game_data.get('description')
        description = "Pas de description"
        if description_raw:
            description = BeautifulSoup(description_raw, "html.parser").get_text(separator=" ").strip()
        
        iframe_url = game_data.get('desktopUrl') or game_data.get('url')
        cover_path = game_data.get('cover')
        image_url = f"{IMAGE_BASE_URL}/{cover_path}" if cover_path else "Non trouvée"
        
        category = "Non classé"
        primary_cat = game_data.get('category')
        if primary_cat and isinstance(primary_cat, dict):
            category = primary_cat.get('name')
        
        if not category or category == "Non classé":
            tags_list = game_data.get('tags')
            if tags_list and isinstance(tags_list, list) and len(tags_list) > 0:
                category = tags_list[0].get('name')

        # log_message(f"  -> '{title}' : {category}")

        return {
            'title': title,
            'description': description,
            'iframe_url': iframe_url,
            'image_url': image_url,
            'category': category,
            'page_url': game_url
        }
    except (json.JSONDecodeError, KeyError) as e:
        log_message(f"  -> ERREUR JSON détail {game_url} : {e}")
        return None

if __name__ == "__main__":
    # ON NE CHARGE PLUS LES JEUX TRAITÉS LOCALEMENT
    # processed_slugs = load_processed_slugs(DATABASE_FILE)
    
    games_today = get_new_games_list()
    
    # ON PREND TOUT CE QUI EST SUR LA PAGE "NEW"
    truly_new_games = games_today
    
    if MAX_GAMES_TO_PROCESS:
        games_to_process = truly_new_games[:MAX_GAMES_TO_PROCESS]
    else:
        games_to_process = truly_new_games

    results = []
    if games_to_process:
        log_message(f"Traitement de {len(games_to_process)} jeux...")
        for game in games_to_process:
            game_details = get_game_details_from_page(game['url'])
            if game_details:
                results.append(game_details)
                # processed_slugs.add(game['slug']) # ON NE SAUVEGARDE PLUS
            time.sleep(1) 

        # save_processed_slugs(DATABASE_FILE, processed_slugs) # ON NE SAUVEGARDE PLUS
    
    print(json.dumps(results, indent=2, ensure_ascii=False))
