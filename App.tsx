import React, { useState, useEffect } from 'react';
import { Page, RouteLeg } from './types';
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
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('theme') as any) || 'system';
  });
  const [selectedRouteLeg, setSelectedRouteLeg] = useState<RouteLeg | null>(null);
  const [previousLegForNext, setPreviousLegForNext] = useState<RouteLeg | null>(null);
  const [isReturnLeg, setIsReturnLeg] = useState(false);
  const [returnEndPoint, setReturnEndPoint] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [editingLegData, setEditingLegData] = useState<{
    leg: any, 
    startPoint: { name: string; lat: number; lng: number },
    endPoint: { name: string; lat: number; lng: number },
    waypoints: Array<{ name: string; lat: number; lng: number }>
  } | null>(null);
  const [editingLegId, setEditingLegId] = useState<string | null>(null);
  const [travelLegs, setTravelLegs] = useState<Array<{
    id: string;
    fromLocationId: string;
    toLocationId: string;
    startDate: string;
    endDate: string;
    distanceKm: number;
    isReturn: boolean;
    fromLocationName?: string;
    toLocationName?: string;
    fromLat?: number;
    fromLng?: number;
    toLat?: number;
    toLng?: number;
    waypoints?: Array<{ name: string; lat: number; lng: number }>;
  }>>([]);

  const [travelerList, setTravelerList] = useState<Array<{ id: string; employeeId: string }>>([
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
    setTravelLegs([]);
    setSelectedRouteLeg(null);
    setPreviousLegForNext(null);
    setIsReturnLeg(false);
    setReturnEndPoint(null);
    setEditingLegData(null);
    setEditingLegId(null);
    
    // Reset lifted states
    setTravelerList([{ id: '1', employeeId: currentUser.id }]);
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
      case Page.TRAVEL_ORDERS: return <TravelOrders onNavigate={setCurrentPage} onResetData={resetTravelOrderData} />;
      case Page.CREATE_TRAVEL_ORDER: return (
        <CreateTravelOrder 
          onNavigate={setCurrentPage} 
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
          legs={travelLegs}
          setLegs={setTravelLegs}
          editingLegId={editingLegId}
          onClearEditingState={() => {
            setEditingLegId(null);
            setEditingLegData(null);
          }}
          travelers={travelerList}
          setTravelers={setTravelerList}
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
            // Don't clear editing data here, let CreateTravelOrder handle it on success
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