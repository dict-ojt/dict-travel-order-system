import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarPage: React.FC = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarData = [
    { day: 1, entries: ['William Jones', 'Alexander Wright', '+ 1 more'], isToday: false },
    { day: 2, entries: ['Lucas Moore', 'Isabella White', '+ 2 more'], isToday: false },
    { day: 3, entries: ['Elena Rodriguez'], isToday: false },
    { day: 4, entries: ['Elena Rodriguez'], isToday: false },
    { day: 5, entries: ['Mia Anderson', 'Alexander Wright', '+ 1 more'], isToday: false },
    { day: 6, entries: [], isToday: true },
    { day: 7, entries: ['Michael Chen', 'Olivia Davis', '+ 2 more'], isToday: false },
    { day: 8, entries: ['David Miller', 'Elena Rodriguez', '+ 1 more'], isToday: false },
    { day: 9, entries: ['Sophie Thompson', 'Ethan Martin', '+ 1 more'], isToday: false },
    { day: 10, entries: ['Ethan Martin', 'Mia Anderson'], isToday: false },
    { day: 11, entries: ['Elena Rodriguez'], isToday: false },
    { day: 12, entries: ['William Jones'], isToday: false },
    { day: 13, entries: ['Olivia Davis', 'Alexander Wright'], isToday: false },
    { day: 14, entries: ['Olivia Davis', 'Lucas Moore', '+ 2 more'], isToday: false },
    { day: 15, entries: ['James Wilson', 'William Jones', '+ 1 more'], isToday: false },
    { day: 16, entries: ['Isabella White'], isToday: false },
    { day: 17, entries: ['William Jones', 'Elena Rodriguez'], isToday: false },
    { day: 18, entries: ['Alexander Wright', 'Emma Brown'], isToday: false },
    { day: 19, entries: ['Sarah Jenkins', 'William Jones'], isToday: false },
    { day: 20, entries: ['James Wilson', 'Michael Chen', '+ 1 more'], isToday: false },
    { day: 21, entries: ['Alexander Wright', 'Robert Taylor', '+ 2 more'], isToday: false },
    { day: 22, entries: ['Elena Rodriguez'], isToday: false },
    { day: 23, entries: ['William Jones'], isToday: false },
    { day: 24, entries: ['Olivia Davis'], isToday: false },
    { day: 25, entries: ['Lucas Moore'], isToday: false },
    { day: 26, entries: ['Ethan Martin'], isToday: false },
    { day: 27, entries: ['Mia Anderson'], isToday: false },
    { day: 28, entries: ['James Wilson'], isToday: false },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">February 2026</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">View and manage scheduled travel orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-600">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <button className="px-4 py-2 bg-dash-blue text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
            Today
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-600">
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-3 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-700">
          {calendarData.map((item, idx) => (
            <div key={idx} className="min-h-[130px] p-2 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className={`flex items-center justify-center w-7 h-7 text-sm rounded-full ${item.isToday
                    ? 'bg-dash-blue text-white font-medium'
                    : 'text-slate-600 dark:text-slate-400'
                  }`}>
                  {item.day}
                </span>
                {item.entries.length > 0 && (
                  <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                    {item.entries.length}
                  </span>
                )}
              </div>
              <div className="space-y-1 overflow-hidden">
                {item.entries.slice(0, 3).map((entry, eIdx) => (
                  <div key={eIdx} className="flex items-center gap-1.5 text-xs truncate">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${entry.startsWith('+') ? 'bg-slate-300 dark:bg-slate-600' :
                        eIdx % 2 === 0 ? 'bg-dash-blue' : 'bg-purple-500'
                      }`}></span>
                    <span className={`${entry.startsWith('+')
                        ? 'text-slate-500 dark:text-slate-400'
                        : 'text-slate-700 dark:text-slate-300'
                      }`}>
                      {entry}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Pad the rest */}
          {[...Array(7)].map((_, i) => (
            <div key={`empty-${i}`} className="bg-slate-50 dark:bg-slate-900/30 min-h-[130px]"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
