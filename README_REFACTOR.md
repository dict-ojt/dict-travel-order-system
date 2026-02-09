# DICT Travel Order System - Refactoring Documentation

## Centralized Data Architecture

This update introduces a centralized, client-side database (`src/data/database.ts`) to manage application state and ensure data consistency across all pages.

### Key Changes:

1.  **Centralized Data Store (`data/database.ts`)**:
    -   Defines TypeScript interfaces for `Division`, `Employee`, `TravelSource`, `TravelOrder`, and `Approval`.
    -   Populates mock data for all entities (Divisions, Employees, Locations, Orders, Approvals).
    -   Provides helper functions for data access (e.g., `getDashboardStats`, `getDivisionStats`, `getLocationCounts`, `getTravelOrdersByDate`).
    -   Exports a `currentUser` object representing the logged-in user session.

2.  **Page Updates**:
    -   **Dashboard**: Now fetches live stats and recent approvals from the database. Stat cards are interactive and navigate to respective modules.
    -   **Divisions**: Displays division data and computed stats from the database.
    -   **Travel Sources**: Lists locations and travel sources from the database.
    -   **Employees**: Manages employee records using the centralized `employees` array.
    -   **Travel Orders**: Lists travel orders with filtering and detailed views.
    -   **Approvals**: Manages travel order approvals with consistent data.
    -   **Travel Workflows**: Uses `currentUser` and `travelSources` for consistent defaults.
    -   **Calendar**: dynamically generates calendar views based on travel order dates.
    -   **Settings (Users)**: Lists system users (employees) with role and status information.
    -   **Sidebar**: Displays the current user's profile information dynamically.

3.  **Navigation**:
    -   Dashboard stat cards are now clickable and navigate to the relevant pages (`Employees`, `Approvals`, `Travel Orders`, `Travel Workflows`).

4.  **Consistency**:
    -   All pages now reference the same source of truth for labels, IDs, and data structures.
    -   Dates have been updated to the current year (2026) for relevance.

### Running the Application

Ensure you have dependencies installed:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified by Vite).
