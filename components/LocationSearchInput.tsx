import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { travelSources } from '../data/database';

interface LocationSearchInputProps {
  value: string;
  onChange: (value: string, id?: string, lat?: number, lng?: number) => void;
  placeholder?: string;
  className?: string;
}

interface LocationSuggestion {
  id: string; // "source-xxx" or "osm-xxx"
  name: string;
  lat: number;
  lng: number;
  type: 'source' | 'osm';
  subtitle?: string;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  className 
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal query with prop value if it changes externally
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);

      try {
        // 1. Local Search (Travel Sources)
        const localResults: LocationSuggestion[] = travelSources
          .filter(source => 
            source.name.toLowerCase().includes(query.toLowerCase()) || 
            source.address.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 3)
          .map(source => ({
            id: source.id,
            name: source.name,
            lat: 0, // We don't have lat/lng in travelSources explicitly, but we can assume ID matching works for distance
            lng: 0,
            type: 'source',
            subtitle: source.address
          }));

        // 2. Remote Search (Nominatim)
        let osmResults: LocationSuggestion[] = [];
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ph`
          );
          if (response.ok) {
            const data = await response.json();
            osmResults = data.map((item: any) => ({
              id: `osm-${item.place_id}`,
              name: item.display_name.split(',')[0],
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              type: 'osm',
              subtitle: item.display_name.split(',').slice(1).join(',').trim()
            }));
          }
        } catch (error) {
          console.error('Failed to fetch OSM suggestions', error);
        }

        setSuggestions([...localResults, ...osmResults]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (suggestion: LocationSuggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    
    if (suggestion.type === 'source') {
      onChange(suggestion.name, suggestion.id);
    } else {
      onChange(suggestion.name, undefined, suggestion.lat, suggestion.lng);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 min-w-[200px]">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
            // Also notify parent of raw text change immediately
            onChange(e.target.value);
          }}
          onFocus={() => {
            if (query.length >= 2) setShowSuggestions(true);
          }}
          placeholder={placeholder}
          className={`w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-dash-blue/50 ${className}`}
        />
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {suggestion.name}
                </span>
                {suggestion.type === 'source' && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                    DICT
                  </span>
                )}
              </div>
              {suggestion.subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {suggestion.subtitle}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearchInput;
