import React, { useState, useMemo } from 'react';
import { Plus, Search, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Employee } from '../types';

const Employees: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof Employee>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const employees: Employee[] = [
    { id: 'EMP-001', name: 'Alfonso, Maria L.', position: 'Director', division: 'MISS', status: 'Active' },
    { id: 'EMP-002', name: 'John Doe', position: 'Software Engineer', division: 'MISS', status: 'Active' },
    { id: 'EMP-003', name: 'Jane Smith', position: 'Admin Officer', division: 'Finance', status: 'Active' },
    { id: 'EMP-004', name: 'Robert Wilson', position: 'Security Analyst', division: 'MISS', status: 'Inactive' },
    { id: 'EMP-005', name: 'Alice Johnson', position: 'Legal Counsel', division: 'Legal', status: 'Active' },
    { id: 'EMP-006', name: 'Bernardo, Paolo', position: 'Planning Officer', division: 'PPMD', status: 'Active' }
  ];

  const filteredEmployees = useMemo(() => {
    return employees
      .filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDivision = divisionFilter === 'All' || emp.division === divisionFilter;
        return matchesSearch && matchesDivision;
      })
      .sort((a, b) => {
        const fieldA = String(a[sortField]).toLowerCase();
        const fieldB = String(b[sortField]).toLowerCase();
        if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [searchQuery, divisionFilter, sortField, sortOrder]);

  const toggleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const divisions = ['All', 'MISS', 'Finance', 'Legal', 'PPMD'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Employees</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage personnel directory and system access</p>
        </div>
        <button className="flex items-center gap-2 bg-dash-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all shadow-sm">
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-dash-blue/30 focus:border-dash-blue transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-dash-blue/30 transition-all"
            >
              {divisions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <span className="text-sm text-slate-500 dark:text-slate-400">{filteredEmployees.length} results</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm">
              <tr>
                <th className="px-6 py-3 font-medium cursor-pointer hover:text-dash-blue transition-colors" onClick={() => toggleSort('id')}>
                  <div className="flex items-center gap-2">ID <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-3 font-medium cursor-pointer hover:text-dash-blue transition-colors" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-2">Name <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-3 font-medium cursor-pointer hover:text-dash-blue transition-colors" onClick={() => toggleSort('division')}>
                  <div className="flex items-center gap-2">Division <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-3 font-medium text-center">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-slate-500 dark:text-slate-400">{emp.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{emp.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{emp.position}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{emp.division}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${emp.status === 'Active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                        {emp.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;