import React from 'react';
import { Users, CheckCircle2, FileText, RefreshCcw } from 'lucide-react';
import { Page } from '../types';
import { getDashboardStats, employees, approvals, Approval } from '../data/database';

interface DashboardProps {
  onSignOut?: () => void;
  onNavigate?: (page: Page) => void;
  onSelectApproval?: (approval: Approval) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectApproval }) => {
  const stats = getDashboardStats();

  const statCards = [
    {
      label: 'Total Employees',
      val: stats.totalEmployees.toString(),
      sub: 'All registered employees',
      color: 'dash-orange',
      icon: Users,
      page: Page.EMPLOYEES
    },
    {
      label: 'Travel Orders Status',
      val: stats.totalOrders.toString(),
      sub: `Completed: ${stats.completedOrders} | Rejected: ${stats.rejectedOrders}`,
      color: 'dash-green',
      icon: CheckCircle2,
      page: Page.APPROVALS
    },
    {
      label: 'Total Travel Orders',
      val: stats.totalOrders.toString(),
      sub: `Approved: ${stats.approvedOrders} | Pending: ${stats.pendingOrders}`,
      color: 'dash-pink',
      icon: FileText,
      page: Page.TRAVEL_ORDERS
    },
    {
      label: 'My Travel Workflows',
      val: stats.activeWorkflows.toString(),
      sub: `Approvals: ${stats.pendingApprovals} | Active: ${stats.pendingOrders}`,
      color: 'dash-cyan',
      icon: RefreshCcw,
      page: Page.TRAVEL_WORKFLOWS
    },
  ];

  const handleCardClick = (page: Page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  // Get recent approved items from database
  const recentApprovals = approvals
    .filter(a => a.status === 'approved')
    .sort((a, b) => new Date(b.processedAt || 0).getTime() - new Date(a.processedAt || 0).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Top Colorful Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, idx) => (
          <div
            key={idx}
            onClick={() => handleCardClick(s.page)}
            className={`stat-card-gradient bg-${s.color} rounded-lg p-5 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:scale-[1.02] hover:shadow-xl transition-all duration-300`}
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-medium opacity-90">{s.label}</p>
                <s.icon className="w-5 h-5 opacity-40" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{s.val}</h3>
              <div className="flex items-center justify-between text-xs opacity-80">
                <span>{s.sub}</span>
                <div className="flex items-end gap-0.5 h-4">
                  {[3, 6, 4, 8].map((h, i) => (
                    <div key={i} className="w-0.5 bg-white/40" style={{ height: `${h * 10}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome Bar and Recent Content */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg shadow-sm overflow-hidden p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center text-white text-xl font-bold uppercase">
              MS
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Welcome</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Management Information Systems Service</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-border pb-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Recent Approvals</h3>
            <button
              onClick={() => onNavigate && onNavigate(Page.APPROVALS)}
              className="text-sm font-medium text-dash-blue hover:text-blue-600 transition-colors"
            >
              View All
            </button>
          </div>

          {recentApprovals.length > 0 ? (
            <div className="space-y-3">
              {recentApprovals.map((approval) => (
                <div 
                  key={approval.id} 
                  onClick={() => onSelectApproval?.(approval)}
                  className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <img
                    src={approval.requestorAvatar}
                    alt={approval.requestorName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{approval.requestorName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{approval.purpose}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {approval.processedAt ? new Date(approval.processedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                    </p>
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full">
                      Approved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-black/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No approved orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;