#!/usr/bin/env python3
import re
import json

# Read the file
with open('/Users/mahendrabalal/Desktop/new_indoordogpark/src/data/priorityCityContent.ts', 'r') as f:
    content = f.read()

# Extract all longDescription blocks
pattern = r"longDescription:\s*\[([\s\S]*?)\],"
matches = list(re.finditer(pattern, content))

print(f"Found {len(matches)} longDescription blocks\n")

# Function to reduce text while maintaining quality
def reduce_description_pair(para1, para2):
    """Reduce two paragraphs to fit 1450-1600 character target"""
    target_min = 1450
    target_max = 1600
    current_total = len(para1) + len(para2)
    
    print(f"Current total: {current_total} chars")
    print(f"Target: {target_min}-{target_max} chars")
    print(f"Para 1: {len(para1)} chars")
    print(f"Para 2: {len(para2)} chars")
    
    if current_total <= target_max and current_total >= target_min:
        print("✓ Already in range\n")
        return para1, para2
    
    # Need to reduce
    reduction_needed = current_total - target_max if current_total > target_max else 0
    
    if reduction_needed > 0:
        print(f"Need to reduce by: {reduction_needed} chars")
        
        # Simple reduction strategy: trim wordy phrases and redundant info
        replacements = [
            (r', providing a\s+', ', '),
            (r'; this\s+', '; '),
            (r', offering\s+', ', '),
            (r', allowing\s+', ', '),
            (r', ensuring\s+', ', '),
            (r', creating\s+', ', '),
            (r', blending\s+', ', '),
            (r', including\s+', ', '),
            (r'By combining\s+', 'By blending '),
        ]
        
        # Trim both paragraphs proportionally
        reduction_p1 = int(reduction_needed * len(para1) / current_total)
        reduction_p2 = reduction_needed - reduction_p1
        
        # Find a good cut point
        if reduction_p1 > 0:
            # Remove from para1 - find last sentence
            sentences = para1.split('. ')
            total_remove = reduction_p1
            while total_remove > 0 and len(sentences) > 1:
                removed_sent = sentences.pop()
                total_remove -= len(removed_sent) + 2  # +2 for '. '
            para1 = '. '.join(sentences)
            if not para1.endswith('.'):
                para1 += '.'
        
        if reduction_p2 > 0:
            sentences = para2.split('. ')
            total_remove = reduction_p2
            while total_remove > 0 and len(sentences) > 1:
                removed_sent = sentences.pop()
                total_remove -= len(removed_sent) + 2
            para2 = '. '.join(sentences)
            if not para2.endswith('.'):
                para2 += '.'
    
    new_total = len(para1) + len(para2)
    print(f"New total: {new_total} chars")
    print(f"Para 1: {len(para1)} chars")
    print(f"Para 2: {len(para2)} chars\n")
    
    return para1, para2

# Analyze first few
for i, match in enumerate(matches[:3]):
    print(f"\n{'='*60}")
    print(f"City {i+1}:")
    print(f"{'='*60}")
    block = match.group(1)
    
    # Extract the two paragraphs
    para_pattern = r"'([^']*(?:https?:[^']*)?[^']*)'"
    paragraphs = re.findall(para_pattern, block)
    
    if len(paragraphs) >= 2:
        para1 = paragraphs[0]
        para2 = paragraphs[1]
        reduce_description_pair(para1, para2)
