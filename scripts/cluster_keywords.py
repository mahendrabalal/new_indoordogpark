#!/usr/bin/env python3
"""
Keyword Clustering Script for SEO Keywords

This script clusters SEO keywords by multiple dimensions:
- Location (city/state/region)
- Intent type (Commercial, Transactional, Informational, Navigational)
- Semantic patterns
- Volume/Competition tiers

Outputs structured JSON with cluster metadata and statistics.
"""

from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# US States and common abbreviations
US_STATES = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
    'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
    'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
    'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
    'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
    'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
    'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
    'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
    'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
    'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
    'wisconsin': 'WI', 'wyoming': 'WY', 'district of columbia': 'DC'
}

# State abbreviations to full names
STATE_ABBR_TO_FULL = {v: k.title() for k, v in US_STATES.items()}
STATE_ABBR_TO_FULL.update({k.title(): k.title() for k in US_STATES.keys()})

# Major cities for location extraction
MAJOR_CITIES = [
    'phoenix', 'austin', 'new york', 'houston', 'seattle', 'dallas', 'denver',
    'tucson', 'cincinnati', 'nashville', 'boston', 'milwaukee', 'madison',
    'anchorage', 'atlanta', 'cleveland', 'indianapolis', 'rochester', 'raleigh',
    'scottsdale', 'buffalo', 'charlotte', 'colorado springs', 'long island',
    'minneapolis', 'orlando', 'plymouth', 'san antonio', 'san diego', 'spokane',
    'beaverton', 'des moines', 'louisville', 'naperville', 'philadelphia',
    'sacramento', 'sioux falls', 'twin cities', 'bay area', 'fort worth',
    'fort collins', 'greenville', 'henderson', 'jacksonville', 'miami', 'okc',
    'richmond', 'salt lake city', 'st louis', 'tampa', 'tulsa', 'tacoma',
    'apple valley', 'brooklyn', 'cranberry', 'grand rapids', 'fargo', 'chandler',
    'lincoln', 'knoxville', 'st paul', 'las vegas', 'modesto', 'omaha',
    'pittsburgh', 'portland'
]

