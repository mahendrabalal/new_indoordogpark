'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';


// Define the shape of the city object based on usage
export interface City {
    name: string;
    slug: string;
    parkCount: number;
    state: string; // state abbreviation
}

interface CityDirectoryProps {
    citiesByState: Record<string, City[]>;
    sortedStateKeys: string[];
    abbrToName: Record<string, string>;
}

export default function CityDirectory({ citiesByState, sortedStateKeys, abbrToName }: CityDirectoryProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStateKeys = useMemo(() => {
        if (!searchQuery.trim()) return sortedStateKeys;

        const query = searchQuery.toLowerCase();
        return sortedStateKeys.filter(stateAbbr => {
            const stateName = (abbrToName[stateAbbr] || stateAbbr).toLowerCase();
            // Check if state name matches
            if (stateName.includes(query)) return true;

            // Check if any city in the state matches
            const cities = citiesByState[stateAbbr];
            return cities.some(city => city.name.toLowerCase().includes(query));
        });
    }, [searchQuery, sortedStateKeys, citiesByState, abbrToName]);

    // When searching, we might want to filter the cities shown within a state too
    // But usually for a directory, if a state matches, show all? 
    // Or if a city matches, show only that city?
    // Let's go with: Show the state block if the State Name matches OR if it contains a matching City.
    // Inside the block, if the State Name matched, show all cities.
    // If only specific cities matched, maybe still show all to provide context? 
    // Let's keep it simple: Show all cities in the state block if the block remains visible.
    // Actually, user wants "list is too long". Filtering cities might be better.

    const getVisibleCities = (stateAbbr: string) => {
        const cities = citiesByState[stateAbbr];
        if (!searchQuery.trim()) return cities;

        const query = searchQuery.toLowerCase();
        const stateName = (abbrToName[stateAbbr] || stateAbbr).toLowerCase();

        // If state name matches exactly or close, maybe show all? 
        // Let's just filter cities if the state name doesn't match the query strongly.
        // But simpler logic: Filter list of cities. If list is empty but state matched?

        const matchingCities = cities.filter(city => city.name.toLowerCase().includes(query));

        // If the state name itself matched, show all cities (as the user might be looking for "Texas")
        if (stateName.includes(query)) return cities;

        return matchingCities;
    };

    return (
        <div className="city-directory-container">
            <div className="search-container">
                <div className="search-input-wrapper">
                    <i className="bi bi-search search-icon"></i>
                    <input
                        type="text"
                        placeholder="Find your city or state..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="directory-search-input"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="clear-search-btn"
                            aria-label="Clear search"
                        >
                            <i className="bi bi-x-circle-fill"></i>
                        </button>
                    )}
                </div>
            </div>

            {filteredStateKeys.length === 0 ? (
                <div className="no-results">
                    <p>No locations found matching &quot;{searchQuery}&quot;</p>
                    <button onClick={() => setSearchQuery('')} className="reset-search-link">
                        Show all cities
                    </button>
                </div>
            ) : (
                <div className="directory-columns">
                    {filteredStateKeys.map(stateAbbr => {
                        const fullName = abbrToName[stateAbbr] || stateAbbr;
                        const stateSlug = fullName.toLowerCase().replace(/\s+/g, '-');
                        const visibleCities = getVisibleCities(stateAbbr);

                        if (visibleCities.length === 0) return null;

                        return (
                            <div key={stateAbbr} className="state-block">
                                <h3 className="state-header">
                                    <Link href={`/states/${stateSlug}`} className="state-link">
                                        {fullName}
                                    </Link>
                                    <span className="state-count-badge">
                                        {citiesByState[stateAbbr].length}
                                    </span>
                                </h3>
                                <ul className="city-list">
                                    {visibleCities
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map(city => (
                                            <li key={city.slug}>
                                                <Link href={`/cities/${city.slug}`} className="city-link">
                                                    {city.name}
                                                </Link>
                                                {city.parkCount > 0 && (
                                                    <span className="count-pill">{city.parkCount}</span>
                                                )}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
