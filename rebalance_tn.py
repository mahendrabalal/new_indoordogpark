import json
import os

def load_json(path):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_park_key(park):
    # Fallback for missing keys
    gid = park.get('googlePlaceId') or park.get('id') or ''
    return f"{gid}|{park['name'].lower()}|{park['city'].lower()}|{park['state'].lower()}"

def rebalance_tn():
    tn_path = 'public/data/tennessee.json'
    tn_data = load_json(tn_path)
    
    # State mapping for known out-of-state cities in TN data
    state_fixes = {
        "Abingdon": "VA",
        "Byhalia": "MS",
        "Chickamauga": "GA",
        "Cleveland Heights": "OH",
        "East Flat Rock": "NC",
        "Flintstone": "GA",
        "Fort Campbell": "KY",
        "Fort Oglethorpe": "GA",
        "Glasgow": "KY",
        "Hopkinsville": "KY",
        "Huntsville": "AL",
        "Louisville": "KY",
        "Mills River": "NC",
        "Minnetonka": "MN",
        "Nesbit": "MS",
        "Olive Branch": "MS",
        "Ringgold": "GA",
        "Rossville": "GA",
        "Southaven": "MS"
    }
    
    # Supported state files in public/data
    name_map = {
        "CA": "california.json",
        "WA": "washington.json",
        "VA": "virginia.json",
        "TX": "texas.json",
        "TN": "tennessee.json",
        "PA": "pennsylvania.json",
        "OH": "ohio.json",
        "NC": "northcarolina.json",
        "NY": "newyork.json",
        "MO": "missouri.json",
        "NJ": "newjersey.json"
    }
    
    # Load all supported state data to check for dupes
    state_cache = {}
    for st, fileName in name_map.items():
        path = f"public/data/{fileName}"
        data = load_json(path)
        state_cache[st] = {
            "path": path,
            "data": data,
            "keys": {get_park_key(p) for p in data}
        }
            
    # Load mixmatch
    mixmatch_path = "public/data/mixmatch.json"
    mixmatch_data = load_json(mixmatch_path)
    mixmatch_keys = {get_park_key(p) for p in mixmatch_data}
    
    new_tn_data = []
    move_log = []
    
    for park in tn_data:
        city = park['city']
        
        # Specific Typo Fixes
        if city == "Chester Stahl":
            park['city'] = "Clarksville"
            city = "Clarksville"
        elif city == "Johnson":
            park['city'] = "Johnson City"
            city = "Johnson City"
            
        target_state = state_fixes.get(city)
        if target_state:
            # Move it!
            park['state'] = target_state
            # Re-generate full_address if it looks like the old constructed one
            if park['full_address'].endswith('TN ' + park.get('zipCode', '')):
                 park['full_address'] = park['full_address'].replace('TN', target_state)
            
            key = get_park_key(park)
            
            if target_state in state_cache:
                if key not in state_cache[target_state]["keys"]:
                    state_cache[target_state]["data"].append(park)
                    state_cache[target_state]["keys"].add(key)
                    move_log.append(f"Moved {park['name']} from TN to {target_state}")
                else:
                    move_log.append(f"Skipped duplicate {park['name']} in {target_state}")
            else:
                # Move to mixmatch
                if key not in mixmatch_keys:
                    mixmatch_data.append(park)
                    mixmatch_keys.add(key)
                    move_log.append(f"Moved {park['name']} from TN to mixmatch (state {target_state})")
                else:
                    move_log.append(f"Skipped duplicate {park['name']} in mixmatch")
        else:
            # Keep in TN
            new_tn_data.append(park)
            
    # Save all modified files
    save_json(state_cache["TN"]["path"], new_tn_data)
    for st, info in state_cache.items():
        if st != "TN":
            save_json(info["path"], info["data"])
    
    save_json(mixmatch_path, mixmatch_data)
    
    print("\n".join(move_log))
    print(f"\nRebalanced Tennessee data. New TN count: {len(new_tn_data)}")

if __name__ == "__main__":
    rebalance_tn()
