import json
import os
import requests
import sys
import subprocess
import shutil

# Configuration
GAMES_JSON_PATH = 'data/games.json'
PREVIEWS_DIR = 'public/previews'
TEMP_DIR = 'public/previews/temp'

def ensure_ffmpeg_installed():
    try:
        subprocess.run(['ffmpeg', '-version'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Error: ffmpeg is not installed. Please install it using 'apt-get install ffmpeg' or similar.")
        return False

def compress_video(input_path, output_path):
    # Target: 480p, 24fps, CRF 28 (lower quality but good for previews), no audio
    command = [
        'ffmpeg',
        '-y', # Overwrite output file
        '-i', input_path,
        '-vf', 'scale=-2:480', # Scale height to 480px, keep aspect ratio
        '-r', '24', # Frame rate
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '28', # Constant Rate Factor (higher is lower quality/smaller size)
        '-an', # Remove audio
        '-movflags', '+faststart', # Optimize for web streaming
        output_path
    ]
    
    try:
        subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error compressing {input_path}: {e}")
        return False

def download_file(url, filepath):
    try:
        with requests.get(url, stream=True) as r:
            r.raise_for_status()
            with open(filepath, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        if os.path.exists(filepath):
            os.remove(filepath)
        return False

def main():
    if not ensure_ffmpeg_installed():
        return

    # Ensure directories exist
    if not os.path.exists(PREVIEWS_DIR):
        os.makedirs(PREVIEWS_DIR)
    
    if not os.path.exists(TEMP_DIR):
        os.makedirs(TEMP_DIR)

    # Load games
    try:
        with open(GAMES_JSON_PATH, 'r') as f:
            games = json.load(f)
    except FileNotFoundError:
        print(f"Error: {GAMES_JSON_PATH} not found.")
        return

    print(f"Found {len(games)} games. Checking for videos...")

    for game in games:
        video_url = game.get('video_url')
        page_url = game.get('page_url')
        
        if not video_url or not page_url:
            continue

        # Derive slug from page_url
        slug = page_url.split('/')[-1]
        filename = f"{slug}.mp4"
        final_path = os.path.join(PREVIEWS_DIR, filename)
        temp_path = os.path.join(TEMP_DIR, filename)

        needs_processing = True
        if os.path.exists(final_path):
            size_mb = os.path.getsize(final_path) / (1024 * 1024)
            if size_mb < 3.0:
                print(f"Skipping {slug} (already exists and small: {size_mb:.2f} MB)")
                needs_processing = False
            else:
                print(f"Re-processing {slug} (exists but too large: {size_mb:.2f} MB)")
        
        if not needs_processing:
            continue

        print(f"Processing {slug}...")
        
        # Download to temp
        print(f"  Downloading...")
        if download_file(video_url, temp_path):
            # Compress to final
            print(f"  Compressing...")
            if compress_video(temp_path, final_path):
                print(f"  Success! Saved to {final_path}")
                # Clean up temp
                os.remove(temp_path)
                
                # Check new size
                new_size_mb = os.path.getsize(final_path) / (1024 * 1024)
                print(f"  New size: {new_size_mb:.2f} MB")
            else:
                print(f"  Compression failed. Keeping original.")
                shutil.move(temp_path, final_path)
        else:
            print(f"  Failed to download.")

    # Cleanup temp dir
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)

if __name__ == "__main__":
    main()
