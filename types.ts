
export enum Page {
  DASHBOARD = 'dashboard',
  DIVISIONS = 'divisions',
  TRAVEL_SOURCES = 'travel_sources',
  TRAVEL_WORKFLOWS = 'travel_workflows',
  EMPLOYEES = 'employees',
  APPROVALS = 'approvals',
  TRAVEL_ORDERS = 'travel_orders',
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

export interface Division {
  id: string;
  name: string;
  head: string;
  memberCount: number;
}
