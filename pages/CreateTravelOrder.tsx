import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, FileText, CheckCircle, Upload, X, Plus, Car, Wallet, Route, ArrowRight, Lock, Unlock } from 'lucide-react';
import { Page, RouteLeg } from '../types';
import { travelSources, employees, currentUser, TravelOrder } from '../data/database';
import LocationSearchInput from '../components/LocationSearchInput';

interface TravelLeg {
  id: string;
  fromLocationId: string;
  toLocationId: string;
  startDate: string;
  endDate: string;
  distanceKm: number;
  isReturn: boolean;
  fromLocationName?: string;
  toLocationName?: string;
  fromLat?: number;
  fromLng?: number;
  toLat?: number;
  toLng?: number;
  isFromLocked?: boolean;
  waypoints?: Array<{
    name: string;
    lat: number;
    lng: number;
  }>;
}

interface CreateTravelOrderProps {
  onNavigate: (page: Page) => void;
  initialRouteLeg?: RouteLeg | null;
  onClearRouteLeg?: () => void;
  onOpenRoutePicker?: (
    previousLeg: RouteLeg | null, 
    isReturn?: boolean, 
    returnEndPoint?: { name: string; lat: number; lng: number } | null,
    editingLeg?: { 
      leg: TravelLeg, 
      startPoint: { name: string; lat: number; lng: number },
      endPoint: { name: string; lat: number; lng: number },
      waypoints: Array<{ name: string; lat: number; lng: number }>
    } | null
  ) => void;
  legs: TravelLeg[];
  setLegs: React.Dispatch<React.SetStateAction<TravelLeg[]>>;
  editingLegId?: string | null;
  onClearEditingState?: () => void;
  travelers: Traveler[];
  setTravelers: React.Dispatch<React.SetStateAction<Traveler[]>>;
  fundSource: string;
  setFundSource: React.Dispatch<React.SetStateAction<string>>;
  vehicle: string;
  setVehicle: React.Dispatch<React.SetStateAction<string>>;
  expenses: string[];
  setExpenses: React.Dispatch<React.SetStateAction<string[]>>;
  approvalSteps: string;
  setApprovalSteps: React.Dispatch<React.SetStateAction<string>>;
  purpose: string;
  setPurpose: React.Dispatch<React.SetStateAction<string>>;
  remarks: string;
  setRemarks: React.Dispatch<React.SetStateAction<string>>;
  uploadedFiles: File[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onResetData?: () => void;
}

interface Traveler {
  id: string;
  employeeId: string;
}

const CreateTravelOrder: React.FC<CreateTravelOrderProps> = ({ 
  onNavigate, 
  initialRouteLeg, 
  onClearRouteLeg, 
  onOpenRoutePicker, 
  legs, 
  setLegs,
  editingLegId: propEditingLegId,
  onClearEditingState,
  travelers,
  setTravelers,
  fundSource,
  setFundSource,
  vehicle,
  setVehicle,
  expenses,
  setExpenses,
  approvalSteps,
  setApprovalSteps,
  purpose,
  setPurpose,
  remarks,
  setRemarks,
  uploadedFiles,
  setUploadedFiles,
  onResetData
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dateErrors, setDateErrors] = useState<Record<string, string>>({});
  const hasAddedLeg = useRef(false);

  const [localEditingLegId, setLocalEditingLegId] = useState<string | null>(null);

  // Sync prop editing leg id to local state if needed, or use the prop directly if we were to lift all state up
  // For now, let's respect the prop if passed, otherwise fall back to internal logic?
  // Actually, the issue is that `editingLegId` state was reset when component re-mounted or logic was flawed.
  // We need to use the `editingLegId` passed from App.tsx because RoutePicker navigation unmounts this component.

  // Handle initial route leg from RoutePicker
  useEffect(() => {
    if (initialRouteLeg && !hasAddedLeg.current) {
      hasAddedLeg.current = true;
      
      const targetId = propEditingLegId || localEditingLegId;

      if (targetId) {
        // Update existing leg
        setLegs(prev => prev.map(leg => {
          if (leg.id === targetId) {
            return {
              ...leg,
              startDate: initialRouteLeg.startDate || leg.startDate,
              endDate: initialRouteLeg.endDate || leg.endDate,
              distanceKm: Math.round(initialRouteLeg.distanceKm),
              fromLocationName: initialRouteLeg.fromLocation.name,
              toLocationName: initialRouteLeg.toLocation.name,
              fromLat: initialRouteLeg.fromLocation.lat,
              fromLng: initialRouteLeg.fromLocation.lng,
              toLat: initialRouteLeg.toLocation.lat,
              toLng: initialRouteLeg.toLocation.lng,
              waypoints: initialRouteLeg.waypoints
            };
          }
          return leg;
        }));
        setLocalEditingLegId(null);
        onClearEditingState?.();
      } else {
        // Add new leg
        const newLeg: TravelLeg = {
          id: Date.now().toString(),
          fromLocationId: '',
          toLocationId: '',
          startDate: initialRouteLeg.startDate || '',
          endDate: initialRouteLeg.endDate || '',
          distanceKm: Math.round(initialRouteLeg.distanceKm),
          isReturn: initialRouteLeg.isReturn || false,
          fromLocationName: initialRouteLeg.fromLocation.name,
          toLocationName: initialRouteLeg.toLocation.name,
          fromLat: initialRouteLeg.fromLocation.lat,
          fromLng: initialRouteLeg.fromLocation.lng,
          toLat: initialRouteLeg.toLocation.lat,
          toLng: initialRouteLeg.toLocation.lng,
          isFromLocked: legs.length > 0,
          waypoints: initialRouteLeg.waypoints
        };
        setLegs(prev => [...prev, newLeg]);
      }
      onClearRouteLeg?.();
    }
    if (!initialRouteLeg) {
      hasAddedLeg.current = false;
    }
  }, [initialRouteLeg, onClearRouteLeg, setLegs, propEditingLegId, localEditingLegId, onClearEditingState]);
  
  const handleEditLeg = (leg: TravelLeg) => {
    setLocalEditingLegId(leg.id);
    
    // Prepare data for RoutePicker
    const startPoint = { 
      name: leg.fromLocationName || getLocationName(leg.fromLocationId),
      lat: leg.fromLat || 0,
      lng: leg.fromLng || 0
    };
    
    const endPoint = {
      name: leg.toLocationName || getLocationName(leg.toLocationId),
      lat: leg.toLat || 0,
      lng: leg.toLng || 0
    };
    
    const waypoints = leg.waypoints || [];
    
    // Construct RouteLeg object for compatibility
    const routeLeg: RouteLeg = {
      fromLocation: startPoint,
      toLocation: endPoint,
      distanceKm: leg.distanceKm,
      durationMin: 0,
      startDate: leg.startDate,
      endDate: leg.endDate,
      isReturn: leg.isReturn,
      waypoints: waypoints
    };

    onOpenRoutePicker?.(
      null, 
      leg.isReturn, 
      null, 
      { 
        leg, 
        startPoint, 
        endPoint,
        waypoints
      }
    );
  };

  const calculateHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return Math.round(d * 10) / 10;
  };