# Keyword data extracted from the provided table
KEYWORD_DATA = [
    {"keyword": "indoor dog park", "intent": "C", "volume": 18100, "cpc": 2.48, "pd": 32, "seo_difficulty": 33},
    {"keyword": "indoor dog park franchise", "intent": "C", "volume": 320, "cpc": 5.35, "pd": 62, "seo_difficulty": 20},
    {"keyword": "indoor dog park in phoenix", "intent": "C", "volume": 320, "cpc": 1.36, "pd": 2, "seo_difficulty": 6},
    {"keyword": "jb's indoor dog park", "intent": "C", "volume": 320, "cpc": 1.12, "pd": 1, "seo_difficulty": 26},
    {"keyword": "indoor dog park austin tx", "intent": "C", "volume": 210, "cpc": 1.19, "pd": 9, "seo_difficulty": 14},
    {"keyword": "indoor dog park new york", "intent": "C", "volume": 210, "cpc": 1.64, "pd": 21, "seo_difficulty": 25},
    {"keyword": "indoor dog park austin", "intent": "C", "volume": 170, "cpc": 2.58, "pd": 18, "seo_difficulty": 20},
    {"keyword": "indoor dog park houston", "intent": "C", "volume": 170, "cpc": 3.12, "pd": 30, "seo_difficulty": 21},
    {"keyword": "indoor dog park seattle", "intent": "C", "volume": 170, "cpc": 0.39, "pd": 8, "seo_difficulty": 32},
    {"keyword": "indoor dog park new jersey", "intent": "C", "volume": 170, "cpc": 1.41, "pd": 8, "seo_difficulty": 28},
    {"keyword": "indoor dog park dallas", "intent": "C", "volume": 140, "cpc": 2.58, "pd": 36, "seo_difficulty": 20},
    {"keyword": "indoor dog park nj", "intent": "C", "volume": 140, "cpc": 2.99, "pd": 20, "seo_difficulty": 27},
    {"keyword": "indoor dog park omaha", "intent": "T", "volume": 140, "cpc": 3.11, "pd": 21, "seo_difficulty": 17},
    {"keyword": "indoor dog park pittsburgh", "intent": "C", "volume": 140, "cpc": 3.28, "pd": 11, "seo_difficulty": 24},
    {"keyword": "indoor dog park denver", "intent": "C", "volume": 140, "cpc": 3.07, "pd": 31, "seo_difficulty": 15},
    {"keyword": "indoor dog park tucson", "intent": "T", "volume": 110, "cpc": 0.57, "pd": 8, "seo_difficulty": 18},
    {"keyword": "indoor dog park cincinnati", "intent": "C", "volume": 110, "cpc": 1.82, "pd": 28, "seo_difficulty": 16},
    {"keyword": "indoor dog park ct", "intent": "T", "volume": 110, "cpc": 0.00, "pd": 10, "seo_difficulty": 29},
    {"keyword": "indoor dog park equipment", "intent": "T", "volume": 110, "cpc": 1.91, "pd": 100, "seo_difficulty": 37},
    {"keyword": "indoor dog park nashville", "intent": "C", "volume": 110, "cpc": 1.50, "pd": 14, "seo_difficulty": 29},
    {"keyword": "indoor dog park grand rapids", "intent": "C", "volume": 90, "cpc": 0.00, "pd": 5, "seo_difficulty": 24},
    {"keyword": "indoor dog park fargo", "intent": "C", "volume": 90, "cpc": 0.00, "pd": 1, "seo_difficulty": 31},
    {"keyword": "indoor dog park chandler", "intent": "C", "volume": 90, "cpc": 2.52, "pd": 48, "seo_difficulty": 32},
    {"keyword": "indoor dog park boston", "intent": "C", "volume": 90, "cpc": 0.65, "pd": 13, "seo_difficulty": 33},
    {"keyword": "indoor dog park arizona", "intent": "C", "volume": 90, "cpc": 2.93, "pd": 15, "seo_difficulty": 21},
    {"keyword": "indoor dog park in michigan", "intent": "C", "volume": 90, "cpc": 0.00, "pd": 18, "seo_difficulty": 18},
    {"keyword": "indoor dog park massachusetts", "intent": "C", "volume": 90, "cpc": 0.81, "pd": 13, "seo_difficulty": 17},
    {"keyword": "indoor dog park milwaukee", "intent": "C", "volume": 90, "cpc": 2.42, "pd": 23, "seo_difficulty": 26},
    {"keyword": "indoor dog park madison wi", "intent": "C", "volume": 90, "cpc": 0.00, "pd": 9, "seo_difficulty": 17},
    {"keyword": "indoor dog park maryland", "intent": "C", "volume": 90, "cpc": 3.75, "pd": 24, "seo_difficulty": 27},
    {"keyword": "indoor dog park anchorage", "intent": "C", "volume": 70, "cpc": 0.00, "pd": 2, "seo_difficulty": 23},
    {"keyword": "indoor dog park atlanta", "intent": "C", "volume": 70, "cpc": 2.51, "pd": 49, "seo_difficulty": 24},
    {"keyword": "indoor dog park cleveland", "intent": "C", "volume": 70, "cpc": 0.00, "pd": 3, "seo_difficulty": 18},
    {"keyword": "indoor dog park cranberry", "intent": "C", "volume": 70, "cpc": 2.22, "pd": 6, "seo_difficulty": 25},
    {"keyword": "indoor dog park indianapolis", "intent": "C", "volume": 70, "cpc": 2.36, "pd": 21, "seo_difficulty": 22},
    {"keyword": "indoor dog park lincoln ne", "intent": "C", "volume": 70, "cpc": 3.09, "pd": 28, "seo_difficulty": 24},
    {"keyword": "indoor dog park rochester ny", "intent": "C", "volume": 70, "cpc": 1.37, "pd": 14, "seo_difficulty": 31},
    {"keyword": "indoor dog park raleigh", "intent": "C", "volume": 70, "cpc": 2.45, "pd": 17, "seo_difficulty": 30},
    {"keyword": "indoor dog park scottsdale az", "intent": "C", "volume": 70, "cpc": 4.97, "pd": 9, "seo_difficulty": 16},
    {"keyword": "indoor dog park usa", "intent": "T", "volume": 70, "cpc": 0.00, "pd": 7, "seo_difficulty": 38},
    {"keyword": "unleashed indoor dog park", "intent": "C", "volume": 70, "cpc": 0.00, "pd": 6, "seo_difficulty": 21},
    {"keyword": "zoomies indoor dog park", "intent": "C", "volume": 70, "cpc": 0.00, "pd": 1, "seo_difficulty": 29},
    {"keyword": "indoor dog park buffalo ny", "intent": "T", "volume": 50, "cpc": 0.00, "pd": 1, "seo_difficulty": 25},
    {"keyword": "indoor dog park charlotte nc", "intent": "C", "volume": 50, "cpc": 1.34, "pd": 28, "seo_difficulty": 31},
    {"keyword": "indoor dog park colorado springs", "intent": "C", "volume": 50, "cpc": 3.37, "pd": 32, "seo_difficulty": 31},
    {"keyword": "indoor dog park long island", "intent": "C", "volume": 50, "cpc": 3.72, "pd": 6, "seo_difficulty": 17},
    {"keyword": "indoor dog park minnesota", "intent": "C", "volume": 50, "cpc": 1.68, "pd": 13, "seo_difficulty": 22},
    {"keyword": "indoor dog park orlando", "intent": "C", "volume": 50, "cpc": 2.24, "pd": 22, "seo_difficulty": 20},
    {"keyword": "indoor dog park ohio", "intent": "C", "volume": 50, "cpc": 0.00, "pd": 9, "seo_difficulty": 16},
    {"keyword": "indoor dog park plymouth", "intent": "C", "volume": 50, "cpc": 2.59, "pd": 18, "seo_difficulty": 27},
    {"keyword": "indoor dog park san antonio", "intent": "C", "volume": 50, "cpc": 0.88, "pd": 13, "seo_difficulty": 20},
    {"keyword": "indoor dog park scottsdale", "intent": "C", "volume": 50, "cpc": 2.75, "pd": 48, "seo_difficulty": 14},
    {"keyword": "indoor dog park san diego", "intent": "C", "volume": 50, "cpc": 2.59, "pd": 30, "seo_difficulty": 18},
    {"keyword": "indoor dog park spokane", "intent": "C", "volume": 50, "cpc": 0.00, "pd": 1, "seo_difficulty": 19},
    {"keyword": "unleashed indoor dog park dallas", "intent": "C", "volume": 50, "cpc": 0.00, "pd": 2, "seo_difficulty": 23},
    {"keyword": "indoor dog park with bar", "intent": "T", "volume": 50, "cpc": 4.20, "pd": 13, "seo_difficulty": 54},
    {"keyword": "indoor dog park near me within 5 mi", "intent": "C", "volume": 40, "cpc": 5.40, "pd": 18, "seo_difficulty": 31},
    {"keyword": "indoor dog park beaverton", "intent": "C", "volume": 40, "cpc": 2.73, "pd": 62, "seo_difficulty": 23},
    {"keyword": "indoor dog park bar", "intent": "T", "volume": 40, "cpc": 0.00, "pd": 6, "seo_difficulty": 53},
    {"keyword": "indoor dog park dc", "intent": "C", "volume": 40, "cpc": 4.62, "pd": 38, "seo_difficulty": 25},
    {"keyword": "indoor dog park des moines", "intent": "C", "volume": 40, "cpc": 1.46, "pd": 52, "seo_difficulty": 23},
    {"keyword": "indoor dog park louisville ky", "intent": "C", "volume": 40, "cpc": 0.00, "pd": 14, "seo_difficulty": 16},
    {"keyword": "indoor dog park naperville", "intent": "C", "volume": 40, "cpc": 0.00, "pd": 18, "seo_difficulty": 34},
    {"keyword": "indoor dog park philadelphia", "intent": "C", "volume": 40, "cpc": 0.00, "pd": 6, "seo_difficulty": 23},
    {"keyword": "indoor dog park raleigh nc", "intent": "C", "volume": 40, "cpc": 0.00, "pd": 5, "seo_difficulty": 2},
    {"keyword": "indoor dog park sacramento", "intent": "C", "volume": 40, "cpc": 2.91, "pd": 16, "seo_difficulty": 25},
    {"keyword": "indoor dog park sioux falls", "intent": "C", "volume": 40, "cpc": 0.00, "pd": 4, "seo_difficulty": 32},
    {"keyword": "indoor dog park twin cities", "intent": "T", "volume": 40, "cpc": 1.29, "pd": 41, "seo_difficulty": 23},
    {"keyword": "indoor dog park bay area", "intent": "C", "volume": 30, "cpc": 0.00, "pd": 14, "seo_difficulty": 21},
    {"keyword": "indoor dog park dfw", "intent": "C", "volume": 30, "cpc": 2.55, "pd": 30, "seo_difficulty": 22},
    {"keyword": "indoor dog park florida", "intent": "C", "volume": 30, "cpc": 0.00, "pd": 1, "seo_difficulty": 17},
    {"keyword": "indoor dog park fort worth", "intent": "C", "volume": 30, "cpc": 2.69, "pd": 32, "seo_difficulty": 21},
    {"keyword": "indoor dog park fort collins", "intent": "C", "volume": 30, "cpc": 4.75, "pd": 32, "seo_difficulty": 18},
    {"keyword": "indoor dog park greenville sc", "intent": "C", "volume": 30, "cpc": 0.54, "pd": 2, "seo_difficulty": 18},
    {"keyword": "indoor dog park henderson", "intent": "C", "volume": 30, "cpc": 0.92, "pd": 11, "seo_difficulty": 20},
    {"keyword": "indoor dog park jacksonville fl", "intent": "C", "volume": 30, "cpc": 0.00, "pd": 14, "seo_difficulty": 21},
    {"keyword": "indoor dog park miami", "intent": "T", "volume": 30, "cpc": 7.91, "pd": 22, "seo_difficulty": 15},
    {"keyword": "indoor dog park modesto", "intent": "C", "volume": 30, "cpc": 0.00, "pd": 1, "seo_difficulty": 31},
    {"keyword": "indoor dog park near me open now", "intent": "I", "volume": 30, "cpc": 0.83, "pd": 30, "seo_difficulty": 34},
    {"keyword": "indoor dog park okc", "intent": "C", "volume": 30, "cpc": 2.29, "pd": 20, "seo_difficulty": 25},
    {"keyword": "indoor dog park rhode island", "intent": "C", "volume": 30, "cpc": 6.82, "pd": 4, "seo_difficulty": 7},
    {"keyword": "indoor dog park richmond va", "intent": "C", "volume": 30, "cpc": 0.00, "pd": 21, "seo_difficulty": 24},
    {"keyword": "indoor dog park rochester mn", "intent": "C", "volume": 30, "cpc": 0.00, "pd": 1, "seo_difficulty": 24},
    {"keyword": "indoor dog park salt lake city", "intent": "C", "volume": 30, "cpc": 0.00, "pd": 2, "seo_difficulty": 6},
    {"keyword": "indoor dog park st louis mo", "intent": "C", "volume": 30, "cpc": 1.76, "pd": 10, "seo_difficulty": 17},
    {"keyword": "indoor dog park tampa", "intent": "C", "volume": 30, "cpc": 1.28, "pd": 11, "seo_difficulty": 20},
    {"keyword": "indoor dog park tulsa", "intent": "C", "volume": 30, "cpc": 1.39, "pd": 19, "seo_difficulty": 22},
    {"keyword": "indoor dog park tacoma", "intent": "C", "volume": 30, "cpc": 0.00, "pd": 5, "seo_difficulty": 15},
    {"keyword": "indoor dog park utah", "intent": "C", "volume": 30, "cpc": 0.00, "pd": 1, "seo_difficulty": 17},
    {"keyword": "indoor dog park apple valley mn", "intent": "C", "volume": 30, "cpc": 0.00, "pd": 1, "seo_difficulty": 5},
    {"keyword": "indoor dog park wisconsin", "intent": "C", "volume": 30, "cpc": 0.00, "pd": 14, "seo_difficulty": 16},
    {"keyword": "indoor dog park brewery", "intent": "I", "volume": 20, "cpc": 0.00, "pd": 5, "seo_difficulty": 7},
    {"keyword": "indoor dog park california", "intent": "I", "volume": 20, "cpc": 0.00, "pd": 3, "seo_difficulty": 6},
    {"keyword": "indoor dog park in arizona", "intent": "I", "volume": 20, "cpc": 0.00, "pd": 2, "seo_difficulty": 6},
    {"keyword": "jb's indoor dog park photos", "intent": "I", "volume": 20, "cpc": 0.00, "pd": 1, "seo_difficulty": 5},
    {"keyword": "indoor dog park knoxville", "intent": "I", "volume": 20, "cpc": 0.00, "pd": 10, "seo_difficulty": 9},
    {"keyword": "indoor dog park st paul", "intent": "I", "volume": 20, "cpc": 0.00, "pd": 5, "seo_difficulty": 7},
    {"keyword": "indoor dog park vegas", "intent": "I", "volume": 20, "cpc": 0.00, "pd": 5, "seo_difficulty": 7},
    {"keyword": "indoor dog park brooklyn", "intent": "I", "volume": 20, "cpc": 0.00, "pd": 14, "seo_difficulty": 10},
    {"keyword": "indoor dog park rental", "intent": "I", "volume": 20, "cpc": 0.00, "pd": 20, "seo_difficulty": 12},
]


