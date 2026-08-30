import os
import re

replacements = {
    r'\bseamless\b': 'smooth',
    r'\bSeamless\b': 'Smooth',
    r'\bpremier\b': 'top',
    r'\bPremier\b': 'Top',
    r'\bvibrant\b': 'active',
    r'\bVibrant\b': 'Active',
    r'\bbustling\b': 'busy',
    r'\bBustling\b': 'Busy',
    r'\bholistic\b': 'complete',
    r'\bHolistic\b': 'Complete',
    r'\bstate-of-the-art\b': 'modern',
    r'\bState-of-the-art\b': 'Modern',
    r'\bgame-changer\b': 'major help',
    r'\bGame-changer\b': 'Major help',
    r'\bin this comprehensive guide\b': 'in this article',
    r'\bIn this comprehensive guide\b': 'In this article',
    r'\bwhether you\'re looking\b': 'if you need',
    r'\bWhether you\'re looking\b': 'If you need',
    r'\bwhen it comes to\b': 'regarding',
    r'\bWhen it comes to\b': 'Regarding',
    r'\bnot just a\b': 'more than a',
    r'\bNot just a\b': 'More than a',
    r'\bsynergy\b': 'connection',
    r'\brobust\b': 'strong',
    r'\bboasts\b': 'features',
    r'\bdive into\b': 'explore',
    r'\bwhether you\'re a\b': 'if you are a',
    r'\bfour-legged\b': 'canine',
    r'\bcanine companion\b': 'dog',
    r'\bfurry friend\b': 'dog',
}

dirs = [
    '/Users/mahendrabalal/Desktop/new_indoordogpark/blog-content/',
    '/Users/mahendrabalal/Desktop/new_indoordogpark/content/blog/'
]

for d in dirs:
    if not os.path.exists(d):
        continue
    for f in os.listdir(d):
        if not f.endswith('.md'):
            continue
        path = os.path.join(d, f)
        with open(path, 'r') as file:
            content = file.read()
            
        original_content = content
        
        # Replace AI words
        for pattern, replacement in replacements.items():
            content = re.sub(pattern, replacement, content)
            
        content = content.replace('[the best indoor dog park flooring: turf vs. rubber vs. epoxy]', '[dog park flooring]')
        content = content.replace('[identifying and managing dog paw yeast infections]', '[dog paw yeast infections]')
        content = content.replace('[indoor dog parks and agility facilities in Denver, CO]', '[Denver indoor dog parks]')
        content = content.replace('[understanding ivdd in dogs symptoms causes and care]', '[IVDD in dogs]')
        content = content.replace('[launching or renovating an indoor dog park]', '[indoor dog parks]')
        content = content.replace('[how to start an indoor dog park]', '[starting an indoor dog park]')
        
        if content != original_content:
            with open(path, 'w') as file:
                file.write(content)
            print(f'Cleaned {f}')

print("Done cleaning content.")
