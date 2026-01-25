import asyncio
import json
import io
import sys
from PIL import Image
import numpy as np
from playwright.async_api import async_playwright

# ==============================================================================
# 🎮 CONFIGURATION
# ==============================================================================
# L'URL peut être passée en argument : python test_game.py "http://..."
TARGET_URL = sys.argv[1] if len(sys.argv) > 1 else "http://147.93.7.103:3331/game/index.html"
MAX_WAIT_FOR_IFRAME = 120  # 2 minutes max pour que l'iframe apparaisse

# ==============================================================================
# 🛠️ FONCTIONS D'ANALYSE
# ==============================================================================

async def wait_for_iframe_with_canvas(page, max_wait=120):
    """
    Attend PATIEMMENT qu'un iframe avec canvas apparaisse
    """
    print(f"🔍 Attente de l'iframe du jeu (max {max_wait}s)...")
    
    elapsed = 0
    check_interval = 5  # Vérifier toutes les 5 secondes
    
    while elapsed < max_wait:
        frames = page.frames
        
        for frame in frames:
            try:
                canvas_count = await frame.evaluate("document.querySelectorAll('canvas').length")
                if canvas_count > 0:
                    url = frame.url
                    print(f"   ✅ Iframe trouvé après {elapsed}s!")
                    print(f"   📍 URL: {url[:80]}...")
                    print(f"   📊 Canvas détectés: {canvas_count}")
                    return frame
            except:
                continue
        
        # Pas encore trouvé, attendre et réessayer
        await page.wait_for_timeout(check_interval * 1000)
        elapsed += check_interval
        print(f"   ⏳ Toujours en attente... ({elapsed}s/{max_wait}s)")
    
    print(f"   ❌ Timeout: aucun iframe après {max_wait}s")
    return None

async def wait_for_initial_load(page):
    """Attente initiale plus courte"""
    print("⏳ Attente du chargement initial de la page...")
    try:
        await page.wait_for_load_state('domcontentloaded', timeout=30000)
        print("   ✅ DOM chargé")
    except:
        print("   ⚠️ Timeout DOM (normal)")
    
    # Attente courte, l'iframe peut mettre du temps à apparaître
    await page.wait_for_timeout(10000)
    print("   ✅ Attente initiale terminée (10s)")

def analyze_loading_screen(screenshot_bytes):
    """Analyse visuelle pour détecter un écran de chargement"""
    try:
        img = Image.open(io.BytesIO(screenshot_bytes)).convert('RGB')
        arr = np.array(img)
        
        variance = np.var(arr)
        small_img = img.resize((100, 100))
        unique_colors = len(set(list(small_img.getdata())))
        
        return {
            'variance': variance,
            'unique_colors': unique_colors,
            'is_likely_loading': variance < 2000 or unique_colors < 500
        }
    except:
        return None

async def test_visual_changes(page, duration=10):
    """Prend plusieurs screenshots et vérifie s'il y a des changements"""
    print(f"\n📸 Test de changements visuels ({duration}s)...")
    
    screenshots = []
    num_samples = 5
    interval = duration / (num_samples - 1)
    
    for i in range(num_samples):
        screenshot = await page.screenshot()
        screenshots.append(screenshot)
        print(f"   📸 Screenshot {i+1}/{num_samples}")
        if i < num_samples - 1:
            await page.wait_for_timeout(int(interval * 1000))
    
    all_identical = all(screenshots[0] == s for s in screenshots[1:])
    
    if all_identical:
        print("   ❌ Tous identiques (gelé)")
        return False
    else:
        different_count = sum(1 for s in screenshots[1:] if s != screenshots[0])
        print(f"   ✅ {different_count}/{num_samples-1} différents")
        return True

async def find_clickable_elements(game_frame):
    """Trouve les éléments cliquables"""
    elements = await game_frame.evaluate("""() => {
        const clickableElements = [];
        const allElements = document.querySelectorAll('*');
        
        for (const el of allElements) {
            const rect = el.getBoundingClientRect();
            if (rect.width < 10 || rect.height < 10) continue;
            if (rect.width === 0 || rect.height === 0) continue;
            
            const style = window.getComputedStyle(el);
            const tag = el.tagName.toLowerCase();
            
            const hasClickEvent = (
                el.onclick !== null ||
                el.onmousedown !== null ||
                el.onpointerdown !== null
            );
            
            const hasPointerCursor = style.cursor === 'pointer';
            
            if (hasClickEvent || hasPointerCursor || tag === 'canvas') {
                clickableElements.push({
                    tag: tag,
                    id: el.id || null,
                    x: Math.round(rect.x + rect.width / 2),
                    y: Math.round(rect.y + rect.height / 2),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                });
            }
        }
        
        return clickableElements.sort((a, b) => 
            (b.width * b.height) - (a.width * a.height)
        );
    }""")
    
    return elements

async def test_click_reactivity(page, elements):
    """Teste si un clic provoque une réaction"""
    print("\n👆 Test de réactivité (clic sur canvas)...")
    
    if len(elements) == 0:
        print("   ❌ Aucun élément à tester")
        return False
    
    canvas_elem = next((e for e in elements if e['tag'] == 'canvas'), elements[0])
    
    try:
        print(f"   🖱️  Clic sur <{canvas_elem['tag']}> à ({canvas_elem['x']}, {canvas_elem['y']})")
        
        screenshot_before = await page.screenshot()
        await page.mouse.click(canvas_elem['x'], canvas_elem['y'])
        await page.wait_for_timeout(3000)
        screenshot_after = await page.screenshot()
        
        if screenshot_before != screenshot_after:
            print(f"      ✅ RÉACTION DÉTECTÉE!")
            return True
        else:
            print(f"      ⚪ Pas de réaction visible")
            return False
            
    except Exception as e:
        print(f"      ⚠️ Erreur: {e}")
        return False

