import { TravelSource } from '../data/database';

export interface LocationSearchResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
    address: {
        road?: string;
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        country?: string;
        postcode?: string;
    };
    boundingbox: string[];
}

export interface RouteOption {
    geometry: {
        coordinates: [number, number][];
        type: string;
    };
    legs: {
        distance: number;
        duration: number;
        summary: string;
        steps: any[];
    }[];
    weight_name: string;
    weight: number;
    duration: number;
    distance: number;
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
const OSRM_BASE_URL = 'http://router.project-osrm.org/route/v1/driving';

export const searchLocations = async (query: string): Promise<LocationSearchResult[]> => {
    if (!query || query.length < 3) return [];

    try {
        const params = new URLSearchParams({
            q: query,
            format: 'json',
            addressdetails: '1',
            limit: '10',
            countrycodes: 'ph',
            viewbox: '116.93,4.59,126.61,21.12', // Rough bounding box for Philippines to bias results
            bounded: '1'
        });

        const response = await fetch(`${NOMINATIM_BASE_URL}?${params.toString()}`, {
            headers: {
                'User-Agent': 'DICT-Travel-System/1.0'
            }
        });

        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error searching locations:', error);
        return [];
    }
};

// Haversine formula for distance in km
const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const getRouteOptions = async (
    from: { lat: number; lng: number },
    to: { lat: number; lng: number },
    stops: { lat: number; lng: number }[] = [],
    avoid: ('tolls' | 'highways' | 'ferries')[] = [],
    avoidPoint: { lat: number; lng: number } | null = null
): Promise<RouteOption[]> => {
    // Construct coordinates string: start;stop1;stop2;end
    const waypoints = stops.map(s => `${s.lng},${s.lat}`).join(';');
    const coordinates = waypoints
        ? `${from.lng},${from.lat};${waypoints};${to.lng},${to.lat}`
        : `${from.lng},${from.lat};${to.lng},${to.lat}`;

    let baseParams = `?overview=full&geometries=geojson&steps=false`;

    // Handle avoidances
    const excludes: string[] = [];
    if (avoid.includes('tolls')) excludes.push('toll');
    if (avoid.includes('highways')) excludes.push('motorway');
    if (avoid.includes('ferries')) excludes.push('ferry');

    if (excludes.length > 0) {
        baseParams += `&exclude=${excludes.join(',')}`;
    }

    // Generate variations to force diverse routes
    // We combine different exclusion flags to find distinct paths
    // Simplified approach to avoid API blocking/failure
    try {
        // 1. First try the standard unrestricted route to ensure connectivity
        // Use alternatives=true to get whatever the server easily gives (usually 2-3)
        // If specific avoidances are requested, the primary URL respects them
        const primaryUrl = `${OSRM_BASE_URL}/${coordinates}${baseParams}&alternatives=true`;
        const primaryResponse = await fetch(primaryUrl);
        let allRoutes: RouteOption[] = [];

        if (primaryResponse.ok) {
            const data = await primaryResponse.json();
            if (data.code === 'Ok' && data.routes) {
                allRoutes = data.routes;
            }
        }

        // 2. If we have a valid route, try ONE additional variation to find a non-highway/toll option
        // We do this sequentially to be gentle on the public API
        // Only do this if the first route succeeded, meaning points are reachable
        if (allRoutes.length > 0) {
            const altUrl = `${OSRM_BASE_URL}/${coordinates}${baseParams}&exclude=toll,motorway&alternatives=true`;
            try {
                const altResponse = await fetch(altUrl);
                if (altResponse.ok) {
                    const altData = await altResponse.json();
                    if (altData.code === 'Ok' && altData.routes) {
                        allRoutes = [...allRoutes, ...altData.routes];
                    }
                }
            } catch (e) {
                // Ignore alternative failures if we have primary
            }
        }

        // Return whatever we found (even if just 1)
        if (allRoutes.length === 0) {
            // FALLBACK: OSRM often fails for inter-island (sea/air) or very long routes.
            // If we found no routes, generate a straight-line "Direct/Air/Sea" estimation.
            const points = [from, ...stops, to];
            let totalDist = 0;
            const coordinates: [number, number][] = [];

            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];
                totalDist += getDistanceFromLatLonInKm(p1.lat, p1.lng, p2.lat, p2.lng);
                coordinates.push([p1.lng, p1.lat]);
            }
            // Add last point
            coordinates.push([to.lng, to.lat]);

            // Create a synthetic route option
            const directRoute: RouteOption = {
                geometry: {
                    coordinates: coordinates,
                    type: 'LineString'
                },
                legs: [{
                    distance: totalDist * 1000, // convert to meters
                    duration: 0, // Unknown duration
                    summary: 'Direct / Air / Sea Travel',
                    steps: []
                }],
                weight_name: 'routability',
                weight: 0,
                duration: 0,
                distance: totalDist * 1000
            };

            return [directRoute];
        }

