import React from 'react';
import { Page } from '../types';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const pageLabels: Record<Page, string> = {
  [Page.DASHBOARD]: 'Dashboard',
  [Page.DIVISIONS]: 'Divisions',
  [Page.TRAVEL_SOURCES]: 'Travel Sources',
  [Page.TRAVEL_WORKFLOWS]: 'Travel Workflows',
  [Page.EMPLOYEES]: 'Employees',
  [Page.APPROVALS]: 'Approvals',
  [Page.APPROVAL_DETAILS]: 'Approval Details',
  [Page.TRAVEL_ORDERS]: 'Travel Orders',
  [Page.TRAVEL_ORDER_DETAILS]: 'Travel Order Details',
  [Page.CREATE_TRAVEL_ORDER]: 'Create Travel Order',
  [Page.DASHBOARD_APPROVAL_DETAILS]: 'Approval Details',
  [Page.ROUTE_PICKER]: 'Route Picker',
  [Page.USERS]: 'Settings',
  [Page.CALENDAR]: 'Calendar',
};

const pageParents: Partial<Record<Page, Page>> = {
  [Page.TRAVEL_ORDER_DETAILS]: Page.TRAVEL_ORDERS,
  [Page.CREATE_TRAVEL_ORDER]: Page.TRAVEL_ORDERS,
  [Page.ROUTE_PICKER]: Page.CREATE_TRAVEL_ORDER,
  [Page.APPROVAL_DETAILS]: Page.APPROVALS,
  [Page.DASHBOARD_APPROVAL_DETAILS]: Page.DASHBOARD,
  // Other pages default to Dashboard as parent if we want, or just be top-level
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPage, onNavigate }) => {
  const getBreadcrumbs = () => {
    const breadcrumbs: Page[] = [];
    let current: Page | undefined = currentPage;

    while (current) {
      breadcrumbs.unshift(current);
      current = pageParents[current];
    }
    
    // If the first item is not Dashboard and it's a top-level page, 
    // we might want to prepend Dashboard? 
    // It depends on the design. Let's just stick to the explicit hierarchy for now.
    // However, since we have a Sidebar, maybe we don't need "Dashboard > Employees" if Employees is on the sidebar.
    // But "Travel Orders > Create Travel Order" is useful.

    // If the path is just one item (e.g. Dashboard, or Employees), do we show it?
    // Usually yes, to indicate where we are.
    
    return breadcrumbs;
  };

  const crumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <button 
            onClick={() => onNavigate(Page.DASHBOARD)}
            className={`flex items-center transition-colors ${
              currentPage === Page.DASHBOARD 
                ? 'font-medium text-slate-900 dark:text-slate-200 cursor-default' 
                : 'hover:text-brand-600 dark:hover:text-brand-400'
            }`}
            disabled={currentPage === Page.DASHBOARD}
          >
            <Home className="w-4 h-4" />
            <span className={currentPage === Page.DASHBOARD ? 'ml-2' : 'sr-only'}>Dashboard</span>
          </button>
        </li>
        
        {crumbs.map((page, index) => {
          // If it's the dashboard page appearing in the list (e.g. if we defined it as parent), skip it because we added the Home icon
          if (page === Page.DASHBOARD) return null;

          const isLast = index === crumbs.length - 1;
          
          return (
            <React.Fragment key={page}>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <li>
                <button
                  onClick={() => !isLast && onNavigate(page)}
                  disabled={isLast}
                  className={`
                    ${isLast 
                      ? 'font-medium text-slate-900 dark:text-slate-200 cursor-default' 
                      : 'hover:text-brand-600 dark:hover:text-brand-400 transition-colors'}
                  `}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {pageLabels[page]}
                </button>
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
