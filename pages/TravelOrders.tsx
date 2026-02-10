import React, { useState } from 'react';
import { Search, Plus, FileText, Check, Clock, X, LayoutGrid, Table as TableIcon, MoreHorizontal, MapPin, Calendar, Car, Eye, Edit, Trash2 } from 'lucide-react';
import { Page } from '../types';
import { travelOrders, getDashboardStats, TravelOrder } from '../data/database';
import TravelOrderDetails from './TravelOrderDetails';

interface TravelOrdersProps {
  onNavigate?: (page: Page) => void;
  onEditOrder?: (orderId: string) => void;
}

const TravelOrders: React.FC<TravelOrdersProps> = ({ onNavigate, onEditOrder }) => {
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'completed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<TravelOrder | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const stats = getDashboardStats();

  const filteredOrders = travelOrders.filter(o => {
    const matchesSearch = o.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  if (selectedOrder) {
    return (
      <TravelOrderDetails
        order={selectedOrder}
        onNavigate={onNavigate || (() => { })}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

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
          <button
            onClick={() => onNavigate?.(Page.CREATE_TRAVEL_ORDER)}
            className="flex items-center gap-2 px-4 py-2.5 bg-dash-blue text-white rounded-lg text-sm font-medium shadow-sm hover:bg-blue-600 transition-all"
          >
            <Plus className="w-4 h-4" /> New Travel Order
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search travel orders..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
        </div>
        {statusFilter !== 'all' && (
          <button onClick={() => setStatusFilter('all')} className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors">
            Clear filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div onClick={() => setStatusFilter('all')} className={`bg-white dark:bg-slate-800 border rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all ${statusFilter === 'all' ? 'ring-2 ring-dash-blue border-dash-blue' : 'border-slate-100 dark:border-slate-700'}`}>
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center"><FileText className="w-6 h-6 text-slate-600 dark:text-slate-400" /></div>
          <div><p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalOrders}</p><p className="text-xs text-slate-500">Total Orders</p></div>
        </div>
        <div onClick={() => setStatusFilter('approved')} className={`bg-white dark:bg-slate-800 border rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all ${statusFilter === 'approved' ? 'ring-2 ring-green-500 border-green-500' : 'border-green-100 dark:border-green-800'}`}>
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center"><Check className="w-6 h-6 text-green-600 dark:text-green-400" /></div>
          <div><p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.approvedOrders}</p><p className="text-xs text-slate-500">Approved</p></div>
        </div>
        <div onClick={() => setStatusFilter('pending')} className={`bg-white dark:bg-slate-800 border rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all ${statusFilter === 'pending' ? 'ring-2 ring-amber-500 border-amber-500' : 'border-amber-100 dark:border-amber-800'}`}>
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center"><Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" /></div>
          <div><p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pendingOrders}</p><p className="text-xs text-slate-500">Pending</p></div>
        </div>
        <div onClick={() => setStatusFilter('completed')} className={`bg-white dark:bg-slate-800 border rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all ${statusFilter === 'completed' ? 'ring-2 ring-blue-500 border-blue-500' : 'border-blue-100 dark:border-blue-800'}`}>
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
                  <tr
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-medium">{o.orderNumber}</span></td>
                    <td className="py-3 px-4"><div className="flex items-center gap-2"><img src={o.employeeAvatar} className="w-6 h-6 rounded-full" alt={o.employeeName} /><span className="text-sm">{o.employeeName}</span></div></td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{o.destinationName}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{o.departureDate}</td>
                    <td className="py-3 px-4"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(o.status)}`}>{o.status}</span></td>
                    <td className="py-3 px-4 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionId(activeActionId === o.id ? null : o.id);
                        }}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-dash-blue"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {activeActionId === o.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionId(null);
                            }}
                          />
                          <div className="absolute right-0 top-10 z-20 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveActionId(null);
                                onNavigate?.(Page.CREATE_TRAVEL_ORDER);
                                onEditOrder?.(o.id);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                            >
                              <Edit className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveActionId(null);
                                if (window.confirm('Are you sure you want to delete this order?')) {
                                  // In a real app, delete logic here
                                  console.log('Deleted order', o.id);
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map(o => (
            <div
              key={o.id}
              onClick={() => setSelectedOrder(o)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer"
            >
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
