import React, { useState } from 'react';
import {
    Search, Plus, Building2, Users, ChevronRight, Mail, Phone,
    LayoutGrid, Table as TableIcon, MoreHorizontal, Shield
} from 'lucide-react';
import { divisions, getDivisionStats, getEmployeesByDivision } from '../data/database';

const Divisions: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');

    const stats = getDivisionStats();

    const filteredDivisions = divisions.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.head.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Divisions</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage organizational divisions and units</p>
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
                        <Plus className="w-4 h-4" /> Add Division
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search divisions..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-dash-blue/30 focus:border-dash-blue outline-none transition-all"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-800 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Total Divisions</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-green-100 dark:border-green-800 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalPersonnel}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Total Personnel</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeUnits}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Active Units</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-800 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.avgTeamSize}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Avg. Team Size</p>
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
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Division Name</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Head</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Employees</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredDivisions.map(d => (
                                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-medium text-slate-700 dark:text-slate-300">{d.code}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{d.name}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <img src={d.headAvatar} className="w-6 h-6 rounded-full object-cover" alt={d.head} />
                                                <span className="text-sm text-slate-600 dark:text-slate-300">{d.head}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-slate-600 dark:text-slate-300">{d.employeeCount}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${d.status === 'active'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${d.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                                {d.status === 'active' ? 'Active' : 'Inactive'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDivisions.map(d => (
                        <div key={d.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer">
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-dash-blue to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                            {d.code}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{d.name}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{d.description}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.status === 'active'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                        }`}>
                                        {d.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg mb-4">
                                    <img src={d.headAvatar} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-700" alt={d.head} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{d.head}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{d.headPosition}</p>
                                    </div>
                                    <Shield className="w-4 h-4 text-dash-blue" />
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Users className="w-4 h-4" />
                                        <span>{d.employeeCount} employees</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Mail className="w-4 h-4" />
                                        <span className="truncate">{d.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 col-span-2">
                                        <Phone className="w-4 h-4" />
                                        <span>{d.phone}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <span className="text-xs text-slate-500 dark:text-slate-400">View details</span>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Divisions;
