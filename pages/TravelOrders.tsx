import React, { useState, useMemo } from 'react';
import {
  Search, Download, Plus, Check, X,
  ArrowRight, Clock, MoreHorizontal
} from 'lucide-react';
import { TravelOrder } from '../types';

const TravelOrders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const initialOrders: TravelOrder[] = [
    {
      id: 'ORD-10292', requester: 'Cruz, Maria L.', origin: 'DICT HQ', destination: 'Region VII Office',
      distanceKm: 572, vehicle: 'Public', purpose: 'Hardware Audit', status: 'Approved', date: '2026-02-24',
      checklist: []
    },
    {
      id: 'ORD-10291', requester: 'Santos, Juan P.', origin: 'DICT HQ', destination: 'Davao City',
      distanceKm: 984, vehicle: 'Official', purpose: 'LGU Coordination', status: 'Completed', date: '2026-02-23',
      checklist: []
    },
    {
      id: 'ORD-10290', requester: 'Reyes, Elena S.', origin: 'Quezon City', destination: 'Baguio TC',
      distanceKm: 245, vehicle: 'Official', purpose: 'IT Seminar', status: 'Pending', date: '2026-02-23',
      checklist: []
    },
    {
      id: 'ORD-10289', requester: 'Lopez, Arnold F.', origin: 'Manila', destination: 'Legazpi Office',
      distanceKm: 480, vehicle: 'Private', purpose: 'Network Repair', status: 'Rejected', date: '2026-02-22',
      checklist: []
    }
  ];

  const filteredOrders = useMemo(() => {
    return initialOrders.filter(o => {
      const matchesSearch = o.requester.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Travel Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and track travel order requests</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-dash-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-all shadow-sm">
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-dash-blue/30"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-dash-blue/30"
            >
              <option value="all">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
            <button className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-500">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Personnel</th>
                <th className="px-6 py-3 font-medium">Route</th>
                <th className="px-6 py-3 font-medium">Vehicle</th>
                <th className="px-6 py-3 font-medium text-center">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all">
                  <td className="px-6 py-4 text-sm font-medium text-dash-blue">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{order.requester}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{order.purpose}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span>{order.origin}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span>{order.destination}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{order.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-600 dark:text-slate-400">
                      {order.vehicle}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                      {order.status === 'Approved' || order.status === 'Completed' ? <Check className="w-3 h-3" /> :
                        order.status === 'Rejected' ? <X className="w-3 h-3" /> :
                          <Clock className="w-3 h-3" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all text-slate-400">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TravelOrders;