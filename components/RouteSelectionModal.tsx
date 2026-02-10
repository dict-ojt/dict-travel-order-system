import React, { useState, useEffect } from 'react';
import { X, Clock, Navigation, AlertTriangle, Loader2 } from 'lucide-react';
import { getRouteOptions, RouteOption, NormalizedLocation, normalizeLocation } from '../services/routingService';
import RoutingMap from './RoutingMap';
import LocationSelector from './LocationSelector';

interface RouteSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    from: NormalizedLocation | null;
    to: NormalizedLocation | null;
    stops?: NormalizedLocation[];
    onSelectRoute: (route: RouteOption) => void;
}

const RouteSelectionModal: React.FC<RouteSelectionModalProps> = ({
    isOpen,
    onClose,
    from,
    to,
    stops = [],
    onSelectRoute
}) => {
    const [routes, setRoutes] = useState<RouteOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
    const [avoidPreferences, setAvoidPreferences] = useState<('tolls' | 'highways' | 'ferries')[]>([]);
    const [avoidLocation, setAvoidLocation] = useState<NormalizedLocation | null>(null);

    const toggleAvoid = (pref: 'tolls' | 'highways' | 'ferries') => {
        setAvoidPreferences(prev =>
            prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
        );
    };

    useEffect(() => {
        if (isOpen && from && to) {
            setIsLoading(true);
            setError(null);
            getRouteOptions(from, to, stops, avoidPreferences, avoidLocation)
                .then(data => {
                    if (data.length === 0) {
                        setError('No routes found between these locations.');
                    } else {
                        setRoutes(data);
                        setSelectedRouteIndex(0);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setError('Failed to fetch routes. Please try again.');
                })
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, from, to, avoidPreferences, avoidLocation]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header with Avoid Options */}
                <div className="flex flex-col border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Select Route</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {from?.name} <span className="mx-1">→</span> {to?.name}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Avoid Options */}
                    <div className="px-6 pb-4 space-y-4">


                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                            <LocationSelector
                                label="Avoid Specific Area/Location (Route will reroute around this)"
                                placeholder="Enter a place to avoid (e.g. city center)..."
                                onSelect={(val) => {
                                    const norm = normalizeLocation(val);
                                    setAvoidLocation(norm);
                                }}
                            />
                            {avoidLocation && (
                                <div className="mt-1 text-xs text-red-500 flex items-center justify-between">
                                    <span>Avoiding routes near: <b>{avoidLocation.name}</b></span>
                                    <button onClick={() => setAvoidLocation(null)} className="underline ml-2">Clear</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                            <p className="text-slate-500">Calculating best routes...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
                            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <p className="text-slate-800 dark:text-slate-200 font-medium">{error}</p>
                            <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                                Close
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                            {/* Map - Takes up 2 cols */}
                            <div className="lg:col-span-2 h-[400px] lg:h-auto min-h-[400px]">
                                {ROUTES_EXIST(from, to, routes) && (
                                    <RoutingMap
                                        startLocation={from!} // safe due to check
                                        endLocation={to!}
                                        avoidLocation={avoidLocation}
                                        routes={routes}
                                        selectedRouteIndex={selectedRouteIndex}
                                        onSelectRoute={setSelectedRouteIndex}
                                    />
                                )}
                            </div>

                            {/* Route Options List */}
                            <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                                <h3 className="font-medium text-slate-900 dark:text-white sticky top-0 bg-white dark:bg-slate-800 pb-2 z-10">
                                    Available Routes ({routes.length})
                                </h3>
                                {routes.map((route, index) => {
                                    const isSelected = selectedRouteIndex === index;
                                    const distanceKm = (route.distance / 1000).toFixed(1);
                                    const durationMins = Math.round(route.duration / 60);
                                    const hours = Math.floor(durationMins / 60);
                                    const mins = durationMins % 60;
                                    const timeString = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

                                    const isFastest = index === 0;
                                    const isShortest = route.distance === Math.min(...routes.map(r => r.distance));
                                    const isDirect = route.legs[0]?.summary === 'Direct / Air / Sea Travel';

                                    let label = `Option ${index + 1}`;
                                    let badgeColor = 'bg-slate-100 text-slate-800';

                                    if (isDirect) {
                                        label = 'Direct / Air / Sea (Estimate)';
                                        badgeColor = 'bg-amber-100 text-amber-800';
                                    } else if (isFastest) {
                                        label = 'Recommended (Fastest)';
                                        badgeColor = 'bg-green-100 text-green-800';
                                    } else if (isShortest) {
                                        label = 'Shortest Distance';
                                        badgeColor = 'bg-blue-100 text-blue-800';
                                    } else {
                                        label = 'Alternative Route';
                                        badgeColor = 'bg-slate-100 text-slate-800';
                                    }

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedRouteIndex(index)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
                                                    {label}
                                                </span>
                                                {isSelected && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                    <Navigation className="w-4 h-4 text-blue-500" />
                                                    <span className="font-semibold text-lg">{distanceKm} km</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                    <Clock className="w-4 h-4 text-amber-500" />
                                                    <span>{isDirect ? 'Travel time varies' : timeString}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                                                    Via {route.legs[0]?.summary || 'Road'}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                    <div>
                        {routes.length > 0 && (
                            <button
                                onClick={() => {
                                    // Mock save functionality
                                    alert('Route saved successfully!');
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                            >
                                Save this route
                            </button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">
                            Cancel
                        </button>
                        <button
                            disabled={routes.length === 0}
                            onClick={() => onSelectRoute(routes[selectedRouteIndex])}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            Confirm Route
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper check
function ROUTES_EXIST(from: any, to: any, routes: any[]) {
    return from && to && routes.length > 0;
}

export default RouteSelectionModal;