  const calculateDistance = (fromId: string, toId: string, fromLat?: number, fromLng?: number, toLat?: number, toLng?: number): number => {
    const distanceMap: Record<string, Record<string, number>> = {
      'loc-001': { 'loc-002': 270, 'loc-003': 400, 'loc-004': 85, 'loc-005': 60, 'loc-006': 15, 'loc-007': 570, 'loc-008': 975, 'loc-009': 570, 'loc-010': 250, 'loc-011': 465, 'loc-012': 850 },
      'loc-002': { 'loc-001': 270, 'loc-007': 840, 'loc-008': 1220 },
      'loc-003': { 'loc-001': 400, 'loc-007': 600, 'loc-008': 980 },
      'loc-004': { 'loc-001': 85, 'loc-007': 650, 'loc-008': 1040 },
      'loc-005': { 'loc-001': 60, 'loc-007': 490, 'loc-008': 880 },
      'loc-006': { 'loc-001': 15 },
      'loc-007': { 'loc-001': 570, 'loc-008': 405, 'loc-009': 0, 'loc-011': 180 },
      'loc-008': { 'loc-001': 975, 'loc-007': 405 },
      'loc-009': { 'loc-007': 0 },
      'loc-010': { 'loc-001': 250 },
      'loc-011': { 'loc-001': 465, 'loc-007': 180 },
      'loc-012': { 'loc-001': 850 }
    };
    
    if (distanceMap[fromId]?.[toId]) {
      return distanceMap[fromId][toId];
    }
    
    // Fallback coords for known locations if they are not passed explicitly
    const coordMap: Record<string, { lat: number, lng: number }> = {
      'loc-001': { lat: 14.65, lng: 121.05 }, // QC
      'loc-002': { lat: 16.61, lng: 120.32 }, // La Union
      'loc-003': { lat: 17.61, lng: 121.72 }, // Tuguegarao
      'loc-004': { lat: 15.03, lng: 120.69 }, // Pampanga
      'loc-005': { lat: 14.21, lng: 121.17 }, // Laguna
      'loc-006': { lat: 14.59, lng: 120.98 }, // Manila
      'loc-007': { lat: 10.31, lng: 123.89 }, // Cebu
      'loc-008': { lat: 7.19, lng: 125.45 },  // Davao
      'loc-009': { lat: 10.31, lng: 123.89 }, // Cebu
      'loc-010': { lat: 16.40, lng: 120.59 }, // Baguio
      'loc-011': { lat: 10.72, lng: 122.56 }, // Iloilo
      'loc-012': { lat: 6.92, lng: 122.07 }   // Zamboanga
    };

    const start = (fromLat && fromLng) ? { lat: fromLat, lng: fromLng } : coordMap[fromId];
    const end = (toLat && toLng) ? { lat: toLat, lng: toLng } : coordMap[toId];

    if (start && end) {
      return calculateHaversineDistance(start.lat, start.lng, end.lat, end.lng);
    }

    return 0;
  };

