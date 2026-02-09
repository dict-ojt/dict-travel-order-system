import React from 'react';
import {
  Check, X, Clock,
  ArrowRight, User,
  MoreVertical, Search,
  Map as MapIcon, Download
} from 'lucide-react';

const Approvals: React.FC = () => {
  const pendingApprovals = [
    {
      id: 'ORD-10290',
      requester: 'Reyes, Elena S.',
      origin: 'QC Hub',
      dest: 'Baguio TC',
      date: 'Feb 23, 2026',
      unit: 'Finance & Planning',
      priority: 'High',
      desc: 'Annual Regional IT Infrastructure Audit'
    },
    {
      id: 'ORD-10293',
      requester: 'Miller, David K.',
      origin: 'Manila HQ',
      dest: 'Cebu RO',
      date: 'Feb 25, 2026',
      unit: 'Technical Operations',
      priority: 'Medium',
      desc: 'FOC Cable Deployment Supervisor'
    },
    {
      id: 'ORD-10295',
      requester: 'Santos, Mark A.',
      origin: 'Clark Hub',
      dest: 'Vigan Site',
      date: 'Feb 26, 2026',
      unit: 'Field Support',
      priority: 'Normal',
      desc: 'LGU Connect Maintenance Visit'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Approvals</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {pendingApprovals.length} pending travel orders waiting for your approval
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-dash-blue/30 text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {pendingApprovals.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-slate-400 dark:text-slate-500">ID</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.id.split('-')[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white">{item.requester}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          item.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{item.desc}</p>
                    <div className="flex items-center flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {item.unit}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {item.date}</span>
                      <span className="flex items-center gap-1.5 text-dash-blue"><MapIcon className="w-3.5 h-3.5" /> {item.origin} <ArrowRight className="w-3 h-3" /> {item.dest}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-700 pt-4 md:pt-0">
                  <button className="flex-1 md:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button className="flex-1 md:flex-none px-4 py-2 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-2">
                    <X className="w-4 h-4" /> Deny
                  </button>
                  <button className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-500">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Metrics</h3>

          {/* Card 1: Average Turnaround */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl shadow-sm">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">1.4</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">days</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Average Turnaround</p>
          </div>

          {/* Card 2: SLA Compliance */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl shadow-sm">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">92</span>
              <span className="text-lg text-slate-400">%</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">SLA Compliance</p>
          </div>

          {/* Download Button */}
          <button className="w-full bg-dash-blue hover:bg-blue-600 text-white py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Approvals;