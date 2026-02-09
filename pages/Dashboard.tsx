import React from 'react';
import { Users, CheckCircle2, FileText, RefreshCcw, Clock, Eye, ChevronRight, User } from 'lucide-react';

interface DashboardProps {
  onSignOut?: () => void;
}

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <div className="space-y-8">
      {/* Top Colorful Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Employees', val: '87', sub: 'All registered employees', color: 'dash-orange', icon: Users },
          { label: 'Travel Orders Status', val: '32', sub: 'Completed: 27 | Rejected: 5', color: 'dash-green', icon: CheckCircle2 },
          { label: 'Total Travel Orders', val: '34', sub: 'Monthly: 15 | Yearly: 34', color: 'dash-pink', icon: FileText },
          { label: 'My Travel Workflows', val: '6', sub: 'Approvals: 1 | Active: 6', color: 'dash-cyan', icon: RefreshCcw },
        ].map((s, idx) => (
          <div key={idx} className={`stat-card-gradient bg-${s.color} rounded-lg p-5 text-white shadow-lg relative overflow-hidden group`}>
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
            <button className="text-sm font-medium text-dash-blue hover:text-blue-600 transition-colors">View All</button>
          </div>

          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-black/20 rounded-full flex items-center justify-center mb-4">
              <RefreshCcw className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No travel approvals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;