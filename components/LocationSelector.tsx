import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { LocationSearchResult, searchLocations } from '../services/routingService';
import { TravelSource } from '../data/database';

interface LocationSelectorProps {
    label: string;
    placeholder?: string;
    initialValue?: string;
    onSelect: (location: LocationSearchResult | TravelSource) => void;
    defaultOptions?: TravelSource[];
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
    label,
    placeholder = "Search location...",
    initialValue = "",
    onSelect,
    defaultOptions = []
}) => {
    const [query, setQuery] = useState(initialValue);

    // Update query when initialValue changes
    useEffect(() => {
        setQuery(initialValue);
    }, [initialValue]);
    const [results, setResults] = useState<(LocationSearchResult | TravelSource)[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounce search
    // Search Effect
    useEffect(() => {
        let isMounted = true;
        const debounceTimer = setTimeout(async () => {
            if (!isMounted) return;

            // 1. Empty query: Show default options
            if (!query.trim()) {
                setResults(defaultOptions);
                setIsLoading(false);
                return;
            }

            if (query.length < 3) {
                // Too short to search remote, just filter local
                const localMatches = defaultOptions.filter(opt =>
                    opt.name.toLowerCase().includes(query.toLowerCase()) ||
                    opt.address.toLowerCase().includes(query.toLowerCase())
                );
                setResults(localMatches);
                setIsLoading(false);
                return;
            }

            // 2. Query >= 3 chars: Search both
            setIsLoading(true);
            try {
                // Local filter
                const localMatches = defaultOptions.filter(opt =>
                    opt.name.toLowerCase().includes(query.toLowerCase()) ||
                    opt.address.toLowerCase().includes(query.toLowerCase())
                );

                // Remote search
                // Only search remote if we are open to avoid unnecessary calls
                const remoteResults = await searchLocations(query);

                if (isMounted) {
                    // Combine: Local first, then unique remote results
                    // Deduplicate based on name roughly to avoid showing "DICT HQ" twice if it comes from OSM too
                    const combined = [...localMatches];
                    const existingNames = new Set(localMatches.map(l => l.name.toLowerCase()));

                    remoteResults.forEach(r => {
                        const name = r.display_name.split(',')[0];
                        if (!existingNames.has(name.toLowerCase())) {
                            combined.push(r);
                        }
                    });

                    setResults(combined);
                }
            } catch (error) {
                console.error("Search failed", error);
                if (isMounted) setResults([]); // or keep previous?
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }, 500);

        return () => {
            isMounted = false;
            clearTimeout(debounceTimer);
        };
    }, [query, defaultOptions]); // Removed isOpen dependency to allow pre-fetching or consistent state

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (item: LocationSearchResult | TravelSource) => {
        const name = 'name' in item ? item.name : item.display_name;
        setQuery(name);
        setIsOpen(false);
        onSelect(item);
    };

    const getDisplayName = (item: LocationSearchResult | TravelSource) => {
        return 'name' in item ? item.name : item.display_name;
    };

    const getAddress = (item: LocationSearchResult | TravelSource) => {
        if ('address' in item && typeof item.address === 'string') return item.address;
        if ('display_name' in item) {
            // limit address length
            const addr = item.display_name.split(',').slice(1).join(',').trim();
            return addr.length > 50 ? addr.substring(0, 50) + '...' : addr;
        }
        return '';
    };

    return (
        <div className="relative space-y-2" ref={wrapperRef}>
            {label && (
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label} <span className="text-red-500">*</span>
                </label>
            )}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        if (query.length === 0) setResults(defaultOptions);
                    }}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-dash-blue focus:border-transparent outline-none transition-all"
                />
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {/* Local Matches (DICT Offices) */}
                    {results.filter(r => 'id' in r && (r as any).id).length > 0 && (
                        <div className="px-3 py-2 text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 sticky top-0">
                            Saved Locations (DICT Offices)
                        </div>
                    )}
                    {results.filter(r => 'id' in r && (r as any).id).map((item, index) => (
                        <LocationItem
                            key={`local-${index}`}
                            item={item}
                            onClick={handleSelect}
                            getDisplayName={getDisplayName}
                            getAddress={getAddress}
                        />
                    ))}

                    {/* Remote Matches (Public) */}
                    {results.filter(r => !('id' in r)).length > 0 && (
                        <div className="px-3 py-2 text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 sticky top-0">
                            Search Results (Public Locations)
                        </div>
                    )}
                    {results.filter(r => !('id' in r)).map((item, index) => (
                        <LocationItem
                            key={`remote-${index}`}
                            item={item}
                            onClick={handleSelect}
                            getDisplayName={getDisplayName}
                            getAddress={getAddress}
                        />
                    ))}

                    {results.length === 0 && !isLoading && (
                        <div className="px-4 py-8 text-center text-slate-500 text-sm">
                            No locations found. Try a different search term.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const LocationItem = ({ item, onClick, getDisplayName, getAddress }: any) => (
    <button
        onClick={() => onClick(item)}
        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors"
    >
        <div className="flex items-start gap-3">
            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${'id' in item ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                }`}>
                <MapPin className="w-4 h-4" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {getDisplayName(item)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[280px]">
                    {getAddress(item)}
                </p>
            </div>
            {'id' in item && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded border border-blue-200">
                    OFFICE
                </span>
            )}
        </div>
    </button>
);

export default LocationSelector;