  const getLocationName = (id: string) => travelSources.find(s => s.id === id)?.name || '';

  const addLeg = (isReturn: boolean = false) => {
    const prevLeg = legs[legs.length - 1];
    const firstLeg = legs[0];
    
    if (isReturn && firstLeg) {
      // Return leg: from = previous leg's to, to = first leg's from
      setLegs([...legs, {
        id: Date.now().toString(),
        fromLocationId: '',
        toLocationId: '',
        startDate: prevLeg?.endDate || new Date().toISOString().split('T')[0],
        endDate: '',
        distanceKm: 0,
        isReturn: true,
        fromLocationName: prevLeg?.toLocationName,
        fromLat: prevLeg?.toLat,
        fromLng: prevLeg?.toLng,
        toLocationName: firstLeg.fromLocationName,
        toLat: firstLeg.fromLat,
        toLng: firstLeg.fromLng,
        isFromLocked: true
      }]);
    } else {
      const fromId = prevLeg ? prevLeg.toLocationId : '';
      const toId = '';
      const today = new Date();
      const startDate = prevLeg ? prevLeg.endDate : today.toISOString().split('T')[0];
      const fromLocationName = prevLeg ? (prevLeg.toLocationName || getLocationName(prevLeg.toLocationId)) : '';
      
      setLegs([...legs, {
        id: Date.now().toString(),
        fromLocationId: fromId,
        toLocationId: toId,
        startDate,
        endDate: '',
        distanceKm: 0,
        isReturn,
        fromLocationName,
        toLocationName: '',
        isFromLocked: !!prevLeg
      }]);
    }
  };

  const updateLeg = (id: string, updates: Partial<TravelLeg>) => {
    setLegs(legs.map(leg => {
      if (leg.id !== id) return leg;
      const updated = { ...leg, ...updates };
      // Check if any location data changed
      const locationChanged = 
        updates.fromLocationId !== undefined || 
        updates.toLocationId !== undefined ||
        updates.fromLat !== undefined ||
        updates.fromLng !== undefined ||
        updates.toLat !== undefined ||
        updates.toLng !== undefined;

      if (locationChanged) {
        // Only recalc if we have enough info to determine start and end
        // Note: calculateDistance handles missing coords by looking up ID in coordMap
        if ((updated.fromLocationId || (updated.fromLat && updated.fromLng)) && 
            (updated.toLocationId || (updated.toLat && updated.toLng))) {
              
          const dist = calculateDistance(
            updated.fromLocationId, 
            updated.toLocationId,
            updated.fromLat,
            updated.fromLng,
            updated.toLat,
            updated.toLng
          );
          
          if (dist > 0) {
            updated.distanceKm = dist;
          }
        }
      }
      return updated;
    }));
  };

  const removeLeg = (id: string) => {
    setLegs(legs.filter(l => l.id !== id));
  };

