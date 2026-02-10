import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, MapPin, X, Plus, Trash2, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { Page, RouteLeg } from '../types';

interface RoutePickerProps {
  onNavigate: (page: Page) => void;
  onSelectLeg: (leg: RouteLeg) => void;
  initialStartPoint?: { name: string; lat: number; lng: number } | null;
  onClearInitialStartPoint?: () => void;
  initialEndPoint?: { name: string; lat: number; lng: number } | null;
  initialWaypoints?: Array<{ name: string; lat: number; lng: number }> | null;
  lockStartPoint?: boolean;
  lockEndPoint?: boolean;
  isReturnLeg?: boolean;
}

interface OSRMRouteResponse {
  routes: Array<{
    distance: number;
    duration: number;
    geometry: {
      coordinates: Array<[number, number]>;
    };
  }>;
  waypoints: Array<{
    location: [number, number];
    name: string;
  }>;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

interface RoutePoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: 'start' | 'end' | 'waypoint';
}

type PickerMode = 'start' | 'end' | 'waypoint' | null;

const RoutePicker: React.FC<RoutePickerProps> = ({ 
  onNavigate, 
  onSelectLeg, 
  initialStartPoint, 
  onClearInitialStartPoint,
  initialEndPoint,
  initialWaypoints,
  lockStartPoint: _lockStartPoint = false,
  lockEndPoint: _lockEndPoint = false,
  isReturnLeg = false
}) => {
  const hasValidCoords = (p?: { lat: number; lng: number } | null) => {
    return p && (Math.abs(p.lat) > 0.0001 || Math.abs(p.lng) > 0.0001);
  };

  const lockStartPoint = (_lockStartPoint || isReturnLeg) && !!initialStartPoint?.name && hasValidCoords(initialStartPoint);
  const lockEndPoint = (_lockEndPoint || isReturnLeg) && !!initialEndPoint?.name && hasValidCoords(initialEndPoint);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [pickerIndex, setPickerIndex] = useState<number>(-1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    const map = L.map(mapRef.current, { zoomControl: false }).setView([12.8797, 121.774], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    // Delay bounds fitting to ensure map container is fully rendered
    setTimeout(() => {
      map.invalidateSize();
      const philippinesBounds = L.latLngBounds([4.5, 116], [21, 127]);
      if (philippinesBounds.isValid()) {
        map.fitBounds(philippinesBounds, { padding: [50, 50] });
      }
    }, 100);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle initial start and end points from previous leg (for sequential legs and return legs)
  const hasSetInitialPoints = useRef(false);
  
  // Reset ref when component mounts
  useEffect(() => {
    hasSetInitialPoints.current = false;
  }, []);
  useEffect(() => {
    if (hasSetInitialPoints.current) return;
    if (!mapInstanceRef.current) return;
    
    const hasStart = points.some(p => p.type === 'start');
    const hasEnd = points.some(p => p.type === 'end');
    const hasWaypoints = points.some(p => p.type === 'waypoint');
    
    // Only proceed if we have initial points to set and they're not already set
    const shouldSetStart = initialStartPoint?.name && !hasStart;
    const shouldSetEnd = initialEndPoint?.name && !hasEnd;
    const shouldSetWaypoints = initialWaypoints?.length && !hasWaypoints;
    
    if (!shouldSetStart && !shouldSetEnd && !shouldSetWaypoints) return;
    
    hasSetInitialPoints.current = true;
    
    const newPoints: RoutePoint[] = [...points];
    
    if (shouldSetStart) {
      newPoints.push({
        id: Date.now().toString(),
        lat: initialStartPoint.lat,
        lng: initialStartPoint.lng,
        name: initialStartPoint.name,
        type: 'start'
      });
    }

    if (shouldSetWaypoints && initialWaypoints) {
      initialWaypoints.forEach((wp, index) => {
        newPoints.push({
          id: (Date.now() + index + 2).toString(),
          lat: wp.lat,
          lng: wp.lng,
          name: wp.name,
          type: 'waypoint'
        });
      });
    }
    
    if (shouldSetEnd) {
      newPoints.push({
        id: (Date.now() + 1).toString(),
        lat: initialEndPoint.lat,
        lng: initialEndPoint.lng,
        name: initialEndPoint.name,
        type: 'end'
      });
    }
    
    setPoints(newPoints);
    
    // Delay to ensure map is fully initialized
    setTimeout(() => {
      updateMarkersAndRoute(newPoints);
      if (initialStartPoint) {
        mapInstanceRef.current?.panTo([initialStartPoint.lat, initialStartPoint.lng]);
      }
      // Keep initial points in parent state to maintain locked status
      // onClearInitialStartPoint?.(); 
    }, 100);
  }, [initialStartPoint?.name, initialStartPoint?.lat, initialStartPoint?.lng, initialEndPoint?.name, initialEndPoint?.lat, initialEndPoint?.lng, initialWaypoints]);

  const handleMapClickRef = useRef(async (lat: number, lng: number) => {
    // This will be replaced after initialization
  });

  // Handle map clicks - separate effect that updates the click handler
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    const clickHandler = (e: any) => {
      if (pickerMode) {
        handleMapClickRef.current(e.latlng.lat, e.latlng.lng);
      }
    };
    
    map.on('click', clickHandler);
    
    return () => {
      map.off('click', clickHandler);
    };
  }, [pickerMode]);

  const handleMapClick = async (lat: number, lng: number) => {
    if (!pickerMode) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&countrycodes=ph`);
      const data = await response.json();
      
      // Only allow locations within Philippines
      if (data.address?.country_code !== 'ph') {
        return;
      }
      
      const name = data.display_name?.split(',')[0] || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
      if (pickerMode === 'start') {
        addOrUpdatePoint({ lat, lng, name, type: 'start', index: 0 });
      } else if (pickerMode === 'end') {
        addOrUpdatePoint({ lat, lng, name, type: 'end', index: points.length });
      } else if (pickerMode === 'waypoint' && pickerIndex >= 0) {
        addOrUpdatePoint({ lat, lng, name, type: 'waypoint', index: pickerIndex });
      }
      setPickerMode(null);
      setPickerIndex(-1);
    } catch {
      const name = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      if (pickerMode === 'start') {
        addOrUpdatePoint({ lat, lng, name, type: 'start', index: 0 });
      } else if (pickerMode === 'end') {
        addOrUpdatePoint({ lat, lng, name, type: 'end', index: points.length });
      } else if (pickerMode === 'waypoint' && pickerIndex >= 0) {
        addOrUpdatePoint({ lat, lng, name, type: 'waypoint', index: pickerIndex });
      }
      setPickerMode(null);
      setPickerIndex(-1);
    }
  };

  // Assign the handler to ref so the map click effect can access it
  handleMapClickRef.current = handleMapClick;

  const addOrUpdatePoint = ({ lat, lng, name, type, index }: { 
    lat: number; lng: number; name: string; type: RoutePoint['type']; index: number 
  }) => {
    const newPoint: RoutePoint = {
      id: Date.now().toString(),
      lat,
      lng,
      name,
      type
    };

    let newPoints: RoutePoint[];
    
    if (type === 'start') {
      newPoints = [newPoint, ...points.filter(p => p.type !== 'start')];
    } else if (type === 'end') {
      newPoints = [...points.filter(p => p.type !== 'end'), newPoint];
    } else {
      // Insert waypoint at specific index
      const startPoint = points.find(p => p.type === 'start');
      const endPoint = points.find(p => p.type === 'end');
      const waypoints = points.filter(p => p.type === 'waypoint');
      
      const insertIndex = Math.min(index, waypoints.length);
      waypoints.splice(insertIndex, 0, newPoint);
      
      newPoints = [
        ...(startPoint ? [startPoint] : []),
        ...waypoints,
        ...(endPoint ? [endPoint] : [])
      ];
    }

    setPoints(newPoints);
    updateMarkersAndRoute(newPoints);
    
    // Pan map to the new point
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([lat, lng]);
    }
  };

  const updatePoint = (id: string, updates: Partial<RoutePoint>) => {
    setPoints(currentPoints => {
      const newPoints = currentPoints.map(p => p.id === id ? { ...p, ...updates } : p);
      // Update markers and route after state is set
      setTimeout(() => updateMarkersAndRoute(newPoints), 0);
      return newPoints;
    });
  };

  const removePoint = (id: string) => {
    const newPoints = points.filter(p => p.id !== id);
    setPoints(newPoints);
    
    const marker = markersRef.current.get(id);
    if (marker) {
      marker.remove();
      markersRef.current.delete(id);
    }
    
    updateMarkersAndRoute(newPoints);
  };

  const movePoint = (id: string, direction: 'up' | 'down') => {
    const index = points.findIndex(p => p.id === id);
    if (index < 0) return;
    
    // Can't move start point
    if (index === 0) return;
    // Can't move end point
    if (index === points.length - 1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Can't move past start or end
    if (newIndex < 1 || newIndex >= points.length - 1) return;
    
    const newPoints = [...points];
    [newPoints[index], newPoints[newIndex]] = [newPoints[newIndex], newPoints[index]];
    
    setPoints(newPoints);
    updateMarkersAndRoute(newPoints);
  };

  const getMarkerIcon = (type: RoutePoint['type'], index: number, total: number) => {
    const L = (window as any).L;
    
    if (type === 'start') {
      return L.divIcon({
        className: '',
        html: `<svg width="36" height="44" viewBox="0 0 36 44" style="cursor: grab; overflow: visible;">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.4"/>
            </filter>
          </defs>
          <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8.06 27.94 0 18 0z" fill="#22c55e" stroke="white" stroke-width="2" filter="url(#shadow)"/>
          <text x="18" y="24" text-anchor="middle" fill="white" font-weight="bold" font-size="14" font-family="system-ui, sans-serif">A</text>
        </svg>`,
        iconSize: [36, 44],
        iconAnchor: [18, 40]
      });
    }
    
    if (type === 'end') {
      return L.divIcon({
        className: '',
        html: `<svg width="36" height="44" viewBox="0 0 36 44" style="cursor: grab; overflow: visible;">
          <defs>
            <filter id="shadow2" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.4"/>
            </filter>
          </defs>
          <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8.06 27.94 0 18 0z" fill="#ef4444" stroke="white" stroke-width="2" filter="url(#shadow2)"/>
          <text x="18" y="24" text-anchor="middle" fill="white" font-weight="bold" font-size="14" font-family="system-ui, sans-serif">B</text>
        </svg>`,
        iconSize: [36, 44],
        iconAnchor: [18, 40]
      });
    }
    
    // Waypoint with number
    return L.divIcon({
      className: '',
      html: `<svg width="32" height="40" viewBox="0 0 32 40" style="cursor: grab; overflow: visible;">
        <defs>
          <filter id="shadow${index}" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.4"/>
          </filter>
        </defs>
        <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24c0-8.84-7.16-16-16-16z" fill="#4099ff" stroke="white" stroke-width="2" filter="url(#shadow${index})"/>
        <text x="16" y="21" text-anchor="middle" fill="white" font-weight="bold" font-size="12" font-family="system-ui, sans-serif">${index}</text>
      </svg>`,
      iconSize: [32, 40],
      iconAnchor: [16, 36]
    });
  };

  const updateMarkersAndRoute = (currentPoints: RoutePoint[]) => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current) return;

    // Remove old markers that are no longer in points
    markersRef.current.forEach((marker, id) => {
      if (!currentPoints.find(p => p.id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Add or update markers
    currentPoints.forEach((point, index) => {
      const existingMarker = markersRef.current.get(point.id);
      
      if (existingMarker) {
        // Only update position if marker hasn't been dragged (positions match)
        const currentLatLng = existingMarker.getLatLng();
        if (Math.abs(currentLatLng.lat - point.lat) > 0.0001 || Math.abs(currentLatLng.lng - point.lng) > 0.0001) {
          existingMarker.setLatLng([point.lat, point.lng]);
        }
        existingMarker.setIcon(getMarkerIcon(point.type, index, currentPoints.length));
      } else {
        const isLocked = (point.type === 'start' && lockStartPoint) || (point.type === 'end' && lockEndPoint);
        const marker = L.marker([point.lat, point.lng], { 
          icon: getMarkerIcon(point.type, index, currentPoints.length),
          draggable: !isLocked 
        }).addTo(mapInstanceRef.current);
        
        // Add popup with location name
        marker.bindPopup(`<b>${point.type === 'start' ? 'Start' : point.type === 'end' ? 'End' : 'Stop ' + index}</b><br>${point.name}`);
        
        marker.on('dragend', (e: any) => {
          const newLatLng = e.target.getLatLng();
          // Use a ref to get fresh point data
          const pointId = point.id;
          setPoints(currentPoints => {
            const updatedPoints = currentPoints.map(p => 
              p.id === pointId ? { ...p, lat: newLatLng.lat, lng: newLatLng.lng } : p
            );
            // Recalculate route with new positions
            setTimeout(() => calculateRoute(updatedPoints), 0);
            return updatedPoints;
          });
        });

        // Bring marker to front to ensure visibility
        marker.setZIndexOffset(1000 - index);
        
        markersRef.current.set(point.id, marker);
      }
    });

    // Calculate route if we have at least 2 points
    if (currentPoints.length >= 2) {
      calculateRoute(currentPoints);
    } else {
      if (routeLineRef.current) {
        routeLineRef.current.remove();
        routeLineRef.current = null;
      }
      setRouteInfo(null);
    }
  };

  const calculateRoute = async (currentPoints: RoutePoint[]) => {
    if (currentPoints.length < 2) return;

    setIsLoading(true);

    try {
      const coordinates = currentPoints.map(p => `${p.lng},${p.lat}`).join(';');
      const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      const data: OSRMRouteResponse = await response.json();

      if (data.routes.length > 0) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);

        if (routeLineRef.current) {
          routeLineRef.current.remove();
        }

        const L = (window as any).L;
        routeLineRef.current = L.polyline(coords, {
          color: '#4099ff',
          weight: 5,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(mapInstanceRef.current);

        mapInstanceRef.current.fitBounds(routeLineRef.current.getBounds(), { padding: [100, 100] });

        setRouteInfo({
          distance: route.distance / 1000,
          duration: route.duration / 60
        });
      }
    } catch (error) {
      console.error('Routing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ph`;
      const response = await fetch(url);
      const results: NominatimResult[] = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const selectSearchResult = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const name = result.display_name.split(',')[0];

    if (pickerMode === 'start') {
      addOrUpdatePoint({ lat, lng, name, type: 'start', index: 0 });
    } else if (pickerMode === 'end') {
      addOrUpdatePoint({ lat, lng, name, type: 'end', index: points.length });
    } else if (pickerMode === 'waypoint' && pickerIndex >= 0) {
      addOrUpdatePoint({ lat, lng, name, type: 'waypoint', index: pickerIndex });
    }

    setSearchQuery('');
    setSearchResults([]);
    setPickerMode(null);
    setPickerIndex(-1);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15);
    }
  };

  const addStop = () => {
    if (!points.find(p => p.type === 'start')) {
      setPickerMode('start');
      return;
    }
    if (!points.find(p => p.type === 'end')) {
      setPickerMode('end');
      return;
    }
    
    // Add waypoint between last waypoint and end
    const waypointCount = points.filter(p => p.type === 'waypoint').length;
    setPickerMode('waypoint');
    setPickerIndex(waypointCount + 1);
  };

  const clearRoute = () => {
    setPoints([]);
    setRouteInfo(null);
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }
    setPickerMode(null);
    setPickerIndex(-1);
  };

  const handleConfirm = () => {
    const start = points.find(p => p.type === 'start');
    const end = points.find(p => p.type === 'end');

    if (!start || !end || !routeInfo) return;

    const leg: RouteLeg = {
      fromLocation: {
        name: start.name,
        lat: start.lat,
        lng: start.lng
      },
      toLocation: {
        name: end.name,
        lat: end.lat,
        lng: end.lng
      },
      waypoints: waypoints.map(wp => ({
        name: wp.name,
        lat: wp.lat,
        lng: wp.lng
      })),
      distanceKm: Math.round(routeInfo.distance * 10) / 10,
      durationMin: Math.round(routeInfo.duration),
      startDate,
      endDate,
      isReturn: isReturnLeg
    };

    onSelectLeg(leg);
    onNavigate(Page.CREATE_TRAVEL_ORDER);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours} hr ${mins} min`;
    }
    return `${mins} min`;
  };

  const getPickerTitle = () => {
    if (pickerMode === 'start') return lockStartPoint ? 'Starting point (locked)' : 'Set starting point';
    if (pickerMode === 'end') return lockEndPoint ? 'Destination (locked)' : 'Set destination';
    if (pickerMode === 'waypoint') return `Add stop ${pickerIndex}`;
    return isReturnLeg ? 'Plan return route' : 'Plan your route';
  };

  const startPoint = points.find(p => p.type === 'start');
  const endPoint = points.find(p => p.type === 'end');
  const waypoints = points.filter(p => p.type === 'waypoint');

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-900">
      {/* Sidebar */}
      <div className="w-full max-w-md bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate(Page.CREATE_TRAVEL_ORDER)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <h1 className="text-lg font-semibold text-white">{getPickerTitle()}</h1>
          </div>
        </div>

        {/* Points List */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {/* Start Point */}
          <div className="relative">
            {pickerMode === 'start' && !lockStartPoint ? (
              // Edit mode - show input
              <div className="w-full p-4 rounded-xl border-2 border-dash-blue bg-dash-blue/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    A
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchLocation(e.target.value);
                      }}
                      placeholder="Search starting point..."
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-dash-blue text-sm"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={() => {
                      setPickerMode(null);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="p-1 hover:bg-slate-600 rounded"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                {/* Search results */}
                {searchResults.length > 0 && (
                  <div className="bg-slate-700 border border-slate-600 rounded-lg max-h-48 overflow-y-auto">
                    {searchResults.map((result) => (
                      <button
                        key={result.place_id}
                        onClick={() => selectSearchResult(result)}
                        className="w-full px-3 py-2 text-left hover:bg-slate-600 border-b border-slate-600 last:border-0"
                      >
                        <p className="text-sm text-white truncate">{result.display_name}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Display mode - show card
              <div className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 bg-slate-700/50 transition-all ${lockStartPoint ? 'border-slate-600' : 'border-slate-600 hover:border-slate-500'}`}>
                {lockStartPoint ? (
                  // Locked - just display, no click
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      A
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{startPoint?.name || initialStartPoint?.name}</p>
                      <p className="text-xs text-slate-400">
                        {startPoint ? startPoint.lat.toFixed(4) : (initialStartPoint?.lat || 0).toFixed(4)},{' '}
                        {startPoint ? startPoint.lng.toFixed(4) : (initialStartPoint?.lng || 0).toFixed(4)}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Not locked - clickable
                  <button
                    onClick={() => setPickerMode('start')}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      A
                    </div>
                    <div className="flex-1">
                      {startPoint ? (
                        <>
                          <p className="text-sm font-medium text-white">{startPoint.name}</p>
                          <p className="text-xs text-slate-400">{startPoint.lat.toFixed(4)}, {startPoint.lng.toFixed(4)}</p>
                        </>
                      ) : (
                        <p className="text-sm text-slate-400">Choose starting point</p>
                      )}
                    </div>
                  </button>
                )}
                {startPoint && !lockStartPoint && (
                  <button
                    onClick={() => removePoint(startPoint.id)}
                    className="p-1 hover:bg-slate-600 rounded"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                )}
                {lockStartPoint && <div className="w-6" />}
              </div>
            )}
          </div>

          {/* Waypoints */}
          {waypoints.map((waypoint, index) => (
            <div key={waypoint.id} className="relative pl-4">
              
              {pickerMode === 'waypoint' && pickerIndex === index + 1 ? (
                // Edit mode - show input
                <div className="w-full p-3 rounded-xl border-2 border-dash-blue bg-dash-blue/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-dash-blue rounded-full flex items-center justify-center text-white font-bold shrink-0 text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          searchLocation(e.target.value);
                        }}
                        placeholder={`Search stop ${index + 1}...`}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-dash-blue text-sm"
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={() => {
                        setPickerMode(null);
                        setPickerIndex(-1);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="p-1 hover:bg-slate-600 rounded"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  {/* Search results */}
                  {searchResults.length > 0 && (
                    <div className="bg-slate-700 border border-slate-600 rounded-lg max-h-48 overflow-y-auto">
                      {searchResults.map((result) => (
                        <button
                          key={result.place_id}
                          onClick={() => selectSearchResult(result)}
                          className="w-full px-3 py-2 text-left hover:bg-slate-600 border-b border-slate-600 last:border-0"
                        >
                          <p className="text-sm text-white truncate">{result.display_name}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Display mode - show card
                <div className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-slate-600 hover:border-slate-500 bg-slate-700/50 transition-all">
                  <button
                    onClick={() => {
                      setPickerMode('waypoint');
                      setPickerIndex(index + 1);
                    }}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <div className="w-8 h-8 bg-dash-blue rounded-full flex items-center justify-center text-white font-bold shrink-0 text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{waypoint.name}</p>
                      <p className="text-xs text-slate-400">{waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => movePoint(waypoint.id, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-slate-600 rounded disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3 text-slate-400" />
                    </button>
                    <button
                      onClick={() => movePoint(waypoint.id, 'down')}
                      disabled={index === waypoints.length - 1}
                      className="p-1 hover:bg-slate-600 rounded disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3 text-slate-400" />
                    </button>
                    <button
                      onClick={() => removePoint(waypoint.id)}
                      className="p-1 hover:bg-slate-600 rounded"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Stop Button / New Waypoint Input - Between Start and End */}
          {startPoint && (
            pickerMode === 'waypoint' && pickerIndex > waypoints.length ? (
              // New stop input mode
              <div className="relative pl-4">
                <div className="w-full p-3 rounded-xl border-2 border-dash-blue bg-dash-blue/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-dash-blue rounded-full flex items-center justify-center text-white font-bold shrink-0 text-sm">
                      {waypoints.length + 1}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          searchLocation(e.target.value);
                        }}
                        placeholder={`Search stop ${waypoints.length + 1}...`}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-dash-blue text-sm"
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={() => {
                        setPickerMode(null);
                        setPickerIndex(-1);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="p-1 hover:bg-slate-600 rounded"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  {/* Search results */}
                  {searchResults.length > 0 && (
                    <div className="bg-slate-700 border border-slate-600 rounded-lg max-h-48 overflow-y-auto">
                      {searchResults.map((result) => (
                        <button
                          key={result.place_id}
                          onClick={() => selectSearchResult(result)}
                          className="w-full px-3 py-2 text-left hover:bg-slate-600 border-b border-slate-600 last:border-0"
                        >
                          <p className="text-sm text-white truncate">{result.display_name}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Add stop button - show if we have start but no end, OR if we have both
              (!endPoint || (startPoint && endPoint)) && (
                <div className="relative pl-4">
                  <button
                    onClick={addStop}
                    className="w-full flex items-center gap-2 p-3 border-2 border-dashed border-slate-600 text-slate-400 rounded-xl hover:border-dash-blue hover:text-dash-blue transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add stop</span>
                  </button>
                </div>
              )
            )
          )}

          {/* End Point */}
          <div className="relative">
            {pickerMode === 'end' && !lockEndPoint ? (
              // Edit mode - show input
              <div className="w-full p-4 rounded-xl border-2 border-dash-blue bg-dash-blue/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    B
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchLocation(e.target.value);
                      }}
                      placeholder="Search destination..."
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-dash-blue text-sm"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={() => {
                      setPickerMode(null);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="p-1 hover:bg-slate-600 rounded"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                {/* Search results */}
                {searchResults.length > 0 && (
                  <div className="bg-slate-700 border border-slate-600 rounded-lg max-h-48 overflow-y-auto">
                    {searchResults.map((result) => (
                      <button
                        key={result.place_id}
                        onClick={() => selectSearchResult(result)}
                        className="w-full px-3 py-2 text-left hover:bg-slate-600 border-b border-slate-600 last:border-0"
                      >
                        <p className="text-sm text-white truncate">{result.display_name}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Display mode - show card
              <div className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 bg-slate-700/50 transition-all ${lockEndPoint ? 'border-slate-600' : 'border-slate-600 hover:border-slate-500'}`}>
                {lockEndPoint ? (
                  // Locked - just display, no click
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      B
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{endPoint?.name || initialEndPoint?.name}</p>
                      <p className="text-xs text-slate-400">
                        {endPoint ? endPoint.lat.toFixed(4) : (initialEndPoint?.lat || 0).toFixed(4)},{' '}
                        {endPoint ? endPoint.lng.toFixed(4) : (initialEndPoint?.lng || 0).toFixed(4)}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Not locked - clickable
                  <button
                    onClick={() => setPickerMode('end')}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      B
                    </div>
                    <div className="flex-1">
                      {endPoint ? (
                        <>
                          <p className="text-sm font-medium text-white">{endPoint.name}</p>
                          <p className="text-xs text-slate-400">{endPoint.lat.toFixed(4)}, {endPoint.lng.toFixed(4)}</p>
                        </>
                      ) : (
                        <p className="text-sm text-slate-400">Choose destination</p>
                      )}
                    </div>
                  </button>
                )}
                {endPoint && !lockEndPoint && (
                  <button
                    onClick={() => removePoint(endPoint.id)}
                    className="p-1 hover:bg-slate-600 rounded"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                )}
                {lockEndPoint && <div className="w-6" />}
              </div>
            )}
          </div>

          {/* Click on map hint */}
          {pickerMode && (
            <div className="flex items-center gap-2 p-3 bg-dash-blue/20 border border-dash-blue/30 rounded-lg">
              <MapPin className="w-4 h-4 text-dash-blue" />
              <p className="text-sm text-dash-blue">
                {pickerMode === 'waypoint' 
                  ? 'Click on the map to add stop location' 
                  : 'Click on the map to set location'}
              </p>
            </div>
          )}

          {/* Dates */}
          {routeInfo && (
            <div className="pt-4 border-t border-slate-700 space-y-3">
              <p className="text-sm font-medium text-slate-300">Travel Dates</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-dash-blue"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-dash-blue"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 space-y-3">
          {routeInfo && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                {routeInfo.distance.toFixed(1)} km
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">
                {formatDuration(routeInfo.duration)}
              </span>
              {waypoints.length > 0 && (
                <>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400">
                    {waypoints.length + 1} segments
                  </span>
                </>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={clearRoute}
              disabled={points.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={handleConfirm}
              disabled={!routeInfo}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-dash-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Check className="w-4 h-4" />
              Add Leg
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0" />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-4 right-4 bg-slate-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-dash-blue border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-white">Calculating route...</span>
          </div>
        )}

        {/* Drag hint */}
        {points.length > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2 pointer-events-none">
            <div className="w-2 h-2 bg-dash-blue rounded-full animate-pulse" />
            <span className="text-sm text-white">Drag markers to adjust positions</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutePicker;