# ==============================================================================
# 🚀 VALIDATION PRINCIPALE
# ==============================================================================

async def run_validation():
    async with async_playwright() as p:
        print("🚀 Validateur de jeu iframe (version patiente)")
        print(f"🎯 URL: {TARGET_URL}\n")
        
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox", 
                "--disable-setuid-sandbox",
                "--use-gl=angle", # Meilleure compatibilité que swiftshader souvent
                "--use-angle=gl-egl",
                "--disable-gpu-sandbox",
                "--window-size=1920,1080",
                # Note: On a retiré --disable-dev-shm-usage pour profiter du shm_size: 2gb
                # On a retiré --no-zygote qui cause des instabilités
            ]
        )
        
        context = await browser.new_context(viewport={'width': 1366, 'height': 768})
        page = await context.new_page()

        try:
            # 1. NAVIGATION
            print("🌐 Navigation...")
            await page.goto(TARGET_URL, timeout=60000)
            
            # 2. ATTENTE INITIALE COURTE
            await wait_for_initial_load(page)
            
            # 3. ATTENDRE L'IFRAME (avec patience!)
            game_frame = await wait_for_iframe_with_canvas(page, max_wait=MAX_WAIT_FOR_IFRAME)
            
            if not game_frame:
                print("\n❌ ÉCHEC: Aucun iframe avec canvas après attente maximale")
                await page.screenshot(path="/app/results/fail_no_iframe.png")
                
                report = {
                    "status": "FAIL",
                    "reason": "Aucun iframe avec canvas détecté (timeout 2 minutes)",
                    "metrics": {}
                }
                print(json.dumps(report))  # Output pour n8n
                with open("/app/results/game_validation_report.json", "w") as f:
                    json.dump(report, f, indent=2)
                
                await browser.close()
                return
            
            # 4. ATTENTE SUPPLÉMENTAIRE pour que le jeu se stabilise
            print("\n⏳ Attente de stabilisation du jeu (20s)...")
            await page.wait_for_timeout(20000)
            print("   ✅ Stabilisation terminée")
            
            # 5. ANALYSE VISUELLE
            print("\n🔍 Analyse visuelle...")
            initial_screenshot = await page.screenshot()
            visual_analysis = analyze_loading_screen(initial_screenshot)
            
            if visual_analysis:
                print(f"   📊 Variance: {visual_analysis['variance']:.0f}")
                print(f"   📊 Couleurs: {visual_analysis['unique_colors']}")
            
            # 6. TEST DE CHANGEMENTS VISUELS
            has_visual_changes = await test_visual_changes(page, duration=10)
            
            # 7. ÉLÉMENTS CLIQUABLES
            print("\n🔍 Recherche d'éléments cliquables...")
            clickable_elements = await find_clickable_elements(game_frame)
            print(f"   📊 {len(clickable_elements)} éléments trouvés")
            
            # 8. TEST DE RÉACTIVITÉ
            has_reactivity = await test_click_reactivity(page, clickable_elements)
            
            # ==================================================================
            # 🎯 DÉCISION FINALE
            # ==================================================================
            print("\n" + "="*70)
            print("📊 RÉSUMÉ:")
            print(f"   🔹 Changements visuels: {has_visual_changes}")
            print(f"   🔹 Réactivité au clic: {has_reactivity}")
            print(f"   🔹 Éléments cliquables: {len(clickable_elements)}")
            if visual_analysis:
                print(f"   🔹 Écran loading probable: {visual_analysis['is_likely_loading']}")
            print("="*70)
            
            if has_visual_changes or has_reactivity:
                verdict = "SUCCESS"
                reason = "Jeu fonctionnel (changements visuels ou réactivité)"
                print(f"\n🎉 SUCCÈS: {reason}")
                await page.screenshot(path="/app/results/success_validated.png")
                
            elif visual_analysis and visual_analysis['is_likely_loading']:
                verdict = "FAIL"
                reason = "Écran de chargement statique"
                print(f"\n❌ ÉCHEC: {reason}")
                await page.screenshot(path="/app/results/fail_loading_screen.png")
                
            else:
                verdict = "FAIL"
                reason = "Aucun changement visuel ni réactivité"
                print(f"\n❌ ÉCHEC: {reason}")
                await page.screenshot(path="/app/results/fail_frozen.png")
            
            report = {
                "status": verdict,
                "reason": reason,
                "metrics": {
                    "visual_changes": bool(has_visual_changes),
                    "click_reactivity": bool(has_reactivity),
                    "clickable_elements": len(clickable_elements),
                    "visual_analysis": {
                        "variance": float(visual_analysis['variance']) if visual_analysis else None,
                        "unique_colors": int(visual_analysis['unique_colors']) if visual_analysis else None,
                        "is_likely_loading": bool(visual_analysis['is_likely_loading']) if visual_analysis else None
                    } if visual_analysis else None
                },
                "iframe_url": game_frame.url
            }
            
            # Output pour n8n
            print(json.dumps(report))
            
            with open("/app/results/game_validation_report.json", "w") as f:
                json.dump(report, f, indent=2)
            
            print("\n📄 Rapport: /app/results/game_validation_report.json")

        except Exception as e:
            print(f"\n❌ ERREUR: {e}")
            import traceback
            traceback.print_exc()
            await page.screenshot(path="/app/results/error.png")
            
            # Output erreur pour n8n
            error_report = {
                "status": "ERROR",
                "reason": str(e),
                "metrics": {}
            }
            print(json.dumps(error_report))
        
        finally:
            await browser.close()
            print("\n🏁 Test terminé!\n")

if __name__ == "__main__":
    asyncio.run(run_validation())