def extract_location(keyword: str) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    """
    Extract location information from keyword.
    Returns: (city, state, region) tuple
    """
    keyword_lower = keyword.lower()
    city = None
    state = None
    region = None
    
    # Check for state abbreviations (2-letter codes)
    state_pattern = r'\b([a-z]{2})\b'
    state_matches = re.findall(state_pattern, keyword_lower)
    for match in state_matches:
        if match.upper() in STATE_ABBR_TO_FULL:
            state = match.upper()
            break
    
    # Check for full state names
    for state_name, abbr in US_STATES.items():
        if state_name in keyword_lower:
            state = abbr
            break
    
    # Check for cities
    for city_name in MAJOR_CITIES:
        if city_name in keyword_lower:
            city = city_name.title()
            break
    
    # Check for regions
    region_keywords = ['bay area', 'twin cities', 'dfw', 'long island']
    for reg in region_keywords:
        if reg in keyword_lower:
            region = reg.title()
            break
    
    return (city, state, region)


def extract_semantic_pattern(keyword: str) -> str:
    """
    Extract semantic pattern from keyword.
    Patterns: location-based, feature-based, brand-based, generic
    """
    keyword_lower = keyword.lower()
    
    # Brand-based patterns
    if any(brand in keyword_lower for brand in ["jb's", "unleashed", "zoomies"]):
        return "brand-based"
    
    # Feature-based patterns
    feature_keywords = ['franchise', 'equipment', 'bar', 'brewery', 'rental', 'with bar', 'near me']
    if any(feature in keyword_lower for feature in feature_keywords):
        return "feature-based"
    
    # Location-based patterns (has city, state, or region)
    city, state, region = extract_location(keyword)
    if city or state or region:
        return "location-based"
    
    # Generic
    return "generic"


