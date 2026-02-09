
import React from 'react';
import { LogOut, Sun, Moon, Laptop, Search } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, theme, setTheme }) => {
  return (
    <header className="h-12 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0 transition-colors">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-xs group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-dash-blue/30 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex bg-slate-100 dark:bg-slate-900 rounded p-0.5 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setTheme('light')}
            className={`p-1 rounded ${theme === 'light' ? 'bg-white dark:bg-slate-800 shadow-sm text-brand-600' : 'text-slate-500'}`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-1 rounded ${theme === 'dark' ? 'bg-white dark:bg-slate-800 shadow-sm text-brand-400' : 'text-slate-500'}`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`p-1 rounded ${theme === 'system' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-700 dark:text-slate-200' : 'text-slate-500'}`}
          >
            <Laptop className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-sm px-3 py-1"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
