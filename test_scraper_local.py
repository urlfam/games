from scraper_no_memory import get_game_details_from_page
import json

url = "https://www.crazygames.com/game/burger-restaurant-simulator-3d"
details = get_game_details_from_page(url)
print(json.dumps(details, indent=2, ensure_ascii=False))
