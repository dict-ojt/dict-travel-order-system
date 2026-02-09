import React, { useState, useMemo } from 'react';
import { Plus, Search, MoreHorizontal, ArrowUpDown, Users, UserCheck, Building2 } from 'lucide-react';
import { employees, divisions, getDashboardStats, Employee as DbEmployee } from '../data/database';

const Employees: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof DbEmployee>('fullName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const stats = getDashboardStats();

  const divisionOptions = ['All', ...divisions.map(d => d.code)];

  const filteredEmployees = useMemo(() => {
    return employees
      .filter(emp => {
        const matchesSearch = emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDivision = divisionFilter === 'All' || emp.divisionCode === divisionFilter;
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

  const toggleSort = (field: keyof DbEmployee) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const activeCount = employees.filter(e => e.status === 'active').length;
  const onLeaveCount = employees.filter(e => e.status === 'on-leave').length;

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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div><p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalEmployees}</p><p className="text-xs text-slate-500">Total Employees</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-green-100 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div><p className="text-2xl font-bold text-slate-900 dark:text-white">{activeCount}</p><p className="text-xs text-slate-500">Active</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-amber-100 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div><p className="text-2xl font-bold text-slate-900 dark:text-white">{onLeaveCount}</p><p className="text-xs text-slate-500">On Leave</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div><p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalDivisions}</p><p className="text-xs text-slate-500">Divisions</p></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-dash-blue/30 focus:border-dash-blue outline-none transition-all"
          />
        </div>
        <select
          value={divisionFilter}
          onChange={e => setDivisionFilter(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 outline-none"
        >
          {divisionOptions.map(d => (<option key={d} value={d}>{d === 'All' ? 'All Divisions' : d}</option>))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th onClick={() => toggleSort('employeeId')} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="flex items-center gap-1">Employee ID <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th onClick={() => toggleSort('fullName')} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="flex items-center gap-1">Name <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th onClick={() => toggleSort('position')} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="flex items-center gap-1">Position <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th onClick={() => toggleSort('divisionCode')} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="flex items-center gap-1">Division <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-4"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">{emp.employeeId}</span></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.fullName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{emp.fullName}</p>
                        <p className="text-xs text-slate-500">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4"><span className="text-sm text-slate-600 dark:text-slate-300">{emp.position}</span></td>
                  <td className="py-3 px-4"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-medium">{emp.divisionCode}</span></td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${emp.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        emp.status === 'on-leave' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                          'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-green-500' : emp.status === 'on-leave' ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
                      {emp.status === 'active' ? 'Active' : emp.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4"><button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"><MoreHorizontal className="w-4 h-4 text-slate-400" /></button></td>
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