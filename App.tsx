import React, { useState, useEffect } from 'react';
import { Page } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import TravelOrders from './pages/TravelOrders';
import TravelWorkflows from './pages/TravelWorkflows';
import Approvals from './pages/Approvals';
import CalendarPage from './pages/CalendarPage';
import Divisions from './pages/Divisions';
import TravelSources from './pages/TravelSources';
import CreateTravelOrder from './pages/CreateTravelOrder';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('theme') as any) || 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem('theme', theme);

    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.DASHBOARD: return <Dashboard onSignOut={() => setIsLoggedIn(false)} onNavigate={setCurrentPage} />;
      case Page.EMPLOYEES: return <Employees />;
      case Page.TRAVEL_ORDERS: return <TravelOrders
        onNavigate={setCurrentPage}
        onEditOrder={(id) => {
          setEditingOrderId(id);
          setCurrentPage(Page.CREATE_TRAVEL_ORDER);
        }}
      />;
      case Page.CREATE_TRAVEL_ORDER: return <CreateTravelOrder
        onNavigate={setCurrentPage}
        editingOrderId={editingOrderId}
        onClearEdit={() => setEditingOrderId(null)}
      />;
      case Page.TRAVEL_WORKFLOWS: return <TravelWorkflows />;
      case Page.APPROVALS: return <Approvals onNavigate={setCurrentPage} />;
      case Page.CALENDAR: return <CalendarPage />;
      case Page.DIVISIONS: return <Divisions />;
      case Page.TRAVEL_SOURCES: return <TravelSources />;
      case Page.USERS:
        return <Settings type={currentPage} />;
      default: return <Dashboard onSignOut={() => setIsLoggedIn(false)} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#fcfdfe] dark:bg-dark-bg overflow-hidden font-sans">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onLogout={() => setIsLoggedIn(false)}
          theme={theme}
          setTheme={setTheme}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;