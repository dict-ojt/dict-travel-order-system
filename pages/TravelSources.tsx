import React, { useState } from 'react';
import {
    Search, Plus, MapPin, Building, Phone, Mail,
    LayoutGrid, Table as TableIcon, MoreHorizontal, Filter
} from 'lucide-react';
import { travelSources, getLocationCounts, TravelSource } from '../data/database';

const TravelSources: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');

    const counts = getLocationCounts();

    const filteredSources = travelSources.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.region.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || s.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const getTypeColor = (type: TravelSource['type']) => {
        switch (type) {
            case 'hub': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
            case 'regional': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'training': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
            case 'satellite': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
            default: return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400';
        }
    };

    const getTypeName = (type: TravelSource['type']) => {
        switch (type) {
            case 'hub': return 'Tech Hub';
            case 'regional': return 'Regional Office';
            case 'training': return 'Training Center';
            case 'satellite': return 'Satellite Office';
            default: return type;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Travel Sources</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage travel destinations and office locations</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <button
                            onClick={() => setViewMode('simple')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'simple'
                                ? 'bg-white dark:bg-slate-700 shadow text-dash-blue'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <TableIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('detailed')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'detailed'
                                ? 'bg-white dark:bg-slate-700 shadow text-dash-blue'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-dash-blue text-white rounded-lg text-sm font-medium shadow-sm hover:bg-blue-600 transition-all">
                        <Plus className="w-4 h-4" /> Add Location
                    </button>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search locations..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-dash-blue/30 focus:border-dash-blue outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value)}
                        className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-dash-blue/30 focus:border-dash-blue outline-none"
                    >
                        <option value="all">All Types</option>
                        <option value="hub">Tech Hubs</option>
                        <option value="regional">Regional Offices</option>
                        <option value="training">Training Centers</option>
                        <option value="satellite">Satellite Offices</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{counts.total}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Total Locations</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-800 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{counts.hubs}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Tech Hubs</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-green-100 dark:border-green-800 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <Building className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{counts.regional}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Regional Offices</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-800 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                            <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{counts.training}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Training Centers</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-amber-100 dark:border-amber-800 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                            <Building className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{counts.satellite}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Satellite Offices</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'simple' ? (
                /* Simple Table View */
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                <tr>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Code</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Location Name</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Region</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Type</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredSources.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-medium text-slate-700 dark:text-slate-300">{s.code}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{s.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{s.address}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-slate-600 dark:text-slate-300">{s.region}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-slate-600 dark:text-slate-300">{s.contactPerson}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{s.contactPhone}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(s.type)}`}>
                                                {getTypeName(s.type)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all">
                                                <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Detailed Card View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSources.map(s => (
                        <div key={s.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer">
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-dash-blue to-cyan-500 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{s.name}</h3>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">{s.code}</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(s.type)}`}>
                                        {getTypeName(s.type)}
                                    </span>
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>{s.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Building className="w-4 h-4" />
                                        <span>{s.region}</span>
                                    </div>
                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                                        <p className="font-medium text-slate-700 dark:text-slate-300">{s.contactPerson}</p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                                <Phone className="w-3 h-3" /> {s.contactPhone}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TravelSources;
