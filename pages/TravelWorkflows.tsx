import React, { useState } from 'react';
import {
   RefreshCcw, MapPin, Navigation, Car,
   Users, ClipboardList, Paperclip,
   Trash2, Map as MapIcon, History, FileCheck,
   ChevronDown, Calendar
} from 'lucide-react';

const TravelWorkflows: React.FC = () => {
   const [origin, setOrigin] = useState('DICT HQ, Quezon City');
   const [destination, setDestination] = useState('');
   const [km, setKm] = useState(0);
   const [isCalculating, setIsCalculating] = useState(false);
   const [selectedVehicle, setSelectedVehicle] = useState('Official Fleet');
   const [checklist] = useState([
      { id: 1, label: 'Verify Budget Appropriation (Code 102)', required: true },
      { id: 2, label: 'Personnel Performance Clearance', required: true },
      { id: 3, label: 'Vehicle Log & Maintenance Check', required: true }
   ]);

   const calculateRoute = () => {
      if (!origin || !destination) return;
      setIsCalculating(true);
      setTimeout(() => {
         setKm(Math.floor(Math.random() * 950) + 120);
         setIsCalculating(false);
      }, 800);
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

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
               {/* Route Calculator */}
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
                              />
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

               {/* Personnel Selection */}
               <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                     <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                     </div>
                     <h3 className="text-sm font-medium text-slate-900 dark:text-white">Personnel Assignment</h3>
                  </div>
                  <div className="p-6 space-y-5">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mission Lead</label>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-dash-blue transition-all">
                           <div className="relative">
                              <img src="https://i.pravatar.cc/100?u=maria" className="w-12 h-12 rounded-full border-2 border-dash-blue object-cover" />
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                           </div>
                           <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">Maria L. Cruz</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Director • MISS</p>
                           </div>
                           <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mission Date</label>
                        <div className="relative">
                           <input
                              type="date"
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-dash-blue/30 focus:border-dash-blue outline-none transition-all"
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
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

                     <div className="pt-3">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Supporting Documents</p>
                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-5 flex flex-col items-center text-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer">
                           <Paperclip className="w-5 h-5 text-slate-400" />
                           <span className="text-sm text-slate-500 dark:text-slate-400">Attach documents</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Approval Checklist */}
               <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                     <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                     </div>
                     <h3 className="text-sm font-medium text-slate-900 dark:text-white">Approval Checklist</h3>
                  </div>
                  <div className="p-4 space-y-2">
                     {checklist.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700 group">
                           <div className="w-6 h-6 rounded-full bg-dash-blue/10 text-dash-blue text-xs font-medium flex items-center justify-center">
                              {i + 1}
                           </div>
                           <p className="text-sm text-slate-700 dark:text-slate-300 flex-1">{s.label}</p>
                           <button className="text-slate-300 dark:text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default TravelWorkflows;