  const validateDates = () => {
    const errors: Record<string, string> = {};
    legs.forEach((leg, index) => {
      if (leg.startDate && leg.endDate && leg.endDate < leg.startDate) {
        errors[`${leg.id}_end`] = 'End date cannot be before start date';
      }
      if (index > 0) {
        const prevLeg = legs[index - 1];
        if (prevLeg.endDate && leg.startDate && leg.startDate < prevLeg.endDate) {
          errors[`${leg.id}_start`] = `Cannot start before ${getLocationName(prevLeg.toLocationId)} ends`;
        }
      }
      if (index === 0 && leg.startDate) {
        const today = new Date().toISOString().split('T')[0];
        if (leg.startDate < today) {
          errors[`${leg.id}_start`] = 'Start date cannot be in the past';
        }
      }
    });
    setDateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    validateDates();
  }, [legs]);

  const totalDistance = legs.reduce((sum, leg) => sum + leg.distanceKm, 0);
  const overallStartDate = legs[0]?.startDate || '';
  const overallEndDate = legs[legs.length - 1]?.endDate || '';

  const addTraveler = () => {
    setTravelers([...travelers, { id: Date.now().toString(), employeeId: '' }]);
  };

  const removeTraveler = (id: string) => {
    if (travelers.length === 1) return;
    setTravelers(travelers.filter(t => t.id !== id));
  };

  const updateTraveler = (id: string, employeeId: string) => {
    setTravelers(travelers.map(t => t.id === id ? { ...t, employeeId } : t));
  };

  const handleExpenseChange = (expense: string) => {
    setExpenses(expenses.includes(expense)
      ? expenses.filter(e => e !== expense)
      : [...expenses, expense]
    );
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setUploadedFiles([...uploadedFiles, ...Array.from(e.dataTransfer.files)]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (createAnother: boolean = false) => {
    if (!validateDates()) {
      const firstError = document.querySelector('.border-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    if (createAnother) {
      onResetData?.();
      setDateErrors({});
    } else {
      onNavigate(Page.TRAVEL_ORDERS);
    }
  };

  const expenseOptions = [
    { value: 'actual', label: 'Actual Expenses' },
    { value: 'perdiem', label: 'Per Diem' },
    { value: 'official', label: 'Official Time' },
    { value: 'noclaim', label: 'No Claim' },
    { value: 'na', label: 'N/A' }
  ];

  const getLegColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500', 'bg-rose-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="max-w-5xl mx-auto pb-8">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => onNavigate(Page.TRAVEL_ORDERS)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Create Travel Order</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sequential Travel Legs</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Travel Details - Sequential Legs */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Route className="w-5 h-5 text-dash-blue" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Travel Details</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Multi-leg journey planner</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Travel Legs */}
            {legs.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span>Travel Legs</span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
                </div>
                
                <div className="space-y-3">
                  {legs.map((leg, index) => (
                    <div key={leg.id} className="relative">
                      {index > 0 && (
                        <div className="absolute -top-4 left-6 w-0.5 h-4 bg-slate-300 dark:bg-slate-600" />
                      )}
                      <div 
                        className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:border-dash-blue dark:hover:border-dash-blue transition-colors group"
                        onClick={() => handleEditLeg(leg)}
                      >
                        <div className={`w-8 h-8 ${getLegColor(index)} rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 text-sm" onClick={(e) => e.stopPropagation()}>
                            <span className="text-slate-500">From:</span>
                            <div className="flex items-center gap-1">
                              <LocationSearchInput
                                value={leg.fromLocationName || getLocationName(leg.fromLocationId)}
                                disabled={index > 0 && leg.isFromLocked !== false}
                                onChange={(val, id, lat, lng) => {
                                  updateLeg(leg.id, { 
                                    fromLocationName: val, 
                                    fromLocationId: id || '',
                                    fromLat: lat || 0,
                                    fromLng: lng || 0
                                  });
                                }}
                                placeholder="Origin"
                                className="min-w-[120px]"
                              />
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateLeg(leg.id, { isFromLocked: !leg.isFromLocked });
                                  }}
                                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                  title={leg.isFromLocked !== false ? "Unlock start location" : "Lock start location"}
                                >
                                  {leg.isFromLocked !== false ? (
                                    <Lock className="w-3 h-3" />
                                  ) : (
                                    <Unlock className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>
                            
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                            
                            <LocationSearchInput
                              value={leg.toLocationName || getLocationName(leg.toLocationId)}
                              onChange={(val, id, lat, lng) => {
                                updateLeg(leg.id, { 
                                  toLocationName: val, 
                                  toLocationId: id || '',
                                  toLat: lat || 0,
                                  toLng: lng || 0
                                });
                              }}
                              placeholder="Destination"
                              className="min-w-[120px]"
                            />
                          </div>
                          
                          {/* Waypoints display */}
                          {leg.waypoints && leg.waypoints.length > 0 && (
                            <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-600 ml-1.5 space-y-1">
                              {leg.waypoints.map((wp, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                  <span>Stop {i + 1}: {wp.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400" onClick={(e) => e.stopPropagation()}>
                              <Route className="w-4 h-4" />
                              <input
                                type="number"
                                value={leg.distanceKm}
                                onChange={(e) => updateLeg(leg.id, { distanceKm: parseFloat(e.target.value) || 0 })}
                                placeholder="0"
                                className="w-20 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-sm text-right"
                              />
                              <span>km</span>
                            </div>

                            <div className="flex items-start gap-2" onClick={(e) => e.stopPropagation()}>
                              <div className="flex flex-col">
                                <input
                                  type="date"
                                  value={leg.startDate}
                                  onChange={(e) => updateLeg(leg.id, { startDate: e.target.value })}
                                  min={index > 0 ? legs[index - 1]?.endDate : new Date().toISOString().split('T')[0]}
                                  className={`px-3 py-1.5 bg-white dark:bg-slate-800 border rounded text-sm ${
                                    dateErrors[`${leg.id}_start`] ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                                  }`}
                                />
                                {dateErrors[`${leg.id}_start`] && (
                                  <span className="text-xs text-red-500 mt-1">{dateErrors[`${leg.id}_start`]}</span>
                                )}
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-400 mt-2" />
                              <div className="flex flex-col">
                                <input
                                  type="date"
                                  value={leg.endDate}
                                  onChange={(e) => updateLeg(leg.id, { endDate: e.target.value })}
                                  min={leg.startDate}
                                  className={`px-3 py-1.5 bg-white dark:bg-slate-800 border rounded text-sm ${
                                    dateErrors[`${leg.id}_end`] ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                                  }`}
                                />
                                {dateErrors[`${leg.id}_end`] && (
                                  <span className="text-xs text-red-500 mt-1">{dateErrors[`${leg.id}_end`]}</span>
                                )}
                              </div>
                            </div>
                            {leg.isReturn && (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                                🏠 Return
                              </span>
                            )}
                            <span className="text-xs text-dash-blue opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to edit route
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLeg(leg.id);
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const prevLeg = legs.length > 0 ? legs[legs.length - 1] : null;
                  const prevRouteLeg = prevLeg ? {
                    fromLocation: { name: '', lat: 0, lng: 0 },
                    toLocation: {
                      name: prevLeg.toLocationName || getLocationName(prevLeg.toLocationId),
                      lat: prevLeg.toLat || 0,
                      lng: prevLeg.toLng || 0
                    },
                    distanceKm: 0,
                    durationMin: 0
                  } : null;
                  onOpenRoutePicker?.(prevRouteLeg);
                }}
                disabled={legs.some(l => l.isReturn)}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-dash-blue/50 dark:border-dash-blue/30 text-dash-blue rounded-lg hover:border-dash-blue hover:bg-dash-blue/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <MapPin className="w-4 h-4" />
                Add via Map
              </button>

              <button
                onClick={() => addLeg(false)}
                disabled={legs.some(l => l.isReturn)}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:border-dash-blue hover:text-dash-blue hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Manual Leg
              </button>
              {legs.length > 0 && !legs.some(l => l.isReturn) && (
                <>
                  <button
                    onClick={() => {
                      const prevLeg = legs[legs.length - 1];
                      const firstLeg = legs[0];
                      const prevRouteLeg = prevLeg ? {
                        fromLocation: { name: '', lat: 0, lng: 0 },
                        toLocation: {
                          name: prevLeg.toLocationName || getLocationName(prevLeg.toLocationId),
                          lat: prevLeg.toLat || 0,
                          lng: prevLeg.toLng || 0
                        },
                        distanceKm: 0,
                        durationMin: 0
                      } : null;
                      const returnEndPoint = firstLeg ? {
                        name: firstLeg.fromLocationName || getLocationName(firstLeg.fromLocationId),
                        lat: firstLeg.fromLat || 0,
                        lng: firstLeg.fromLng || 0
                      } : null;
                      onOpenRoutePicker?.(prevRouteLeg, true, returnEndPoint);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-sm font-medium"
                  >
                    <MapPin className="w-4 h-4" />
                    Add Return Map
                  </button>
                  <button
                    onClick={() => addLeg(true)}
                    className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Return Manual
                  </button>
                </>
              )}
            </div>

            {/* Summary */}
            {legs.length > 0 && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-600 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Total Distance:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{totalDistance.toLocaleString()} km</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Overall Trip:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {overallStartDate && overallEndDate 
                      ? `${overallStartDate} → ${overallEndDate} (${Math.ceil((new Date(overallEndDate).getTime() - new Date(overallStartDate).getTime()) / (1000 * 60 * 60 * 24) + 1)} days)`
                      : 'Set dates to see duration'
                    }
                  </span>
                </div>
                {Object.keys(dateErrors).length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mt-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Please fix date errors before submitting</span>
                  </div>
                )}
              </div>
            )}

            {/* Purpose & Remarks */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-600 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                  placeholder="Describe the purpose of this travel..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                  placeholder="Additional notes or remarks..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Budget & Vehicle */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Budget & Vehicle</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Funding and transportation details</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Fund Source <span className="text-red-500">*</span>
              </label>
              <select
                value={fundSource}
                onChange={(e) => setFundSource(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
              >
                <option value="">Select an option</option>
                <option value="general">General Fund</option>
                <option value="special">Special Projects</option>
                <option value="external">External Funding</option>
                <option value="donation">Donations</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vehicle to be Used</label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
                >
                  <option value="">Select an option</option>
                  <option value="Government Vehicle">Government Vehicle</option>
                  <option value="Rental Vehicle">Rental Vehicle</option>
                  <option value="Personal Vehicle">Personal Vehicle</option>
                  <option value="Public Transport">Public Transport</option>
                  <option value="Commercial Air">Commercial Air</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Additional Travel Expenses</label>
              <div className="flex flex-wrap gap-3">
                {expenseOptions.map(option => {
                  const isSelected = expenses.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleExpenseChange(option.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-dash-blue bg-blue-50 dark:bg-blue-900/20 text-dash-blue'
                          : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-dash-blue bg-dash-blue' : 'border-slate-400'
                      }`}>
                        {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Travelers */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Traveler/s</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">List of personnel traveling</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {travelers.map((traveler, index) => (
                <div key={traveler.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-lg">
                  <span className="w-8 h-8 bg-dash-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <select
                    value={traveler.employeeId}
                    onChange={(e) => updateTraveler(traveler.id, e.target.value)}
                    className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
                  >
                    <option value="">Select employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.divisionCode})</option>
                    ))}
                  </select>
                  {travelers.length > 1 && (
                    <button
                      onClick={() => removeTraveler(traveler.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addTraveler}
              className="mt-3 flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:border-dash-blue hover:text-dash-blue transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Traveler
            </button>
          </div>
        </section>

        {/* Workflow & Approvals */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Workflow & Approvals</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Approval routing configuration</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Select Approval Steps <span className="text-red-500">*</span>
              </label>
              <select
                value={approvalSteps}
                onChange={(e) => setApprovalSteps(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
              >
                <option value="">Select approval workflow</option>
                <option value="supervisor">Direct Supervisor → HR</option>
                <option value="manager">Department Manager → Finance → HR</option>
                <option value="director">Director → Finance → HR</option>
                <option value="executive">Executive Level Approval</option>
              </select>
            </div>
          </div>
        </section>

        {/* Attachment */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Attachment</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Supporting documents (optional)</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleFileDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-dash-blue bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
              }`}
            >
              <input ref={fileInputRef} type="file" multiple onChange={(e) => setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files || [])])} className="hidden" />
              <div className="w-16 h-16 bg-gradient-to-br from-dash-blue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-7 h-7 text-white" />
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Drag & drop files here or click to browse</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Supports PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-lg">
                    <FileText className="w-5 h-5 text-dash-blue" />
                    <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                    <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <button onClick={() => removeFile(index)} className="p-1 text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button onClick={() => onNavigate(Page.TRAVEL_ORDERS)} className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
            Cancel
          </button>
          <button onClick={() => handleSubmit(true)} disabled={isSubmitting || Object.keys(dateErrors).length > 0} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 disabled:opacity-50">
            {isSubmitting ? 'Creating...' : 'Create & Create Another'}
          </button>
          <button onClick={() => handleSubmit(false)} disabled={isSubmitting || Object.keys(dateErrors).length > 0} className="px-6 py-2.5 bg-dash-blue text-white rounded-lg font-medium hover:bg-blue-600 shadow-sm disabled:opacity-50">
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateTravelOrder;
