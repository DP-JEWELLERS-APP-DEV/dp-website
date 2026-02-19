import json
import os
from PIL import Image

def optimize_image(path, max_dimension=1920, quality=80):
    try:
        with Image.open(path) as img:
            # Check if resizing is needed
            width, height = img.size
            if width > max_dimension or height > max_dimension:
                # Calculate new dimensions
                if width > height:
                    new_width = max_dimension
                    new_height = int(height * (max_dimension / width))
                else:
                    new_height = max_dimension
                    new_width = int(width * (max_dimension / height))
                
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                print(f"Resized {path} to {new_width}x{new_height}")
            
            # Save optimized image
            # Preserve format, but convert RGBA to RGB for JPEG if needed
            save_kwargs = {'quality': quality, 'optimize': True}
            
            if path.lower().endswith(('.jpg', '.jpeg')):
                 if img.mode == 'RGBA':
                     img = img.convert('RGB')
            
            img.save(path, **save_kwargs)
            print(f"Compressed {path}")
            
    except Exception as e:
        print(f"Error optimizing {path}: {e}")

def main():
    try:
        with open('image_analysis_results.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: image_analysis_results.json not found.")
        return

    print("Starting cleanup...")
    
    # Delete unused images
    unused_count = 0
    for path in data.get("unused_images", []):
        try:
            if os.path.exists(path):
                os.remove(path)
                print(f"Deleted: {path}")
                unused_count += 1
            else:
                print(f"File not found (already deleted?): {path}")
        except Exception as e:
            print(f"Error deleting {path}: {e}")
            
    print(f"Deleted {unused_count} unused images.")
    
    # Compress large images
    print("\nStarting compression...")
    large_images = data.get("large_images", [])
    for item in large_images:
        path = item["path"]
        if os.path.exists(path):
            optimize_image(path)
        else:
             print(f"File not found: {path}")

    print("\noptimization complete.")

if __name__ == "__main__":
    main()
