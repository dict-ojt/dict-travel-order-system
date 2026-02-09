import React, { useState } from 'react';
import { Search, Plus, FileText, Check, Clock, X, LayoutGrid, Table as TableIcon, MoreHorizontal, MapPin, Calendar, Car } from 'lucide-react';
import { Page } from '../types';
import { travelOrders, getDashboardStats, TravelOrder } from '../data/database';

interface TravelOrdersProps { onNavigate?: (page: Page) => void; }

const TravelOrders: React.FC<TravelOrdersProps> = () => {
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');
  const [searchQuery, setSearchQuery] = useState('');
  const stats = getDashboardStats();

  const filteredOrders = travelOrders.filter(o =>
    o.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: TravelOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'completed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'cancelled': return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Travel Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage travel order requests and authorizations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button onClick={() => setViewMode('simple')} className={`p-2 rounded-md ${viewMode === 'simple' ? 'bg-white dark:bg-slate-700 shadow text-dash-blue' : 'text-slate-500'}`}><TableIcon className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('detailed')} className={`p-2 rounded-md ${viewMode === 'detailed' ? 'bg-white dark:bg-slate-700 shadow text-dash-blue' : 'text-slate-500'}`}><LayoutGrid className="w-4 h-4" /></button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-dash-blue text-white rounded-lg text-sm font-medium shadow-sm hover:bg-blue-600 transition-all"><Plus className="w-4 h-4" /> New Travel Order</button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search travel orders..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center"><FileText className="w-6 h-6 text-slate-600 dark:text-slate-400" /></div>
          <div><p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalOrders}</p><p className="text-xs text-slate-500">Total Orders</p></div>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-green-100 dark:border-green-800 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center"><Check className="w-6 h-6 text-green-600 dark:text-green-400" /></div>
          <div><p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.approvedOrders}</p><p className="text-xs text-slate-500">Approved</p></div>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-amber-100 dark:border-amber-800 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center"><Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" /></div>
          <div><p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pendingOrders}</p><p className="text-xs text-slate-500">Pending</p></div>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center"><Check className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
          <div><p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completedOrders}</p><p className="text-xs text-slate-500">Completed</p></div>
        </div>
      </div>

      {viewMode === 'simple' ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Order #</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Employee</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Destination</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Travel Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-medium">{o.orderNumber}</span></td>
                    <td className="py-3 px-4"><div className="flex items-center gap-2"><img src={o.employeeAvatar} className="w-6 h-6 rounded-full" alt={o.employeeName} /><span className="text-sm">{o.employeeName}</span></div></td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{o.destinationName}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{o.departureDate}</td>
                    <td className="py-3 px-4"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(o.status)}`}>{o.status}</span></td>
                    <td className="py-3 px-4"><button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><MoreHorizontal className="w-4 h-4 text-slate-400" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map(o => (
            <div key={o.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3"><img src={o.employeeAvatar} alt={o.employeeName} className="w-10 h-10 rounded-full" /><div><p className="text-sm font-semibold text-slate-900 dark:text-white">{o.employeeName}</p><p className="text-xs text-slate-500">{o.divisionCode}</p></div></div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(o.status)}`}>{o.status}</span>
              </div>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <p className="font-medium text-slate-800 dark:text-slate-200">{o.purpose}</p>
                <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /><span>{o.originName} → {o.destinationName}</span></div>
                <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /><span>{o.departureDate} - {o.returnDate}</span></div>
                <div className="flex items-center gap-2"><Car className="w-3 h-3" /><span>{o.vehicle} • {o.estimatedKm} km</span></div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500"><span>{o.orderNumber}</span><span>Created: {o.createdAt}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelOrders;