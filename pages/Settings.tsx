import React from 'react';
import { Page } from '../types';
import { Plus, ChevronRight } from 'lucide-react';

interface SettingsProps {
  type: Page;
}

const Settings: React.FC<SettingsProps> = ({ type }) => {
  const getMeta = () => {
    switch (type) {
      case Page.DIVISIONS: return { title: "Organizational Units", desc: "Manage hierarchy of technical and administrative divisions." };
      case Page.TRAVEL_SOURCES: return { title: "Location Hubs", desc: "Global registry of DICT Regional and Provincial offices." };
      case Page.TRAVEL_WORKFLOWS: return { title: "Workflow Definitions", desc: "Logic for approval routing and digital signature requirements." };
      case Page.USERS: return { title: "IAM Management", desc: "System-wide Identity and Access Management for personnel." };
      default: return { title: "System Module", desc: "Configuration parameters." };
    }
  };

  const meta = getMeta();

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-700 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{meta.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{meta.desc}</p>
        </div>
        <button className="px-4 py-2 bg-dash-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-all flex items-center gap-2">
          <Plus className="w-3.5 h-3.5" />
          Add New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex justify-between items-center hover:border-dash-blue transition-all cursor-pointer shadow-sm">
            <div className="flex items-center gap-6">
              <div className="text-xs font-mono text-slate-400 dark:text-slate-500 group-hover:text-dash-blue">REF-00{i}</div>
              <div>
                <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Master Record Configuration {i}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Operational metadata for system indexing.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Last Sync: Today</span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;