        // Deduplicate routes based on geometry and distance
        let uniqueRoutes: RouteOption[] = [];
        const seenSignatures = new Set<string>();

        allRoutes.forEach(route => {
            // Create a signature to identify unique paths
            // Use distance + duration + summary as a rough signature to avoid expensive geometry stringify
            // Or use the geometry length + start/mid/end points
            const sig = `${Math.round(route.distance)}-${Math.round(route.duration)}`;

            if (!seenSignatures.has(sig)) {
                seenSignatures.add(sig);
                uniqueRoutes.push(route);
            }
        });

        // Filter out routes that pass near the avoidPoint
        if (avoidPoint) {
            // Calculate minimum distance to avoidPoint for each route
            const routesWithDist = uniqueRoutes.map(route => {
                let minDist = Infinity;
                route.geometry.coordinates.forEach(coord => {
                    const d = getDistanceFromLatLonInKm(avoidPoint.lat, avoidPoint.lng, coord[1], coord[0]);
                    if (d < minDist) minDist = d;
                });
                return { route, minDist };
            });

            // Try to find routes completely outside the radius (10km)
            const SAFE_RADIUS = 10.0;
            const safeRoutes = routesWithDist.filter(item => item.minDist >= SAFE_RADIUS).map(item => item.route);

            if (safeRoutes.length > 0) {
                uniqueRoutes = safeRoutes;
            } else {
                // If all routes invade the area, pick the "least bad" one (largest minimum distance)
                // Sort by minDist descending (furthest away first)
                routesWithDist.sort((a, b) => b.minDist - a.minDist);
                // Return the top 3 best attempts, or just all of them sorted
                uniqueRoutes = routesWithDist.map(item => item.route);
            }
        }

        return uniqueRoutes.sort((a, b) => a.duration - b.duration);

    } catch (error) {
        console.error('Error fetching routes:', error);
        return [];
    }
};

export interface SavedRoute {
    id: string;
    name: string;
    from: NormalizedLocation;
    to: NormalizedLocation;
    stops: NormalizedLocation[];
    avoid: ('tolls' | 'highways' | 'ferries')[];
    avoidPoint: NormalizedLocation | null;
    createdAt: number;
}

export const saveRouteToStorage = (route: Omit<SavedRoute, 'id' | 'createdAt'>) => {
    try {
        const saved = getSavedRoutesFromStorage();
        const newRoute: SavedRoute = {
            ...route,
            id: crypto.randomUUID(),
            createdAt: Date.now()
        };
        localStorage.setItem('dict_saved_routes', JSON.stringify([...saved, newRoute]));
        return newRoute;
    } catch (e) {
        console.error("Failed to save route", e);
        return null;
    }
};

export const getSavedRoutesFromStorage = (): SavedRoute[] => {
    try {
        const item = localStorage.getItem('dict_saved_routes');
        return item ? JSON.parse(item) : [];
    } catch (e) {
        console.error("Failed to load saved routes", e);
        return [];
    }
};

export const deleteSavedRoute = (id: string) => {
    try {
        const saved = getSavedRoutesFromStorage();
        const filtered = saved.filter(r => r.id !== id);
        localStorage.setItem('dict_saved_routes', JSON.stringify(filtered));
    } catch (e) {
        console.error("Failed to delete route", e);
    }
};

// Start coordinates for fallback map center (Default: Manila)
// Helper to normalize location data
export interface NormalizedLocation {
    lat: number;
    lng: number;
    name: string;
    address?: string;
}

export const normalizeLocation = (loc: any): NormalizedLocation | null => {
    if (!loc) return null;

    // Handle TravelSource (from database)
    if ('latitude' in loc && 'longitude' in loc) {
        return {
            lat: loc.latitude,
            lng: loc.longitude,
            name: loc.name,
            address: loc.address
        };
    }

    // Handle LocationSearchResult (from Nominatim)
    if ('lat' in loc && 'lon' in loc) {
        return {
            lat: parseFloat(loc.lat),
            lng: parseFloat(loc.lon),
            name: loc.display_name.split(',')[0], // Take first part
            address: loc.display_name
        };
    }

    return null;
};
