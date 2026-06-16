import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { LatLngExpression, LatLngBounds, divIcon } from 'leaflet';
import { RouteOption, NormalizedLocation } from '../services/routingService';

const startIcon = divIcon({
    className: 'custom-marker',
    html: `<svg width="28" height="36" viewBox="0 0 28 36" style="overflow: visible;">
        <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22s14-11.5 14-22c0-7.73-6.27-14-14-14z" fill="#22c55e" stroke="white" stroke-width="2"/>
        <circle cx="14" cy="14" r="5" fill="white"/>
    </svg>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36]
});

const endIcon = divIcon({
    className: 'custom-marker',
    html: `<svg width="28" height="36" viewBox="0 0 28 36" style="overflow: visible;">
        <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22s14-11.5 14-22c0-7.73-6.27-14-14-14z" fill="#ef4444" stroke="white" stroke-width="2"/>
        <circle cx="14" cy="14" r="5" fill="white"/>
    </svg>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36]
});

const stopIcon = divIcon({
    className: 'custom-marker',
    html: `<svg width="24" height="32" viewBox="0 0 24 32" style="overflow: visible;">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z" fill="#3b82f6" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>`,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -32]
});

const avoidIcon = divIcon({
    className: 'custom-marker',
    html: `<svg width="24" height="32" viewBox="0 0 24 32" style="overflow: visible;">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z" fill="#e11d48" stroke="white" stroke-width="2"/>
        <path d="M9 9l6 6M15 9l-6 6" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -32]
});


interface RoutingMapProps {
    startLocation: NormalizedLocation;
    endLocation: NormalizedLocation;
    stops?: NormalizedLocation[];
    avoidLocation?: NormalizedLocation | null;
    routes: RouteOption[];
    selectedRouteIndex: number;
    onSelectRoute: (index: number) => void;
}

// Component to handle map view updates
function MapUpdater({ bounds }: { bounds: LatLngBounds | null }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [bounds, map]);
    return null;
}

const RoutingMap: React.FC<RoutingMapProps> = ({
    startLocation,
    endLocation,
    stops = [],
    avoidLocation,
    routes,
    selectedRouteIndex,
    onSelectRoute
}) => {
    // Memoize the transformed positions for all routes to avoid re-calculation on render
    const routePositions = React.useMemo(() => {
        return routes.map(route => ({
            positions: route.geometry.coordinates.map((c: number[]) => [c[1], c[0]] as LatLngExpression),
            distance: route.distance,
            duration: route.duration
        }));
    }, [routes]);

    // Calculate bounds
    const bounds = React.useMemo(() => {
        if (!startLocation || !endLocation) return null;
        const b = new LatLngBounds(
            [startLocation.lat, startLocation.lng],
            [endLocation.lat, endLocation.lng]
        );

        // Extend for stops
        stops.forEach(stop => {
            b.extend([stop.lat, stop.lng]);
        });

        // Extend for avoid location
        if (avoidLocation) {
            b.extend([avoidLocation.lat, avoidLocation.lng]);
        }

        // Extend bounds with route geometries if available
        // Use a sampling strategy if too many points to avoid freezing
        routePositions.forEach(route => {
            const step = Math.max(1, Math.floor(route.positions.length / 100)); // Sample every Nth point if huge
            route.positions.forEach((pos, i) => {
                if (i % step === 0) {
                    // pos is [lat, lng]
                    b.extend(pos as [number, number]);
                }
            });
        });

        return b;
    }, [startLocation, endLocation, stops, avoidLocation, routePositions]);

    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 relative z-0">
            {startLocation && endLocation && (
                <MapContainer
                    center={[startLocation.lat, startLocation.lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapUpdater bounds={bounds} />

                    {/* Start Marker */}
                    <Marker position={[startLocation.lat, startLocation.lng]} icon={startIcon}>
                        <Popup>
                            <div className="font-semibold">Start: {startLocation.name}</div>
                        </Popup>
                    </Marker>

                    {/* End Marker */}
                    <Marker position={[endLocation.lat, endLocation.lng]} icon={endIcon}>
                        <Popup>
                            <div className="font-semibold">End: {endLocation.name}</div>
                        </Popup>
                    </Marker>

                    {/* Stops/Waypoints Markers */}
                    {stops.map((stop, i) => (
                        <Marker key={`stop-${i}`} position={[stop.lat, stop.lng]} icon={stopIcon}>
                            <Popup>
                                <div className="font-semibold">Via: {stop.name}</div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Avoid Location Marker (Distinct) */}
                    {avoidLocation && (
                        <Marker position={[avoidLocation.lat, avoidLocation.lng]} opacity={0.7} icon={avoidIcon}>
                            <Popup>
                                <div className="font-semibold text-red-600">AVOID: {avoidLocation.name}</div>
                                <div className="text-xs text-red-500">Routes within 10km hidden</div>
                            </Popup>
                        </Marker>
                    )}

                    {/* Routes */}
                    {routePositions.map((route, index) => {
                        const isSelected = index === selectedRouteIndex;

                        return (
                            <React.Fragment key={index}>
                                {/* Invisible wider polyline for easier clicking */}
                                <Polyline
                                    positions={route.positions}
                                    pathOptions={{
                                        color: 'transparent',
                                        weight: 20,
                                        opacity: 0,
                                    }}
                                    eventHandlers={{
                                        click: () => onSelectRoute(index),
                                        mouseover: (e) => {
                                            const layer = e.target;
                                            layer.setStyle({ cursor: 'pointer' });
                                        }
                                    }}
                                />
                                {/* Visible Polyline */}
                                <Polyline
                                    positions={route.positions}
                                    pathOptions={{
                                        color: isSelected ? '#3b82f6' : '#94a3b8', // blue-500 : slate-400
                                        weight: isSelected ? 6 : 4,
                                        opacity: isSelected ? 0.9 : 0.5,
                                        dashArray: isSelected ? undefined : '10, 10'
                                    }}
                                    eventHandlers={{
                                        click: () => onSelectRoute(index)
                                    }}
                                >
                                    <Popup>
                                        <div className="text-sm">
                                            <span className="font-bold">Option {index + 1}</span><br />
                                            {(route.distance / 1000).toFixed(1)} km<br />
                                            {Math.round(route.duration / 60)} mins
                                        </div>
                                    </Popup>
                                </Polyline>
                            </React.Fragment>
                        );
                    })}
                </MapContainer>
            )}
        </div>
    );
};

export default RoutingMap;
