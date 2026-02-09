
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] dark:bg-dark-bg flex items-center justify-center p-4 transition-colors duration-500">
      <div className="max-w-md w-full bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-10 space-y-6 border border-slate-200 dark:border-dark-border relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-dash-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-dash-pink/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* DICT Seal */}
          <div className="w-24 h-24 mb-2">
            <img
              src="/assets/logo.png"
              className="w-full h-full object-contain drop-shadow-2xl"
              alt="DICT Seal"
            />
          </div>

          {/* DICT Official Banner */}
          <div className="flex items-center justify-center">
            <img
              src="/assets/dict.png"
              className="h-24 w-64 object-contain opacity-90"
              alt="DICT Banner"
            />
          </div>
        </div>

        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300 ml-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-dash-blue/30 focus:border-dash-blue transition-all text-sm"
                placeholder="User Identifier"
                defaultValue="admin@dict.gov.ph"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300 ml-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="block w-full pl-12 pr-12 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-dash-blue/30 focus:border-dash-blue transition-all text-sm"
                placeholder="••••••••"
                defaultValue="password123"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-dash-blue focus:ring-dash-blue border-slate-300 dark:border-dark-border rounded bg-white dark:bg-black"
              />
              <label htmlFor="remember-me" className="ml-2.5 block text-sm text-slate-600 dark:text-slate-300">Remember me</label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-dash-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          >
            Sign In
          </button>
        </form>

        <div className="relative z-10 pt-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 w-full">
            <div className="h-px bg-slate-200 dark:bg-slate-600 flex-1"></div>
            <span className="text-xs text-slate-400 dark:text-slate-500">Secure Access</span>
            <div className="h-px bg-slate-200 dark:bg-slate-600 flex-1"></div>
          </div>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
