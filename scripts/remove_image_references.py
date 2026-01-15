import json
import os

data_dir = 'public/data'
files = ['california.json', 'washington.json', 'mixmatch.json']

for filename in files:
    filepath = os.path.join(data_dir, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
    
    print(f"Processing {filename}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error decoding {filename}: {e}")
            continue
    
    # Remove photos and photo fields
    for park in data:
        if 'photos' in park:
            park['photos'] = None
        if 'photo' in park:
            park['photo'] = None
            
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Finished processing {filename}")
