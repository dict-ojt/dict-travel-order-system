import React, { useState } from 'react';
import {
   RefreshCcw, MapPin, Navigation, Car,
   Users, ClipboardList, Paperclip,
   Trash2, Map as MapIcon, History, FileCheck,
   ChevronDown, Calendar, Check
} from 'lucide-react';
import { currentUser, travelSources } from '../data/database';

const TravelWorkflows: React.FC = () => {
   const [origin, setOrigin] = useState('DICT HQ, Quezon City');
   const [destination, setDestination] = useState('');
   const [km, setKm] = useState(0);
   const [isCalculating, setIsCalculating] = useState(false);
   const [selectedVehicle, setSelectedVehicle] = useState('Official Fleet');
   const [checklist, setChecklist] = useState([
      { id: 1, label: 'Verify Budget Appropriation (Code 102)', required: true, checked: false },
      { id: 2, label: 'Personnel Performance Clearance', required: true, checked: false },
      { id: 3, label: 'Vehicle Log & Maintenance Check', required: true, checked: false },
      { id: 4, label: 'Division Head Endorsement', required: true, checked: false },
      { id: 5, label: 'Pre-Travel Briefing Completed', required: false, checked: false }
   ]);

   const calculateRoute = () => {
      if (!origin || !destination) return;
      setIsCalculating(true);
      setTimeout(() => {
         setKm(Math.floor(Math.random() * 950) + 120);
         setIsCalculating(false);
      }, 800);
   };

   const toggleChecklistItem = (id: number) => {
      setChecklist(prev => prev.map(item =>
         item.id === id ? { ...item, checked: !item.checked } : item
      ));
   };

   return (
      <div className="max-w-7xl mx-auto space-y-6">
         {/* Header */}
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Travel Workflows</h1>
               <p className="text-sm text-slate-500 dark:text-slate-400">Configure and manage travel order workflows</p>
            </div>
            <div className="flex gap-3">
               <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                  <History className="w-4 h-4" /> Audit Logs
               </button>
               <button className="px-4 py-2 bg-dash-blue text-white rounded-lg text-sm font-medium shadow-sm hover:bg-blue-600 transition-all">
                  Save Settings
               </button>
            </div>
         </div>

         {/* Row 1: Route Calculator */}
         <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
               <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                  <MapIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
               </div>
               <h3 className="text-sm font-medium text-slate-900 dark:text-white">Route Calculator</h3>
            </div>
            <div className="p-6 space-y-5">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Origin</label>
                     <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                           value={origin}
                           onChange={e => setOrigin(e.target.value)}
                           className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-dash-blue/30 focus:border-dash-blue outline-none transition-all"
                           list="locations"
                        />
                        <datalist id="locations">
                           {travelSources.map(s => (
                              <option key={s.id} value={s.name} />
                           ))}
                        </datalist>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Destination</label>
                     <div className="relative">
                        <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                        <input
                           placeholder="Enter destination..."
                           value={destination}
                           onChange={e => setDestination(e.target.value)}
                           className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-dash-blue/30 focus:border-dash-blue outline-none transition-all"
                           list="locations"
                        />
                     </div>
                  </div>
               </div>

               <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div>
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{km}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">km</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Estimated distance</p>
                     </div>
                     <div className="h-12 w-px bg-slate-200 dark:bg-slate-700"></div>
                     <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                        Distance calculated using DICT Geo-Services. Per-diem scale: Standard.
                     </p>
                  </div>
                  <button
                     onClick={calculateRoute}
                     disabled={isCalculating}
                     className="bg-slate-900 dark:bg-dash-blue text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-800 dark:hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                     {isCalculating ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                     {isCalculating ? 'Calculating...' : 'Calculate Route'}
                  </button>
               </div>
            </div>
         </div>

         {/* Row 2: Personnel Selection */}
         <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
               <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
               </div>
               <h3 className="text-sm font-medium text-slate-900 dark:text-white">Personnel Assignment</h3>
            </div>
            <div className="p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mission Lead</label>
                     <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-dash-blue transition-all">
                        <div className="relative">
                           <img src={currentUser.avatar} className="w-12 h-12 rounded-full border-2 border-dash-blue object-cover" />
                           <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                           <p className="text-sm font-medium text-slate-900 dark:text-white">{currentUser.fullName}</p>
                           <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.position} • {currentUser.divisionCode}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mission Date</label>
                     <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                           type="date"
                           className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-dash-blue/30 focus:border-dash-blue outline-none transition-all"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Row 3: Transportation & Documents (side by side) */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vehicle Selection */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
               <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                     <Car className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">Transportation</h3>
               </div>
               <div className="p-4 space-y-3">
                  {['Official Fleet', 'Private Reimburse', 'Commercial Air'].map(t => (
                     <button
                        key={t}
                        onClick={() => setSelectedVehicle(t)}
                        className={`w-full p-3 rounded-lg text-sm text-left border transition-all flex items-center justify-between ${selectedVehicle === t
                           ? 'bg-dash-blue text-white border-dash-blue'
                           : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-dash-blue/50'
                           }`}
                     >
                        {t}
                        <Car className={`w-4 h-4 ${selectedVehicle === t ? 'opacity-70' : 'opacity-30'}`} />
                     </button>
                  ))}
               </div>
            </div>

            {/* Attach Documents */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
               <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                     <Paperclip className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">Supporting Documents</h3>
               </div>
               <div className="p-4">
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 flex flex-col items-center text-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer">
                     <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Paperclip className="w-6 h-6 text-slate-400" />
                     </div>
                     <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click to upload or drag & drop</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PDF, DOC, DOCX up to 10MB</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Row 4: Approval Checklist */}
         <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                     <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">Approval Checklist</h3>
               </div>
               <span className="text-xs text-slate-500 dark:text-slate-400">
                  {checklist.filter(c => c.checked).length} / {checklist.length} completed
               </span>
            </div>
            <div className="p-4">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {checklist.map((s) => (
                     <div
                        key={s.id}
                        onClick={() => toggleChecklistItem(s.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${s.checked
                           ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                           : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-dash-blue/50'
                           }`}
                     >
                        <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all ${s.checked
                           ? 'bg-green-500 text-white'
                           : 'border-2 border-slate-300 dark:border-slate-600'
                           }`}>
                           {s.checked && <Check className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className={`text-sm font-medium ${s.checked ? 'text-green-700 dark:text-green-400' : 'text-slate-700 dark:text-slate-300'}`}>
                              {s.label}
                           </p>
                           {s.required && (
                              <span className="text-xs text-red-500">Required</span>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default TravelWorkflows;