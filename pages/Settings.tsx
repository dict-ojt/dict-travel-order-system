import React, { useState } from 'react';
import { Page } from '../types';
import { Plus, ChevronRight, UserCog, Mail, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { employees } from '../data/database';

interface SettingsProps {
  type: Page;
}

const Settings: React.FC<SettingsProps> = ({ type }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getMeta = () => {
    switch (type) {
      case Page.USERS: return { title: "IAM Management", desc: "System-wide Identity and Access Management for personnel." };
      default: return { title: "System Module", desc: "Configuration parameters." };
    }
  };

  const meta = getMeta();

  const filteredUsers = employees.filter(e =>
    e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-slate-700 pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{meta.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{meta.desc}</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-dash-blue/50"
          />
          <button className="px-4 py-2 bg-dash-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            Add User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-50">
              <Shield className="w-16 h-16 text-slate-50 dark:text-slate-700/50 -mr-4 -mt-4 transform rotate-12" />
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <img src={user.avatar} alt={user.fullName} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${user.status === 'active'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                  {user.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">{user.fullName}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{user.position} • {user.divisionCode}</p>

              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <UserCog className="w-3.5 h-3.5" />
                  <span>System Role: {user.position.includes('Director') ? 'Administrator' : 'Standard User'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;