
export enum Page {
  DASHBOARD = 'dashboard',
  DIVISIONS = 'divisions',
  TRAVEL_SOURCES = 'travel_sources',
  TRAVEL_WORKFLOWS = 'travel_workflows',
  EMPLOYEES = 'employees',
  APPROVALS = 'approvals',
  APPROVAL_DETAILS = 'approval_details',
  TRAVEL_ORDERS = 'travel_orders',
  TRAVEL_ORDER_DETAILS = 'travel_order_details',
  CREATE_TRAVEL_ORDER = 'create_travel_order',
  DASHBOARD_APPROVAL_DETAILS = 'dashboard_approval_details',
  ROUTE_PICKER = 'route_picker',
  USERS = 'users',
  CALENDAR = 'calendar'
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  division: string;
  status: 'Active' | 'Inactive';
}

export interface TravelOrder {
  id: string;
  requester: string;
  origin: string;
  destination: string;
  distanceKm: number;
  vehicle: string;
  purpose: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  date: string;
  attachments?: string[];
  checklist: {
    label: string;
    completed: boolean;
  }[];
}

export interface RouteLeg {
  fromLocation: {
    name: string;
    lat: number;
    lng: number;
  };
  toLocation: {
    name: string;
    lat: number;
    lng: number;
  };
  distanceKm: number;
  durationMin: number;
  startDate?: string;
  endDate?: string;
  isReturn?: boolean;
  waypoints?: Array<{
    name: string;
    lat: number;
    lng: number;
  }>;
}

export interface Division {
  id: string;
  name: string;
  head: string;
  memberCount: number;
}
