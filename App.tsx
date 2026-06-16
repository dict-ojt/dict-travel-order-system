import React, { useState, useEffect } from 'react';
import { Page, RouteLeg, TravelLeg, NormalizedLocation } from './types';
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
import RoutePicker from './pages/RoutePicker';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { currentUser } from './data/database';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('theme') as any) || 'system';
  });

  // Mobile sidebar drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // States for interactive route picker integration
  const [selectedRouteLeg, setSelectedRouteLeg] = useState<RouteLeg | null>(null);
  const [previousLegForNext, setPreviousLegForNext] = useState<RouteLeg | null>(null);
  const [isReturnLeg, setIsReturnLeg] = useState(false);
  const [returnEndPoint, setReturnEndPoint] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [editingLegData, setEditingLegData] = useState<{
    leg: TravelLeg;
    startPoint: { name: string; lat: number; lng: number };
    endPoint: { name: string; lat: number; lng: number };
    waypoints: Array<{ name: string; lat: number; lng: number }>;
  } | null>(null);
  const [editingLegId, setEditingLegId] = useState<string | null>(null);

  // Lifted CreateTravelOrder state to preserve inputs when navigating to RoutePicker
  const [baseOrigin, setBaseOrigin] = useState<NormalizedLocation | null>(null);
  const [legs, setLegs] = useState<TravelLeg[]>([]);
  const [travelers, setTravelers] = useState<Array<{ id: string; employeeId: string }>>([
    { id: '1', employeeId: currentUser.id }
  ]);
  const [fundSource, setFundSource] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [expenses, setExpenses] = useState<string[]>([]);
  const [approvalSteps, setApprovalSteps] = useState('');
  const [purpose, setPurpose] = useState('');
  const [remarks, setRemarks] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const resetTravelOrderData = () => {
    setBaseOrigin(null);
    setLegs([]);
    setSelectedRouteLeg(null);
    setPreviousLegForNext(null);
    setIsReturnLeg(false);
    setReturnEndPoint(null);
    setEditingLegData(null);
    setEditingLegId(null);
    setEditingOrderId(null);
    setTravelers([{ id: '1', employeeId: currentUser.id }]);
    setFundSource('');
    setVehicle('');
    setExpenses([]);
    setApprovalSteps('');
    setPurpose('');
    setRemarks('');
    setUploadedFiles([]);
  };

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
      case Page.CREATE_TRAVEL_ORDER: return (
        <CreateTravelOrder
          onNavigate={setCurrentPage}
          editingOrderId={editingOrderId}
          onClearEdit={() => setEditingOrderId(null)}
          baseOrigin={baseOrigin}
          setBaseOrigin={setBaseOrigin}
          legs={legs}
          setLegs={setLegs}
          travelers={travelers}
          setTravelers={setTravelers}
          fundSource={fundSource}
          setFundSource={setFundSource}
          vehicle={vehicle}
          setVehicle={setVehicle}
          expenses={expenses}
          setExpenses={setExpenses}
          approvalSteps={approvalSteps}
          setApprovalSteps={setApprovalSteps}
          purpose={purpose}
          setPurpose={setPurpose}
          remarks={remarks}
          setRemarks={setRemarks}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          onResetData={resetTravelOrderData}
          initialRouteLeg={selectedRouteLeg}
          onClearRouteLeg={() => setSelectedRouteLeg(null)}
          onOpenRoutePicker={(prevLeg, isReturn, returnEndPoint, editingLeg) => {
            setPreviousLegForNext(prevLeg);
            setIsReturnLeg(isReturn || false);
            setReturnEndPoint(returnEndPoint || null);
            setEditingLegData(editingLeg || null);
            if (editingLeg) {
              setEditingLegId(editingLeg.leg.id);
            }
            setCurrentPage(Page.ROUTE_PICKER);
          }}
          editingLegId={editingLegId}
          onClearEditingState={() => {
            setEditingLegId(null);
            setEditingLegData(null);
          }}
        />
      );
      case Page.ROUTE_PICKER: return (
        <RoutePicker
          onNavigate={setCurrentPage}
          onSelectLeg={(leg) => setSelectedRouteLeg(leg)}
          initialStartPoint={editingLegData ? editingLegData.startPoint : (previousLegForNext?.toLocation || null)}
          onClearInitialStartPoint={() => {
            setPreviousLegForNext(null);
            setIsReturnLeg(false);
            setReturnEndPoint(null);
          }}
          initialEndPoint={editingLegData ? editingLegData.endPoint : returnEndPoint}
          initialWaypoints={editingLegData ? editingLegData.waypoints : null}
          lockStartPoint={!editingLegData && !!previousLegForNext?.toLocation?.name}
          lockEndPoint={!editingLegData && !!returnEndPoint?.name}
          isReturnLeg={isReturnLeg}
        />
      );
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
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={(page) => {
          setCurrentPage(page);
          setIsSidebarOpen(false); // Close sidebar on mobile page change
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Backdrop overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onLogout={() => setIsLoggedIn(false)}
          theme={theme}
          setTheme={setTheme}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;