def get_volume_tier(volume: int) -> str:
    """Categorize volume into tiers."""
    if volume >= 200:
        return "high"
    elif volume >= 50:
        return "medium"
    else:
        return "low"


def get_intent_name(intent: str) -> str:
    """Convert intent code to full name."""
    intent_map = {
        "C": "Commercial",
        "T": "Transactional",
        "I": "Informational",
        "N": "Navigational"
    }
    return intent_map.get(intent, "Unknown")


def calculate_seo_opportunity_score(kw_data: Dict[str, Any]) -> float:
    """
    Calculate SEO opportunity score (0-100).
    Higher score = better opportunity (high volume, low difficulty, good CPC).
    
    Formula: (volume_score * 0.4) + (difficulty_inverse * 0.4) + (cpc_score * 0.2)
    """
    volume = kw_data.get("volume", 0)
    difficulty = kw_data.get("seo_difficulty", 100)
    cpc = kw_data.get("cpc", 0)
    
    # Volume score (0-100): log scale to normalize
    volume_score = min(100, (volume / 200) * 100) if volume > 0 else 0
    
    # Difficulty inverse score (0-100): lower difficulty = higher score
    difficulty_inverse = max(0, 100 - (difficulty * 2))
    
    # CPC score (0-100): higher CPC = higher value
    cpc_score = min(100, (cpc / 5) * 100) if cpc > 0 else 0
    
    # Weighted combination
    opportunity_score = (volume_score * 0.4) + (difficulty_inverse * 0.4) + (cpc_score * 0.2)
    
    return round(opportunity_score, 2)


