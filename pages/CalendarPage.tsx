import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, User, Calendar as CalendarIcon } from 'lucide-react';
import { travelOrders } from '../data/database';

interface DayData {
  day: number;
  events: {
    id: string;
    requester: string;
    origin: string;
    destination: string;
    purpose: string;
    status: 'Approved' | 'Pending' | 'Completed' | 'Rejected' | 'cancelled';
  }[];
  isToday: boolean;
  dateStr: string;
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date('2026-02-09')); // Fixed to match system time for demo
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    // Select today by default
    const today = new Date();
    const todayData = getDayData(today.getDate());
    if (todayData) setSelectedDay(todayData);
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getDayData = (day: number): DayData => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;

    // Find events for this day
    const events = travelOrders
      .filter(o => o.departureDate === dateStr || o.returnDate === dateStr)
      .map(o => ({
        id: o.orderNumber,
        requester: o.employeeName,
        origin: o.originName.split(' - ')[0], // Simplify name
        destination: o.destinationName.split(' - ')[0],
        purpose: o.purpose,
        status: o.status === 'approved' ? 'Approved' :
          o.status === 'completed' ? 'Completed' :
            o.status === 'rejected' ? 'Rejected' :
              o.status === 'cancelled' ? 'cancelled' : 'Pending'
      })) as any[];

    const today = new Date();
    const isToday =
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear();

    return {
      day,
      events,
      isToday,
      dateStr
    };
  };

  const calendarData: DayData[] = [];
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Add empty slots for previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    // We can handle empty slots in the render
  }

  // Generate days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarData.push(getDayData(i));
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
      case 'Completed': return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default: return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const getEventDotColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500';
      case 'Completed': return 'bg-blue-500';
      case 'Pending': return 'bg-amber-500';
      case 'Rejected': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };

  const getCardAccentColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'border-l-emerald-500';
      case 'Completed': return 'border-l-blue-500';
      case 'Pending': return 'border-l-amber-500';
      case 'Rejected': return 'border-l-red-500';
      default: return 'border-l-slate-400';
    }
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
    setSelectedDay(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Click on any day to view scheduled travel orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-600"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-5 py-2.5 bg-dash-blue text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-all shadow-sm"
          >
            Today
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-600"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-4 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {/* Empty cells for previous month */}
          {[...Array(firstDayOfMonth)].map((_, i) => (
            <div key={`empty-${i}`} className="bg-slate-50/50 dark:bg-slate-900/30 min-h-[110px] border-b border-r border-slate-100 dark:border-slate-700"></div>
          ))}

          {/* Days */}
          {calendarData.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedDay(item)}
              className={`min-h-[110px] p-3 cursor-pointer transition-all border-b border-r border-slate-100 dark:border-slate-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 ${selectedDay?.day === item.day ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`flex items-center justify-center w-8 h-8 text-sm rounded-full transition-colors ${item.isToday
                  ? 'bg-dash-blue text-white font-semibold shadow-sm'
                  : selectedDay?.day === item.day
                    ? 'bg-blue-100 text-dash-blue font-medium dark:bg-blue-900/50 dark:text-blue-300'
                    : 'text-slate-600 dark:text-slate-400'
                  }`}>
                  {item.day}
                </span>
                {item.events.length > 0 && (
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 w-5 h-5 rounded-full flex items-center justify-center">
                    {item.events.length}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {item.events.slice(0, 2).map((event, eIdx) => (
                  <div key={eIdx} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getEventDotColor(event.status)}`}></span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{event.requester.split(' ')[0]}</span>
                  </div>
                ))}
                {item.events.length > 2 && (
                  <span className="text-xs text-dash-blue dark:text-blue-400 font-medium pl-3.5">
                    +{item.events.length - 2} more
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Empty cells for next month (fill remaining grid) */}
          {[...Array(42 - (firstDayOfMonth + daysInMonth))].map((_, i) => (
            <div key={`next-${i}`} className="bg-slate-50/50 dark:bg-slate-900/30 min-h-[110px] border-b border-r border-slate-100 dark:border-slate-700"></div>
          ))}
        </div>
      </div>

      {/* Day Details Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {selectedDay ? (
          <>
            {/* Panel Header with Gradient */}
            <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-dash-blue rounded-xl flex items-center justify-center shadow-sm">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {new Date(selectedDay.dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedDay.events.length} travel order{selectedDay.events.length !== 1 ? 's' : ''} scheduled
                  </p>
                </div>
              </div>
            </div>

            {/* Panel Content */}
            <div className="p-5">
              {selectedDay.events.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">No travel orders scheduled for this day</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDay.events.map((event) => (
                    <div
                      key={event.id}
                      className={`p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 border-l-4 ${getCardAccentColor(event.status)} hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm font-medium text-dash-blue">{event.id}</p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-white mt-0.5">{event.requester}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(event.status)}`}>
                          {event.status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span>{event.origin}</span>
                          <span className="text-slate-300 dark:text-slate-600">→</span>
                          <span>{event.destination}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span>{event.purpose}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-14">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-slate-700 dark:to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-dash-blue dark:text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400">Select a day from the calendar to view travel orders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
