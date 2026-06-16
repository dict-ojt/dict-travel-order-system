import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, FileText, CheckCircle, Upload, X, Plus, Car, Wallet, Route, ArrowRight, Lock, Unlock, Map, Info } from 'lucide-react';
import { Page, RouteLeg, TravelLeg, NormalizedLocation } from '../types';
import { travelSources, employees, currentUser, TravelOrder, travelOrders } from '../data/database';
import LocationSelector from '../components/LocationSelector';
import RouteSelectionModal from '../components/RouteSelectionModal';
import { normalizeLocation, RouteOption, getSavedRoutesFromStorage, SavedRoute } from '../services/routingService';

interface Traveler {
  id: string;
  employeeId: string;
}

interface CreateTravelOrderProps {
  onNavigate: (page: Page) => void;
  editingOrderId?: string | null;
  onClearEdit?: () => void;

  // Lifted state props
  baseOrigin: NormalizedLocation | null;
  setBaseOrigin: (loc: NormalizedLocation | null) => void;
  legs: TravelLeg[];
  setLegs: React.Dispatch<React.SetStateAction<TravelLeg[]>>;
  travelers: Traveler[];
  setTravelers: React.Dispatch<React.SetStateAction<Traveler[]>>;
  fundSource: string;
  setFundSource: (val: string) => void;
  vehicle: string;
  setVehicle: (val: string) => void;
  expenses: string[];
  setExpenses: React.Dispatch<React.SetStateAction<string[]>>;
  approvalSteps: string;
  setApprovalSteps: (val: string) => void;
  purpose: string;
  setPurpose: (val: string) => void;
  remarks: string;
  setRemarks: (val: string) => void;
  uploadedFiles: File[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onResetData?: () => void;

  // RoutePicker props
  initialRouteLeg?: RouteLeg | null;
  onClearRouteLeg?: () => void;
  onOpenRoutePicker?: (
    previousLeg: RouteLeg | null,
    isReturn?: boolean,
    returnEndPoint: { name: string; lat: number; lng: number } | null,
    editingLeg: {
      leg: TravelLeg;
      startPoint: { name: string; lat: number; lng: number };
      endPoint: { name: string; lat: number; lng: number };
      waypoints: Array<{ name: string; lat: number; lng: number }>;
    } | null
  ) => void;
  editingLegId?: string | null;
  onClearEditingState?: () => void;
}

const CreateTravelOrder: React.FC<CreateTravelOrderProps> = ({
  onNavigate,
  editingOrderId,
  onClearEdit,
  baseOrigin,
  setBaseOrigin,
  legs,
  setLegs,
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
  onResetData,
  initialRouteLeg,
  onClearRouteLeg,
  onOpenRoutePicker,
  editingLegId,
  onClearEditingState
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dateErrors, setDateErrors] = useState<Record<string, string>>({});
  const [routingMethod, setRoutingMethod] = useState<'form' | 'map'>('form');

  const [showRouteModal, setShowRouteModal] = useState(false);
  const [currentRouteLegId, setCurrentRouteLegId] = useState<string | null>(null);
  const [modalLocations, setModalLocations] = useState<{ from: NormalizedLocation, to: NormalizedLocation } | null>(null);

  /* State Updates for Saved Routes */
  const [showSavedRoutes, setShowSavedRoutes] = useState(false);
  const [activeLegForSavedRoute, setActiveLegForSavedRoute] = useState<string | null>(null);
  const [savedRoutesList, setSavedRoutesList] = useState<SavedRoute[]>([]);

  const hasAddedLeg = useRef(false);

  // Sync saved routes lists
  useEffect(() => {
    if (showSavedRoutes) {
      setSavedRoutesList(getSavedRoutesFromStorage());
    }
  }, [showSavedRoutes]);

  // Effect to populate form when editing
  useEffect(() => {
    if (editingOrderId) {
      const orderToEdit = travelOrders.find(o => o.id === editingOrderId);
      if (orderToEdit) {
        setPurpose(orderToEdit.purpose);
        setVehicle(orderToEdit.vehicle);
        setFundSource(orderToEdit.fundSource || '');
        setExpenses(orderToEdit.expenses || []);
        setApprovalSteps(orderToEdit.approvalSteps || '');
        setRemarks(orderToEdit.remarks || '');

        // Set Origin
        const origin = normalizeLocation({ name: orderToEdit.originName, display_name: orderToEdit.originName, lat: 14.65, lon: 121.05 });
        setBaseOrigin(origin);

        if (orderToEdit.legs) {
          const loadedLegs: TravelLeg[] = orderToEdit.legs.map((leg) => {
            const fromSource = travelSources.find(l => l.id === leg.fromLocationId);
            const toSource = travelSources.find(l => l.id === leg.toLocationId);

            const fromLoc = fromSource
              ? normalizeLocation(fromSource)
              : normalizeLocation({ lat: 14.65, lon: 121.05, display_name: leg.fromLocationName || 'Unknown Location', name: leg.fromLocationName || 'Unknown Location' });

            const toLoc = toSource
              ? normalizeLocation(toSource)
              : normalizeLocation({ lat: 14.65, lon: 121.05, display_name: leg.toLocationName || 'Unknown Location', name: leg.toLocationName || 'Unknown Location' });

            return {
              id: leg.id,
              fromLocation: fromLoc!,
              toLocation: toLoc,
              startDate: leg.startDate,
              endDate: leg.endDate,
              distanceKm: leg.distanceKm,
              isReturn: leg.isReturn,
              stops: leg.waypoints || [],
              avoid: [],
              avoidPoint: null
            };
          });
          setLegs(loadedLegs);
        }
      }
    }
  }, [editingOrderId]);

  // Handle return from RoutePicker page
  useEffect(() => {
    if (initialRouteLeg && !hasAddedLeg.current) {
      hasAddedLeg.current = true;
      const targetId = editingLegId;

      if (targetId) {
        // Update existing leg
        setLegs(prev => prev.map(leg => {
          if (leg.id === targetId) {
            return {
              ...leg,
              startDate: initialRouteLeg.startDate || leg.startDate,
              endDate: initialRouteLeg.endDate || leg.endDate,
              distanceKm: Math.round(initialRouteLeg.distanceKm),
              fromLocation: initialRouteLeg.fromLocation,
              toLocation: initialRouteLeg.toLocation,
              stops: initialRouteLeg.waypoints || []
            };
          }
          return leg;
        }));
        onClearEditingState?.();
      } else {
        // Add new leg
        const newLeg: TravelLeg = {
          id: Date.now().toString(),
          fromLocation: initialRouteLeg.fromLocation,
          toLocation: initialRouteLeg.toLocation,
          startDate: initialRouteLeg.startDate || '',
          endDate: initialRouteLeg.endDate || '',
          distanceKm: Math.round(initialRouteLeg.distanceKm),
          isReturn: initialRouteLeg.isReturn || false,
          stops: initialRouteLeg.waypoints || [],
          avoid: [],
          avoidPoint: null
        };
        
        // Also update baseOrigin if it's the first leg
        if (legs.length === 0) {
          setBaseOrigin(initialRouteLeg.fromLocation);
        }
        setLegs(prev => [...prev, newLeg]);
      }
      onClearRouteLeg?.();
    }
    if (!initialRouteLeg) {
      hasAddedLeg.current = false;
    }
  }, [initialRouteLeg, onClearRouteLeg, setLegs, editingLegId, onClearEditingState, legs]);

  const handleEditLeg = (leg: TravelLeg) => {
    if (routingMethod === 'map') {
      const startPoint = { 
        name: leg.fromLocation.name,
        lat: leg.fromLocation.lat,
        lng: leg.fromLocation.lng
      };
      
      const endPoint = {
        name: leg.toLocation?.name || '',
        lat: leg.toLocation?.lat || 0,
        lng: leg.toLocation?.lng || 0
      };
      
      const waypoints = leg.stops || [];
      
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
    }
  };

  const handleLoadSavedRoute = (route: SavedRoute) => {
    if (!activeLegForSavedRoute) return;

    const legIndex = legs.findIndex(l => l.id === activeLegForSavedRoute);
    if (legIndex === -1) return;

    if (legIndex === 0) {
      setBaseOrigin(route.from);
      const newLegs = [...legs];
      newLegs[0].fromLocation = route.from;
      newLegs[0].toLocation = route.to;
      newLegs[0].avoid = route.avoid;
      newLegs[0].avoidPoint = route.avoidPoint;
      newLegs[0].stops = route.stops;
      setLegs(newLegs);
    } else {
      const leg = legs[legIndex];
      if (leg.fromLocation.name !== route.from.name) {
        alert(`Note: The saved route starts from ${route.from.name}, but this leg starts from ${leg.fromLocation.name}. Stops might be misaligned.`);
      }
      updateLeg(activeLegForSavedRoute, {
        toLocation: route.to,
        avoid: route.avoid,
        avoidPoint: route.avoidPoint,
        stops: route.stops
      });
    }

    setShowSavedRoutes(false);
    setActiveLegForSavedRoute(null);
  };

  const addStopToLeg = (legId: string) => {
    setLegs(prev => prev.map(l => {
      if (l.id !== legId) return l;
      return {
        ...l,
        stops: [...l.stops, { lat: 0, lng: 0, name: '', address: '' }]
      };
    }));
  };

  const removeStopFromLeg = (legId: string, index: number) => {
    setLegs(prev => prev.map(l => {
      if (l.id !== legId) return l;
      return {
        ...l,
        stops: l.stops.filter((_, i) => i !== index)
      };
    }));
  };

  const updateStopInLeg = (legId: string, index: number, location: NormalizedLocation) => {
    setLegs(prev => prev.map(l => {
      if (l.id !== legId) return l;
      const newStops = [...l.stops];
      newStops[index] = location;
      return {
        ...l,
        stops: newStops
      };
    }));
  };

  const getLocationName = (loc: NormalizedLocation | null) => loc?.name || 'Unknown';

  const addLeg = (isReturn: boolean = false) => {
    if (routingMethod === 'map') {
      const lastLeg = legs[legs.length - 1];
      const prevLeg = lastLeg ? {
        fromLocation: lastLeg.fromLocation,
        toLocation: lastLeg.toLocation || lastLeg.fromLocation,
        distanceKm: lastLeg.distanceKm,
        durationMin: 0
      } : null;

      onOpenRoutePicker?.(prevLeg, isReturn, isReturn ? baseOrigin : null, null);
      return;
    }

    if (!baseOrigin) return;

    const prevLeg = legs[legs.length - 1];
    const fromLocation = prevLeg ? prevLeg.toLocation : baseOrigin;
    const toLocation = isReturn ? baseOrigin : null;

    if (prevLeg && !prevLeg.toLocation) return;

    const today = new Date();
    const startDate = prevLeg ? prevLeg.endDate : today.toISOString().split('T')[0];

    setLegs([...legs, {
      id: Date.now().toString(),
      fromLocation: fromLocation!,
      toLocation,
      startDate,
      endDate: '',
      distanceKm: 0,
      isReturn,
      stops: [],
      avoid: [],
      avoidPoint: null
    }]);
  };

  const updateLeg = (id: string, updates: Partial<TravelLeg>) => {
    setLegs(legs.map(leg => {
      if (leg.id !== id) return leg;
      return { ...leg, ...updates };
    }));
  };

  const openRouteModal = (legId: string, from: NormalizedLocation, to: NormalizedLocation | null) => {
    if (!to) return;
    setCurrentRouteLegId(legId);
    setModalLocations({ from, to });
    setShowRouteModal(true);
  };

  const handleRouteSelect = (route: RouteOption) => {
    if (currentRouteLegId) {
      updateLeg(currentRouteLegId, {
        distanceKm: parseFloat((route.distance / 1000).toFixed(1))
      });
    }
    setShowRouteModal(false);
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
          errors[`${leg.id}_start`] = `Cannot start before ${getLocationName(prevLeg.toLocation)} ends`;
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
      onClearEdit?.();
    } else {
      onClearEdit?.();
      onResetData?.();
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
        <button onClick={() => { onClearEdit?.(); onNavigate(Page.TRAVEL_ORDERS); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{editingOrderId ? 'Edit Travel Order' : 'Create Travel Order'}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sequential Travel Legs</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Travel Details - Sequential Legs */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Route className="w-5 h-5 text-dash-blue" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Travel Details</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Multi-leg journey planner</p>
              </div>
            </div>

            {/* Routing Method Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 w-fit">
              <button
                type="button"
                onClick={() => setRoutingMethod('form')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  routingMethod === 'form'
                    ? 'bg-white dark:bg-slate-800 text-dash-blue shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Form & Modal Select
              </button>
              <button
                type="button"
                onClick={() => setRoutingMethod('map')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  routingMethod === 'map'
                    ? 'bg-white dark:bg-slate-800 text-dash-blue shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                Interactive Map Picker
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Starting Point (shared base origin) */}
            <div className="space-y-2">
              <LocationSelector
                label="Starting Point (Origin)"
                placeholder="Search origin location (e.g. DICT Headquarters)"
                defaultOptions={travelSources}
                onSelect={(val) => {
                  const norm = normalizeLocation(val);
                  setBaseOrigin(norm);
                  if (legs.length > 0 && legs[0].fromLocation.name !== norm?.name) {
                    const newLegs = [...legs];
                    newLegs[0].fromLocation = norm!;
                    setLegs(newLegs);
                  }
                }}
                initialValue={baseOrigin?.name}
              />
            </div>

            {/* Method A: Form & Modal Select */}
            {routingMethod === 'form' && legs.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span>Travel Legs (Form-based)</span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
                </div>

                <div className="space-y-4">
                  {legs.map((leg, index) => (
                    <div key={leg.id} className="relative group">
                      {index < legs.length - 1 && (
                        <div className="absolute left-[31px] top-12 bottom-[-16px] w-0.5 bg-slate-200 dark:bg-slate-700 z-0" />
                      )}

                      <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm transition-all hover:shadow-md z-10 animate-fade-in">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${getLegColor(index)} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0`}>
                              {index + 1}
                            </div>
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              Leg {index + 1}
                              {leg.distanceKm > 0 && <span className="ml-2 font-normal text-slate-500">• {leg.distanceKm} km</span>}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeLeg(leg.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Remove Leg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="pl-11 space-y-4">
                          <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-start">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                From (Origin)
                              </label>
                              <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                {getLocationName(leg.fromLocation)}
                              </div>
                            </div>

                            <div className="hidden md:flex pt-8 justify-center text-slate-300 dark:text-slate-600">
                              <ArrowRight className="w-5 h-5" />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-dash-blue" />
                                To (Destination)
                              </label>
                              <LocationSelector
                                label=""
                                placeholder="Search destination..."
                                defaultOptions={travelSources.filter(s => s.name !== leg.fromLocation.name)}
                                initialValue={leg.toLocation?.name}
                                onSelect={(val) => {
                                  const norm = normalizeLocation(val);
                                  updateLeg(leg.id, { toLocation: norm });
                                }}
                              />
                            </div>
                          </div>

                          {/* Stops Section */}
                          <div className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-3 border border-slate-100 dark:border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Stops / Waypoints</p>
                              <button
                                onClick={() => addStopToLeg(leg.id)}
                                className="text-xs text-dash-blue hover:text-blue-600 flex items-center gap-1 font-medium"
                              >
                                <Plus className="w-3 h-3" /> Add Stop
                              </button>
                            </div>

                            {leg.stops.length > 0 ? (
                              <div className="space-y-2">
                                {leg.stops.map((stop, stopIndex) => (
                                  <div key={stopIndex} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                    <div className="flex-1">
                                      <LocationSelector
                                        label=""
                                        placeholder="Stop location..."
                                        defaultOptions={travelSources}
                                        initialValue={stop.name}
                                        onSelect={(val) => {
                                          const norm = normalizeLocation(val);
                                          if (norm) updateStopInLeg(leg.id, stopIndex, norm);
                                        }}
                                      />
                                    </div>
                                    <button onClick={() => removeStopFromLeg(leg.id, stopIndex)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 italic">No stops added</p>
                            )}
                          </div>

                          {/* Dates and Route Actions */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200 dark:border-slate-600">
                                <div className="relative">
                                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                  <input
                                    type="date"
                                    value={leg.startDate}
                                    onChange={(e) => updateLeg(leg.id, { startDate: e.target.value })}
                                    min={index > 0 ? legs[index - 1]?.endDate : new Date().toISOString().split('T')[0]}
                                    className={`pl-8 pr-2 py-1.5 bg-transparent border-none text-sm focus:ring-0 text-slate-700 dark:text-slate-300 w-36 ${dateErrors[`${leg.id}_start`] ? 'text-red-600 font-medium' : ''}`}
                                  />
                                </div>
                                <ArrowRight className="w-3 h-3 text-slate-400" />
                                <div className="relative">
                                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                  <input
                                    type="date"
                                    value={leg.endDate}
                                    onChange={(e) => updateLeg(leg.id, { endDate: e.target.value })}
                                    min={leg.startDate}
                                    className={`pl-8 pr-2 py-1.5 bg-transparent border-none text-sm focus:ring-0 text-slate-700 dark:text-slate-300 w-36 ${dateErrors[`${leg.id}_end`] ? 'text-red-600 font-medium' : ''}`}
                                  />
                                </div>
                              </div>
                              {(dateErrors[`${leg.id}_start`] || dateErrors[`${leg.id}_end`]) && (
                                <span className="text-xs text-red-500 font-medium">Check dates</span>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              {leg.isReturn && (
                                <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full flex items-center gap-1">
                                  🏠 Return
                                </span>
                              )}
                              <button
                                onClick={() => openRouteModal(leg.id, leg.fromLocation, leg.toLocation)}
                                disabled={!leg.toLocation}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                              >
                                <Route className="w-4 h-4" />
                                <span>{leg.distanceKm > 0 ? 'Recalculate Route' : 'Calculate Route'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Method B: Interactive Map Timeline (Route Picker) */}
            {routingMethod === 'map' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span>Travel Legs (Interactive Timeline)</span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
                </div>

                {legs.length > 0 ? (
                  <div className="space-y-4 relative pl-8 border-l border-slate-200 dark:border-slate-700 ml-4 py-2">
                    {legs.map((leg, index) => (
                      <div key={leg.id} className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => handleEditLeg(leg)}>
                        {/* Bullet Icon */}
                        <div className={`absolute -left-[45px] top-6 w-8 h-8 ${getLegColor(index)} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0 z-10`}>
                          {index + 1}
                        </div>

                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                              <span className="text-slate-500">From:</span>
                              <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{leg.fromLocation.name}</span>
                              <ArrowRight className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-500">To:</span>
                              <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{leg.toLocation?.name || 'Unset'}</span>
                              
                              {leg.isReturn && (
                                <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/35 text-green-700 dark:text-green-400 text-[10px] font-medium rounded-full">Return</span>
                              )}
                            </div>

                            {/* Waypoints */}
                            {leg.stops.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                                <span>Stops:</span>
                                {leg.stops.map((stop, sIdx) => (
                                  <span key={sIdx} className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                                    {stop.name}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Date inputs (Click event stopped to avoid opening picker) */}
                            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-1 text-slate-500">
                                <Calendar className="w-3.5 h-3.5" />
                                <input
                                  type="date"
                                  value={leg.startDate}
                                  onChange={(e) => updateLeg(leg.id, { startDate: e.target.value })}
                                  min={index > 0 ? legs[index - 1]?.endDate : new Date().toISOString().split('T')[0]}
                                  className="bg-transparent border-0 p-0 text-xs w-24 text-slate-700 dark:text-slate-300 focus:ring-0"
                                />
                              </div>
                              <span className="text-slate-400">→</span>
                              <div className="flex items-center gap-1 text-slate-500">
                                <Calendar className="w-3.5 h-3.5" />
                                <input
                                  type="date"
                                  value={leg.endDate}
                                  onChange={(e) => updateLeg(leg.id, { endDate: e.target.value })}
                                  min={leg.startDate}
                                  className="bg-transparent border-0 p-0 text-xs w-24 text-slate-700 dark:text-slate-300 focus:ring-0"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex flex-col items-end gap-2 shrink-0">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{leg.distanceKm} km</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] px-2 py-0.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500 rounded opacity-0 group-hover:opacity-100 transition-opacity">Edit on Map</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); removeLeg(leg.id); }}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/25 rounded-md"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/10">
                    <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No legs added yet</p>
                    <p className="text-xs text-slate-400 mt-1">Click below to trace a leg using the interactive map</p>
                  </div>
                )}
              </div>
            )}

            {/* Add Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => addLeg(false)}
                disabled={!baseOrigin || (routingMethod === 'form' && legs.length > 0 && !legs[legs.length - 1].toLocation) || legs.some(l => l.isReturn)}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:border-dash-blue hover:text-dash-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                {routingMethod === 'map' ? 'Pick Leg on Map' : 'Add Travel Leg'}
              </button>
              {legs.length > 0 && !legs.some(l => l.isReturn) && (
                <button
                  onClick={() => addLeg(true)}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  {routingMethod === 'map' ? 'Pick Return Leg on Map' : 'Add Return Leg'}
                </button>
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
                      ? (() => {
                        const duration = Math.ceil((new Date(overallEndDate).getTime() - new Date(overallStartDate).getTime()) / (1000 * 60 * 60 * 24) + 1);
                        return `${overallStartDate} → ${overallEndDate} (${duration} ${duration === 1 ? 'day' : 'days'})`;
                      })()
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
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm resize-none focus:ring-2 focus:ring-dash-blue/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                  placeholder="Additional notes or remarks..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm resize-none focus:ring-2 focus:ring-dash-blue/50 outline-none"
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
                <Car className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Budget & Vehicle</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Expense allocation and transport options</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Source of Fund <span className="text-red-500">*</span>
                </label>
                <select
                  value={fundSource}
                  onChange={(e) => setFundSource(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-dash-blue/50 outline-none"
                >
                  <option value="">Select source of fund</option>
                  <option value="main">Main Office Budget</option>
                  <option value="regional">Regional Fund</option>
                  <option value="special">Special Project Fund</option>
                  <option value="external">External Sponsor</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Vehicle Option <span className="text-red-500">*</span>
                </label>
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-dash-blue/50 outline-none"
                >
                  <option value="">Select vehicle option</option>
                  <option value="official">Official Vehicle (DICT service)</option>
                  <option value="rented">Rented Vehicle</option>
                  <option value="personal">Personal Vehicle (Reimbursable)</option>
                  <option value="public">Public Transport (Bus, plane, ferry)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-slate-400" />
                Expenses to Claim
              </label>
              <div className="flex flex-wrap gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                {expenseOptions.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={expenses.includes(opt.value)}
                      onChange={() => handleExpenseChange(opt.value)}
                      className="rounded border-slate-300 text-dash-blue focus:ring-dash-blue/30 w-4 h-4"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Travelers List */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Travelers List</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Add employees traveling under this order</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-3">
              {travelers.map((traveler, index) => (
                <div key={traveler.id} className="flex items-center gap-3 animate-fade-in">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-500 shrink-0">
                    {index + 1}
                  </div>
                  <select
                    value={traveler.employeeId}
                    onChange={(e) => updateTraveler(traveler.id, e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-dash-blue/50 outline-none"
                  >
                    <option value="">Select employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.divisionCode})</option>
                    ))}
                  </select>
                  {travelers.length > 1 && (
                    <button
                      onClick={() => removeTraveler(traveler.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-dash-blue/50 outline-none"
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
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragOver
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
          <button onClick={() => { onResetData?.(); onNavigate(Page.TRAVEL_ORDERS); }} className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button onClick={() => handleSubmit(true)} disabled={isSubmitting || Object.keys(dateErrors).length > 0} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 disabled:opacity-50 transition-colors">
            {isSubmitting ? 'Creating...' : 'Create & Create Another'}
          </button>
          <button onClick={() => handleSubmit(false)} disabled={isSubmitting || Object.keys(dateErrors).length > 0} className="px-6 py-2.5 bg-dash-blue text-white rounded-lg font-medium hover:bg-blue-600 shadow-sm disabled:opacity-50 transition-colors">
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
      <RouteSelectionModal
        isOpen={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        from={modalLocations?.from || null}
        to={modalLocations?.to || null}
        stops={currentRouteLegId ? (legs.find(l => l.id === currentRouteLegId)?.stops.filter(s => s.name !== '') || []) : []}
        onSelectRoute={handleRouteSelect}
      />
    </div>
  );
};

export default CreateTravelOrder;