def generate_long_tail_variations(keyword: str, city: Optional[str] = None, state: Optional[str] = None) -> List[str]:
    """
    Generate long-tail keyword variations for better SEO coverage.
    """
    variations = []
    base = keyword.lower()
    
    # Question-based variations
    question_words = ["where", "what", "how", "best", "top", "nearby", "cheap", "affordable"]
    for qw in question_words:
        variations.append(f"{qw} {base}")
        if city:
            variations.append(f"{qw} {base} in {city}")
        if state:
            variations.append(f"{qw} {base} in {state}")
    
    # Modifier variations
    modifiers = ["best", "top", "cheap", "affordable", "premium", "luxury", "24/7", "open now"]
    for mod in modifiers:
        if mod not in base:
            variations.append(f"{mod} {base}")
            if city:
                variations.append(f"{base} {city} {mod}")
    
    # Local intent variations
    local_modifiers = ["near me", "close to me", "nearby", "in my area"]
    for local in local_modifiers:
        if local not in base:
            variations.append(f"{base} {local}")
    
    # Return top 10 most relevant
    return variations[:10]


def suggest_content_type(kw_data: Dict[str, Any], cluster_type: str) -> str:
    """
    Suggest content type based on keyword intent and cluster.
    """
    intent = kw_data.get("intent", "C")
    keyword = kw_data.get("keyword", "").lower()
    
    # Transactional intent -> landing pages, booking pages
    if intent == "T":
        if "equipment" in keyword or "franchise" in keyword:
            return "product_page"
        return "booking_page"
    
    # Commercial intent -> city pages, location guides
    if intent == "C":
        if any(loc in keyword for loc in ["in ", "near me", "city", "state"]):
            return "city_guide"
        return "location_page"
    
    # Informational intent -> blog posts, guides, FAQs
    if intent == "I":
        if any(q in keyword for q in ["how", "what", "why", "best", "top"]):
            return "how_to_guide"
        if "photos" in keyword or "pictures" in keyword:
            return "gallery_page"
        return "blog_post"
    
    # Default
    return "landing_page"


