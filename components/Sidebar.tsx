
import React from 'react';
import {
  Home, Building2, MapPin, RefreshCcw,
  Users, CheckCircle2, FileText, UserCog, Calendar
} from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const menuGroups = [
    {
      title: 'Navigation',
      items: [
        { id: Page.DASHBOARD, label: 'Dashboard', icon: Home },
      ]
    },
    {
      title: 'Settings',
      items: [
        { id: Page.DIVISIONS, label: 'Divisions', icon: Building2 },
        { id: Page.TRAVEL_SOURCES, label: 'Travel Sources', icon: MapPin },
        { id: Page.TRAVEL_WORKFLOWS, label: 'Travel Workflows', icon: RefreshCcw },
      ]
    },
    {
      title: 'HR Management',
      items: [
        { id: Page.EMPLOYEES, label: 'Employees', icon: Users },
      ]
    },
    {
      title: 'Travel Management',
      items: [
        { id: Page.APPROVALS, label: 'Approvals', icon: CheckCircle2 },
        { id: Page.TRAVEL_ORDERS, label: 'Travel Orders', icon: FileText },
        { id: Page.CALENDAR, label: 'Calendar', icon: Calendar },
      ]
    },
    {
      title: 'Admin Management',
      items: [
        { id: Page.USERS, label: 'Users', icon: UserCog },
      ]
    }
  ];

  return (
    <div className="w-[240px] bg-white dark:bg-dark-sidebar border-r border-slate-200 dark:border-dark-border flex flex-col flex-shrink-0 h-full overflow-hidden transition-all duration-300">
      {/* Brand Header */}
      <div className="h-16 flex flex-row items-center justify-center px-4 border-b border-slate-100 dark:border-dark-border py-3 gap-3">
        <img
          src="/assets/logo.png"
          className="w-10 h-10 object-contain"
          alt="DICT Seal"
        />
        <img
          src="/assets/dict.png"
          className="h-8 object-contain opacity-90"
          alt="DICT"
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <h3 className="px-6 mb-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
              {group.title}
            </h3>
            <nav className="space-y-0.5">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center justify-between px-6 py-2.5 text-sm transition-all group ${currentPage === item.id
                    ? 'sidebar-item-active text-dash-blue font-semibold border-l-4'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-l-4 border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${currentPage === item.id ? 'text-dash-blue' : 'text-slate-400 dark:text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* User Status Bar */}
      <div className="p-4 bg-slate-50 dark:bg-black/20 border-t border-slate-100 dark:border-dark-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src="https://i.pravatar.cc/100?u=superadmin" className="w-8 h-8 rounded-full" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-dash-green border-2 border-white dark:border-dark-sidebar rounded-full"></div>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">Super Admin</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">DICT Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
