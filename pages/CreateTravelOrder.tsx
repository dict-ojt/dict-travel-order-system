import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, FileText, CheckCircle, Upload, X, Plus, Car, Wallet, Route, ArrowRight } from 'lucide-react';
import { Page } from '../types';
import { travelSources, employees, currentUser, TravelOrder, travelOrders } from '../data/database';
import LocationSelector from '../components/LocationSelector';
import RouteSelectionModal from '../components/RouteSelectionModal';
import { normalizeLocation, NormalizedLocation, RouteOption, getSavedRoutesFromStorage, SavedRoute } from '../services/routingService';

interface CreateTravelOrderProps {
  onNavigate: (page: Page) => void;
}

interface TravelLeg {
  id: string;
  fromLocation: NormalizedLocation;
  toLocation: NormalizedLocation | null;
  startDate: string;
  endDate: string;
  distanceKm: number;
  isReturn: boolean;
  stops: NormalizedLocation[];
  avoid: ('tolls' | 'highways' | 'ferries')[];
  avoidPoint: NormalizedLocation | null;
}

interface Traveler {
  id: string;
  employeeId: string;
}

const CreateTravelOrder: React.FC<CreateTravelOrderProps> = ({ onNavigate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dateErrors, setDateErrors] = useState<Record<string, string>>({});
  const [baseOrigin, setBaseOrigin] = useState<NormalizedLocation | null>(null);
  const [legs, setLegs] = useState<TravelLeg[]>([]);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [currentRouteLegId, setCurrentRouteLegId] = useState<string | null>(null);
  const [modalLocations, setModalLocations] = useState<{ from: NormalizedLocation, to: NormalizedLocation } | null>(null);

  // Saved Routes State
  const [showSavedRoutes, setShowSavedRoutes] = useState(false);
  const [activeLegForSavedRoute, setActiveLegForSavedRoute] = useState<string | null>(null);
  const [savedRoutesList, setSavedRoutesList] = useState<SavedRoute[]>([]);
  // Use travelOrders[0] for demo edit
  const demoOrder = travelOrders[0];

  useEffect(() => {
    // Populate form with demo data
    if (demoOrder) {
      setPurpose(demoOrder.purpose);
      setVehicle(demoOrder.vehicle);
      setFundSource(demoOrder.fundSource || '');
      setExpenses(demoOrder.expenses || []);
      setApprovalSteps(demoOrder.approvalSteps || '');
      setRemarks(demoOrder.remarks || '');

      // Set Origin
      const origin = normalizeLocation({ name: demoOrder.originName, display_name: demoOrder.originName, lat: 0, lon: 0 }); // Mock normalization
      setBaseOrigin(origin);

      if (demoOrder.legs) {
        const loadedLegs: TravelLeg[] = demoOrder.legs.map((leg) => {
          const fromSource = travelSources.find(l => l.id === leg.fromLocationId);
          const toSource = travelSources.find(l => l.id === leg.toLocationId);

          const fromLoc = fromSource
            ? normalizeLocation(fromSource)
            : normalizeLocation({ lat: 0, lon: 0, display_name: 'Unknown Location' });

          const toLoc = toSource
            ? normalizeLocation(toSource)
            : null;

          return {
            id: leg.id,
            fromLocation: fromLoc!,
            toLocation: toLoc,
            startDate: leg.startDate,
            endDate: leg.endDate,
            distanceKm: leg.distanceKm,
            isReturn: leg.isReturn,
            stops: [], // Mock data doesn't have stops yet
            avoid: [],
            avoidPoint: null
          };
        });
        setLegs(loadedLegs);
      }
    }
  }, []);

  /* State Updates for Stops */
  const [routeStops, setRouteStops] = useState<Record<string, NormalizedLocation[]>>({});

  useEffect(() => {
    if (showSavedRoutes) {
      setSavedRoutesList(getSavedRoutesFromStorage());
    }
  }, [showSavedRoutes]);

  const handleLoadSavedRoute = (route: SavedRoute) => {
    if (!activeLegForSavedRoute) return;

    // Apply saved route to the leg
    const legIndex = legs.findIndex(l => l.id === activeLegForSavedRoute);
    if (legIndex === -1) return;

    // We can't easily change the *origin* of the leg if it's tied to the previous leg, 
    // unless it's the first leg. But let's assume valid intent.
    // If it's the first leg, we update baseOrigin.
    if (legIndex === 0) {
      setBaseOrigin(route.from);
      const newLegs = [...legs];
      newLegs[0].fromLocation = route.from;
      newLegs[0].toLocation = route.to;
      newLegs[0].avoid = route.avoid;
      newLegs[0].avoidPoint = route.avoidPoint;
      setLegs(newLegs);
    } else {
      // For subsequent legs, we can only update To, unless we break the chain geometry?
      // Let's just update To and Stops/Avoidances. 
      // Warn if origin mismatch?
      const leg = legs[legIndex];
      if (leg.fromLocation.name !== route.from.name) {
        alert(`Note: The saved route starts from ${route.from.name}, but this leg starts from ${leg.fromLocation.name}. Waypoints might be off.`);
      }
      updateLeg(activeLegForSavedRoute, {
        toLocation: route.to,
        avoid: route.avoid,
        avoidPoint: route.avoidPoint
      });
    }

    // Update stops
    setRouteStops(prev => ({
      ...prev,
      [activeLegForSavedRoute]: route.stops
    }));

    setShowSavedRoutes(false);
    setActiveLegForSavedRoute(null);
  };

  const addStopToLeg = (legId: string) => {
    setRouteStops(prev => ({
      ...prev,
      [legId]: [...(prev[legId] || []), { lat: 0, lng: 0, name: '', address: '' }] // Placeholder
    }));
  };

  const removeStopFromLeg = (legId: string, index: number) => {
    setRouteStops(prev => ({
      ...prev,
      [legId]: (prev[legId] || []).filter((_, i) => i !== index)
    }));
  };

  const updateStopInLeg = (legId: string, index: number, location: NormalizedLocation) => {
    setRouteStops(prev => {
      const newStops = [...(prev[legId] || [])];
      newStops[index] = location;
      return { ...prev, [legId]: newStops };
    });
  };

  const [travelers, setTravelers] = useState<Traveler[]>([{ id: '1', employeeId: currentUser.id }]);
  const [fundSource, setFundSource] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [expenses, setExpenses] = useState<string[]>([]);
  const [approvalSteps, setApprovalSteps] = useState('');
  const [purpose, setPurpose] = useState('');
  const [remarks, setRemarks] = useState('');



  const getLocationName = (loc: NormalizedLocation | null) => loc?.name || 'Unknown';

  const addLeg = (isReturn: boolean = false) => {
    if (!baseOrigin) return;

    const prevLeg = legs[legs.length - 1];
    const fromLocation = prevLeg ? prevLeg.toLocation : baseOrigin;
    const toLocation = isReturn ? baseOrigin : null;

    // Safety check - if previous leg has no destination, we can't start a new one unless it's the first one logic
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

    // If it's a return leg, we can auto-calculate route distance if we want, but user might want options.
    // Let's just set the locations.
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
      setBaseOrigin(null);
      setLegs([]);
      setTravelers([{ id: '1', employeeId: currentUser.id }]);
      setFundSource('');
      setVehicle('');
      setExpenses([]);
      setApprovalSteps('');
      setPurpose('');
      setRemarks('');
      setUploadedFiles([]);
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
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
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
            {/* Starting Point */}
            <div className="space-y-2">
              <LocationSelector
                label="Starting Point (Origin)"
                placeholder="Search origin location (e.g. DICT Headquarters)"
                defaultOptions={travelSources}
                onSelect={(val) => {
                  const norm = normalizeLocation(val);
                  setBaseOrigin(norm);
                  // Reset legs if origin changes? Maybe not, complicates things.
                  if (legs.length > 0 && legs[0].fromLocation.name !== norm?.name) {
                    // Ideally we warn user or update first leg from
                    const newLegs = [...legs];
                    newLegs[0].fromLocation = norm!;
                    setLegs(newLegs);
                  }
                }}
                initialValue={baseOrigin?.name}
              />
            </div>

            {/* Travel Legs */}

            {legs.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span>Travel Legs</span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
                </div>

                <div className="space-y-4">
                  {legs.map((leg, index) => (
                    <div key={leg.id} className="relative group">
                      {/* Connector Line */}
                      {index < legs.length - 1 && (
                        <div className="absolute left-[31px] top-12 bottom-[-16px] w-0.5 bg-slate-200 dark:bg-slate-700 z-0" />
                      )}

                      <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm transition-all hover:shadow-md z-10">
                        {/* Header with Leg Number and Actions */}
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
                          {/* Route Grid */}
                          <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-start">
                            {/* From */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                From (Origin)
                              </label>
                              <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                {getLocationName(leg.fromLocation)}
                              </div>
                            </div>

                            {/* Arrow (Hidden on mobile) */}
                            <div className="hidden md:flex pt-8 justify-center text-slate-300 dark:text-slate-600">
                              <ArrowRight className="w-5 h-5" />
                            </div>

                            {/* To */}
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

                            {routeStops[leg.id]?.length > 0 ? (
                              <div className="space-y-2">
                                {routeStops[leg.id].map((stop, stopIndex) => (
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

                          {/* Footer: Dates and Route */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                            <div className="flex flex-wrap items-center gap-4">
                              {/* Date Range */}
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

            {/* Add Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => addLeg(false)}
                disabled={!baseOrigin || (legs.length > 0 && !legs[legs.length - 1].toLocation) || legs.some(l => l.isReturn)}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:border-dash-blue hover:text-dash-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Travel Leg
              </button>
              {legs.length > 0 && !legs.some(l => l.isReturn) && (
                <button
                  onClick={() => addLeg(true)}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Return Leg
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
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${isSelected
                        ? 'border-dash-blue bg-blue-50 dark:bg-blue-900/20 text-dash-blue'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300'
                        }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-dash-blue bg-dash-blue' : 'border-slate-400'
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
      <RouteSelectionModal
        isOpen={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        from={modalLocations?.from || null}
        to={modalLocations?.to || null}
        stops={currentRouteLegId ? (routeStops[currentRouteLegId]?.filter(s => s.name !== '') || []) : []}
        onSelectRoute={handleRouteSelect}
      />
    </div>
  );
};

export default CreateTravelOrder;
