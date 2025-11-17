import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../types';

const CalendarView: React.FC = () => {
  const { events, selectedDate, setSelectedDate } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 月の最初の日の曜日を取得（日曜日 = 0）
  const firstDayOfWeek = monthStart.getDay();
  const emptyDays = Array(firstDayOfWeek).fill(null);

  const getEventsForDay = (day: Date) => {
    return events.filter((event) =>
      isSameDay(new Date(event.startDate), day)
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* カレンダーヘッダー */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {format(currentMonth, 'yyyy年 M月', { locale: ja })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
            >
              今日
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
            <div
              key={day}
              className={`text-center font-semibold py-2 ${
                index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* カレンダーグリッド */}
        <div className="grid grid-cols-7 gap-2">
          {/* 空白の日 */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* 日付 */}
          {daysInMonth.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isSelected = isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toString()}
                onClick={() => handleDayClick(day)}
                className={`aspect-square p-2 rounded-lg border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : isTodayDate
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`text-sm font-semibold mb-1 ${
                  isTodayDate ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => {
                    const category = CATEGORIES.find((c) => c.id === event.category);
                    return (
                      <div
                        key={event.id}
                        className="text-xs px-1 py-0.5 rounded truncate"
                        style={{ backgroundColor: category?.color + '40' }}
                        title={event.title}
                      >
                        {category?.icon} {event.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayEvents.length - 3}件
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* カテゴリ凡例 */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-700 mb-3">カテゴリ</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-2 p-2 rounded-lg"
              style={{ backgroundColor: category.color + '20' }}
            >
              <span className="text-2xl">{category.icon}</span>
              <div>
                <div className="font-medium text-sm">{category.name}</div>
                <div className="text-xs text-gray-600">{category.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
