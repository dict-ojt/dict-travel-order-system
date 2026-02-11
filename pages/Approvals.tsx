import React, { useState } from 'react';
import { Search, Clock, CheckCircle2, XCircle, Timer, LayoutGrid, List, MapPin, Calendar, Route } from 'lucide-react';
import { Page } from '../types';
import { approvals, getDashboardStats, Approval, getTravelOrderById } from '../data/database';
import ApprovalDetails from './ApprovalDetails';

interface ApprovalsProps { 
  onNavigate?: (page: Page) => void;
  onSelectApproval?: (approval: Approval) => void;
}

const Approvals: React.FC<ApprovalsProps> = ({ onNavigate, onSelectApproval }) => {
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const stats = getDashboardStats();

  const filteredApprovals = approvals.filter(a => {
    const matchesSearch = a.requestorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getLegCount = (approval: Approval) => {
    const to = getTravelOrderById(approval.travelOrderId);
    return to?.legs?.length || 1;
  };

  const getStatusColor = (status: Approval['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const statsConfig = [
    { label: 'Pending', value: stats.pendingApprovals, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800', ring: 'ring-amber-500', filter: 'pending' as const },
    { label: 'Approved Today', value: stats.approvedToday, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-100 dark:border-green-800', ring: 'ring-green-500', filter: 'approved' as const },
    { label: 'Rejected Today', value: stats.rejectedToday, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-100 dark:border-red-800', ring: 'ring-red-500', filter: 'rejected' as const },
    { label: 'Avg. Response', value: '1.4d', icon: Timer, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800', ring: '', filter: null }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Approvals</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Review and process travel order requests</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button onClick={() => setViewMode('simple')} className={`p-2 rounded-md ${viewMode === 'simple' ? 'bg-white dark:bg-slate-700 shadow text-dash-blue' : 'text-slate-500'}`}><List className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('detailed')} className={`p-2 rounded-md ${viewMode === 'detailed' ? 'bg-white dark:bg-slate-700 shadow text-dash-blue' : 'text-slate-500'}`}><LayoutGrid className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search approvals..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
        </div>
        {statusFilter !== 'all' && (
          <button onClick={() => setStatusFilter('all')} className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors">
            Clear filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsConfig.map((s, i) => {
          const isActive = s.filter && statusFilter === s.filter;
          const isClickable = s.filter !== null;
          return (
            <div
              key={i}
              onClick={() => isClickable && setStatusFilter(s.filter === statusFilter ? 'all' : s.filter)}
              className={`bg-white dark:bg-slate-800 border ${s.border} rounded-xl p-4 transition-all ${isClickable ? 'cursor-pointer hover:shadow-md' : ''} ${isActive ? `ring-2 ${s.ring}` : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${s.bg} rounded-full flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
                <div><p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
              </div>
            </div>
          );
        })}
      </div>

      {viewMode === 'simple' ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredApprovals.map(a => (
              <div 
                key={a.id} 
                onClick={() => onSelectApproval?.(a)}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors grid grid-cols-[1fr_200px_100px_140px] items-center gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img src={a.requestorAvatar} alt={a.requestorName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{a.requestorName} <span className="text-slate-500">• {a.requestorDivision}</span></p>
                    <p className="text-xs text-slate-500 truncate">{a.purpose}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 space-y-0.5">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {getLegCount(a) > 1 ? `${getLegCount(a)} stops` : a.destination}
                    {getLegCount(a) > 1 && <span className="ml-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] rounded-full">Multi-leg</span>}
                  </p>
                  <p className="flex items-center gap-1.5"><Calendar className="w-3 h-3 flex-shrink-0" />{a.travelDate}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(a.status)}`}>{a.status}</span>
                <div className="flex gap-2 justify-end">
                  {a.status === 'pending' && <><button className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg">Approve</button><button className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg">Reject</button></>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApprovals.map(a => (
            <div 
              key={a.id} 
              onClick={() => onSelectApproval?.(a)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3"><img src={a.requestorAvatar} alt={a.requestorName} className="w-12 h-12 rounded-full" /><div><p className="text-sm font-semibold text-slate-900 dark:text-white">{a.requestorName}</p><p className="text-xs text-slate-500">{a.requestorDivision}</p></div></div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(a.status)}`}>{a.status}</span>
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">{a.purpose}</p>
              <div className="text-xs text-slate-500 space-y-1 mb-4">
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {getLegCount(a) > 1 ? `${getLegCount(a)} stops` : a.destination}
                </p>
                <p className="flex items-center gap-1"><Calendar className="w-3 h-3" />{a.travelDate}</p>
                {getLegCount(a) > 1 && (
                  <p className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                    <Route className="w-3 h-3" />Multi-leg journey
                  </p>
                )}
              </div>
              {a.status === 'pending' && <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-700"><button className="flex-1 py-2 bg-green-500 text-white text-xs rounded-lg">Approve</button><button className="flex-1 py-2 bg-red-500 text-white text-xs rounded-lg">Reject</button></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Approvals;