def identify_low_hanging_fruit(keywords: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Identify low-hanging fruit: keywords with low difficulty but decent volume.
    Criteria: difficulty < 20, volume >= 30, opportunity_score > 50
    """
    opportunities = []
    
    for kw_data in keywords:
        difficulty = kw_data.get("seo_difficulty", 100)
        volume = kw_data.get("volume", 0)
        opportunity_score = calculate_seo_opportunity_score(kw_data)
        
        if difficulty < 20 and volume >= 30 and opportunity_score > 50:
            opportunities.append({
                **kw_data,
                "opportunity_score": opportunity_score,
                "priority": "high" if opportunity_score > 70 else "medium"
            })
    
    # Sort by opportunity score descending
    return sorted(opportunities, key=lambda x: x["opportunity_score"], reverse=True)


def enhance_local_seo_metadata(keyword: str, city: Optional[str], state: Optional[str]) -> Dict[str, Any]:
    """
    Enhance keywords with local SEO metadata.
    """
    keyword_lower = keyword.lower()
    
    # Detect local intent signals
    has_near_me = "near me" in keyword_lower or "nearby" in keyword_lower
    has_proximity = any(phrase in keyword_lower for phrase in ["within", "close to", "in my area"])
    has_local_modifier = any(phrase in keyword_lower for phrase in ["open now", "24/7", "today"])
    
    # Calculate local intent score (0-100)
    local_score = 0
    if has_near_me:
        local_score += 40
    if has_proximity:
        local_score += 30
    if has_local_modifier:
        local_score += 20
    if city:
        local_score += 10
    if state:
        local_score += 5
    
    return {
        "has_local_intent": local_score >= 40,
        "local_intent_score": min(100, local_score),
        "has_near_me": has_near_me,
        "has_proximity_modifier": has_proximity,
        "has_time_sensitivity": has_local_modifier,
        "recommended_page_type": "local_landing_page" if local_score >= 50 else "city_page"
    }


def cluster_keywords(keywords: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Cluster keywords by multiple dimensions.
    Returns structured cluster data.
    """
    # Initialize cluster storage
    location_clusters = defaultdict(list)
    intent_clusters = defaultdict(list)
    semantic_clusters = defaultdict(list)
    volume_clusters = defaultdict(list)
    
    # Process each keyword
    keyword_assignments = {}
    
    for kw_data in keywords:
        keyword = kw_data["keyword"]
        intent = kw_data["intent"]
        volume = kw_data["volume"]
        
        # Location clustering
        city, state, region = extract_location(keyword)
        if city:
            cluster_id = f"location_city_{city.lower().replace(' ', '_')}"
            location_clusters[cluster_id].append(kw_data)
        elif state:
            cluster_id = f"location_state_{state.lower()}"
            location_clusters[cluster_id].append(kw_data)
        elif region:
            cluster_id = f"location_region_{region.lower().replace(' ', '_')}"
            location_clusters[cluster_id].append(kw_data)
        else:
            cluster_id = "location_none"
            location_clusters[cluster_id].append(kw_data)
        
        # Intent clustering
        intent_cluster_id = f"intent_{intent}"
        intent_clusters[intent_cluster_id].append(kw_data)
        
        # Semantic clustering
        semantic_pattern = extract_semantic_pattern(keyword)
        semantic_cluster_id = f"semantic_{semantic_pattern}"
        semantic_clusters[semantic_cluster_id].append(kw_data)
        
        # Volume clustering
        volume_tier = get_volume_tier(volume)
        volume_cluster_id = f"volume_{volume_tier}"
        volume_clusters[volume_cluster_id].append(kw_data)
        
        # Calculate SEO opportunity score
        opportunity_score = calculate_seo_opportunity_score(kw_data)
        
        # Generate long-tail variations
        long_tail_variations = generate_long_tail_variations(keyword, city, state)
        
        # Suggest content type
        content_type = suggest_content_type(kw_data, semantic_pattern)
        
        # Enhance with local SEO metadata
        local_seo_metadata = enhance_local_seo_metadata(keyword, city, state)
        
        # Store assignments with SEO enhancements
        keyword_assignments[keyword] = {
            "location_cluster": cluster_id,
            "intent_cluster": intent_cluster_id,
            "semantic_cluster": semantic_cluster_id,
            "volume_cluster": volume_cluster_id,
            "opportunity_score": opportunity_score,
            "content_type": content_type,
            "long_tail_variations": long_tail_variations,
            "local_seo": local_seo_metadata
        }
    
    # Calculate cluster statistics
    def calculate_cluster_stats(cluster_keywords: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not cluster_keywords:
            return {
                "total_volume": 0,
                "avg_cpc": 0.0,
                "avg_pd": 0.0,
                "avg_seo_difficulty": 0.0,
                "avg_opportunity_score": 0.0,
                "keyword_count": 0
            }
        
        total_volume = sum(kw.get("volume", 0) for kw in cluster_keywords)
        cpc_values = [kw.get("cpc", 0) for kw in cluster_keywords if kw.get("cpc", 0) > 0]
        pd_values = [kw.get("pd", 0) for kw in cluster_keywords if kw.get("pd", 0) > 0]
        seo_values = [kw.get("seo_difficulty", 0) for kw in cluster_keywords if kw.get("seo_difficulty", 0) > 0]
        opportunity_scores = [calculate_seo_opportunity_score(kw) for kw in cluster_keywords]
        
        return {
            "total_volume": total_volume,
            "avg_cpc": sum(cpc_values) / len(cpc_values) if cpc_values else 0.0,
            "avg_pd": sum(pd_values) / len(pd_values) if pd_values else 0.0,
            "avg_seo_difficulty": sum(seo_values) / len(seo_values) if seo_values else 0.0,
            "avg_opportunity_score": sum(opportunity_scores) / len(opportunity_scores) if opportunity_scores else 0.0,
            "keyword_count": len(cluster_keywords)
        }
    
    # Build cluster definitions
    clusters = {}
    
    # Location clusters
    for cluster_id, cluster_keywords in location_clusters.items():
        clusters[cluster_id] = {
            "type": "location",
            "name": cluster_id.replace("location_", "").replace("_", " ").title(),
            "keywords": [kw["keyword"] for kw in cluster_keywords],
            "stats": calculate_cluster_stats(cluster_keywords),
            "keywords_data": cluster_keywords
        }
    
    # Intent clusters
    for cluster_id, cluster_keywords in intent_clusters.items():
        intent_code = cluster_id.replace("intent_", "")
        clusters[cluster_id] = {
            "type": "intent",
            "name": get_intent_name(intent_code),
            "keywords": [kw["keyword"] for kw in cluster_keywords],
            "stats": calculate_cluster_stats(cluster_keywords),
            "keywords_data": cluster_keywords
        }
    
    # Semantic clusters
    for cluster_id, cluster_keywords in semantic_clusters.items():
        clusters[cluster_id] = {
            "type": "semantic",
            "name": cluster_id.replace("semantic_", "").replace("-", " ").title(),
            "keywords": [kw["keyword"] for kw in cluster_keywords],
            "stats": calculate_cluster_stats(cluster_keywords),
            "keywords_data": cluster_keywords
        }
    
    # Volume clusters
    for cluster_id, cluster_keywords in volume_clusters.items():
        clusters[cluster_id] = {
            "type": "volume",
            "name": cluster_id.replace("volume_", "").title(),
            "keywords": [kw["keyword"] for kw in cluster_keywords],
            "stats": calculate_cluster_stats(cluster_keywords),
            "keywords_data": cluster_keywords
        }
    
    # Identify low-hanging fruit opportunities
    low_hanging_fruit = identify_low_hanging_fruit(keywords)
    
    return {
        "clusters": clusters,
        "keyword_assignments": keyword_assignments,
        "low_hanging_fruit": low_hanging_fruit,
        "summary": {
            "total_keywords": len(keywords),
            "total_clusters": len(clusters),
            "location_clusters": len(location_clusters),
            "intent_clusters": len(intent_clusters),
            "semantic_clusters": len(semantic_clusters),
            "volume_clusters": len(volume_clusters),
            "low_hanging_fruit_count": len(low_hanging_fruit)
        }
    }


def print_cluster_summary(cluster_data: Dict[str, Any]) -> None:
    """Print a readable summary of clusters to console."""
    print("\n" + "=" * 80)
    print("KEYWORD CLUSTERING SUMMARY")
    print("=" * 80)
    
    summary = cluster_data["summary"]
    print(f"\nTotal Keywords: {summary['total_keywords']}")
    print(f"Total Clusters: {summary['total_clusters']}")
    print(f"  - Location Clusters: {summary['location_clusters']}")
    print(f"  - Intent Clusters: {summary['intent_clusters']}")
    print(f"  - Semantic Clusters: {summary['semantic_clusters']}")
    print(f"  - Volume Clusters: {summary['volume_clusters']}")
    print(f"  - Low-Hanging Fruit Opportunities: {summary.get('low_hanging_fruit_count', 0)}")
    
    # Print top low-hanging fruit
    if cluster_data.get("low_hanging_fruit"):
        print(f"\n{'=' * 80}")
        print("TOP LOW-HANGING FRUIT OPPORTUNITIES")
        print("=" * 80)
        for i, opp in enumerate(cluster_data["low_hanging_fruit"][:10], 1):
            print(f"\n{i}. {opp['keyword']}")
            print(f"   Opportunity Score: {opp['opportunity_score']:.1f}/100")
            print(f"   Volume: {opp['volume']:,} | Difficulty: {opp['seo_difficulty']} | CPC: ${opp.get('cpc', 0):.2f}")
            print(f"   Priority: {opp['priority'].upper()}")
            print(f"   Content Type: {cluster_data['keyword_assignments'][opp['keyword']]['content_type']}")
    
    clusters = cluster_data["clusters"]
    
    # Group clusters by type
    by_type = defaultdict(list)
    for cluster_id, cluster_info in clusters.items():
        by_type[cluster_info["type"]].append((cluster_id, cluster_info))
    
    # Print by type
    for cluster_type in ["location", "intent", "semantic", "volume"]:
        if cluster_type not in by_type:
            continue
        
        print(f"\n{'=' * 80}")
        print(f"{cluster_type.upper()} CLUSTERS")
        print("=" * 80)
        
        # Sort by total volume (descending)
        type_clusters = sorted(
            by_type[cluster_type],
            key=lambda x: x[1]["stats"]["total_volume"],
            reverse=True
        )
        
        for cluster_id, cluster_info in type_clusters[:10]:  # Top 10 per type
            stats = cluster_info["stats"]
            print(f"\n{cluster_info['name']} ({cluster_id})")
            print(f"  Keywords: {stats['keyword_count']}")
            print(f"  Total Volume: {stats['total_volume']:,}")
            print(f"  Avg CPC: ${stats['avg_cpc']:.2f}")
            print(f"  Avg SEO Difficulty: {stats['avg_seo_difficulty']:.1f}")
            print(f"  Avg Opportunity Score: {stats.get('avg_opportunity_score', 0):.1f}/100")
            print(f"  Top Keywords:")
            for kw in cluster_info["keywords"][:5]:
                print(f"    - {kw}")
            if len(cluster_info["keywords"]) > 5:
                print(f"    ... and {len(cluster_info['keywords']) - 5} more")


def main():
    parser = argparse.ArgumentParser(
        description="Cluster SEO keywords by location, intent, semantic patterns, and volume."
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("public/data/keyword_clusters.json"),
        help="Output JSON file path",
    )
    parser.add_argument(
        "--input",
        type=Path,
        help="Input JSON file with keywords (optional, uses embedded data if not provided)",
    )
    args = parser.parse_args()
    
    # Load keyword data
    if args.input and args.input.exists():
        with open(args.input, "r", encoding="utf-8") as f:
            keywords = json.load(f)
    else:
        keywords = KEYWORD_DATA
    
    print(f"Processing {len(keywords)} keywords...")
    
    # Cluster keywords
    cluster_data = cluster_keywords(keywords)
    
    # Ensure output directory exists
    args.output.parent.mkdir(parents=True, exist_ok=True)
    
    # Save to JSON
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(cluster_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Clustering complete!")
    print(f"✓ Results saved to: {args.output}")
    
    # Print summary
    print_cluster_summary(cluster_data)


if __name__ == "__main__":
    main()

