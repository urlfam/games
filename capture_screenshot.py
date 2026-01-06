import asyncio
import sys
import json
import cloudinary
import cloudinary.uploader
from playwright.async_api import async_playwright

# ==========================================
# 1. CONFIGURATION CLOUDINARY
# ==========================================
cloudinary.config( 
  cloud_name = "ddop8syhq", 
  api_key = "561454444495191", 
  api_secret = "Q7JxL26jowt8pnBP8H7WBCi4In0",
  secure = True
)

# ==========================================
# 2. RÉCUPÉRATION DES ARGUMENTS N8N
# ==========================================
# Arg 1 : L'URL du jeu
TARGET_URL = sys.argv[1] if len(sys.argv) > 1 else "http://google.com"
# Arg 2 : Le nom du fichier voulu (Slug)
# Si n8n n'envoie rien, on met "default_name"
FILE_NAME = sys.argv[2] if len(sys.argv) > 2 else "default_game_capture"

async def get_stable_game_frame(page):
    # Try different selectors to find the game container/canvas
    for i in range(20):
        # 1. Look for iframes first (common in game sites)
        frames = page.frames
        for frame in frames:
            try:
                # Check for canvas inside frame
                if await frame.locator('canvas').count() > 0:
                    return frame
            except:
                continue
        
        # 2. Look for canvas in main page
        if await page.locator('canvas').count() > 0:
            return page

        # 3. Look for objects/embeds
        if await page.locator('object, embed').count() > 0:
             return page

        await page.wait_for_timeout(3000)
    return None

async def run():
    async with async_playwright() as p:
        # Launch options for Docker environment
        browser = await p.chromium.launch(
            headless=True, 
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage", # Essential for Docker
                "--disable-gpu"
            ]
        )
        page = await browser.new_page(viewport={'width': 1920, 'height': 1080})

        try:
            # 1. Chargement
            # print(f"Chargement de {TARGET_URL}...")
            await page.goto(TARGET_URL, timeout=60000, wait_until="networkidle") 
            
            # 2. Recherche du cadre de jeu
            game_frame = await get_stable_game_frame(page)
            if not game_frame:
                # Fallback: take generic screenshot of page
                # print("Frame spécifique non trouvé, capture de la page entière.")
                game_frame = page

            # 3. Attente pour le chargement du jeu (splash screens etc)
            await page.wait_for_timeout(15000) # 15s usually enough, 30s is safe but slow

            # 4. Capture RAM
            # If it's a frame or page, we try to target canvas specifically if possible for cleaner shot
            target = game_frame.locator('canvas').first
            if await target.count() == 0:
                # Fallback to body or visible area if no canvas found in the "game_frame" (which might be the page)
                target = game_frame.locator('body')
            
            screenshot_bytes = await target.screenshot(type='jpeg', quality=90)

            # 5. UPLOAD AVEC LE NOM PERSONNALISÉ
            response = cloudinary.uploader.upload(
                screenshot_bytes, 
                folder="puzzio_captures", # Changed folder name slightly to keep organized
                public_id=FILE_NAME,
                resource_type="image",
                # Optimization transformations applied on upload if desired, 
                # but 'f_auto,q_auto' is best applied on delivery URL.
            )

            # 6. Url propre avec Trim + f_auto + q_auto
            # e_trim removes borders (good for canvas), f_auto/q_auto optimizes size/format
            secure_url = response['secure_url']
            url_propre = secure_url.replace('/upload/', '/upload/e_trim/f_auto,q_auto/')
            
            # 7. Retour à n8n (JSON pur)
            print(json.dumps({
                "status": "SUCCESS",
                "image_url": url_propre,
                "name_used": FILE_NAME,
                "original_url": secure_url
            }))

        except Exception as e:
            print(json.dumps({"status": "ERROR", "message": str(e)}))
            
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
