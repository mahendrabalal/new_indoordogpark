import os
import re

def fix_titles(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if not file.endswith('.tsx') and not file.endswith('.ts'):
                continue
                
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Find export const metadata = { ... }
            metadata_pattern = re.compile(r'(export const metadata[^\{]*\{)([\s\S]*?)(\};)', re.MULTILINE)
            
            def replacer(match):
                prefix = match.group(1)
                inner = match.group(2)
                suffix = match.group(3)
                
                # Replace top-level title: '...' with title: { absolute: '...' }
                # We assume top-level is indented with 2 spaces
                new_inner = re.sub(
                    r'^(\s{2})title:\s*([\'"\`].*?[\'"\`]),?$',
                    r'\1title: { absolute: \2 },',
                    inner,
                    flags=re.MULTILINE
                )
                
                return prefix + new_inner + suffix
                
            new_content = metadata_pattern.sub(replacer, content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {path}")

fix_titles('src/app')
