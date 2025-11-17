import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, differenceInDays, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../types';
import type { Event } from '../types';

const GanttView: React.FC = () => {
  const { events } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // イベントの位置とサイズを計算
  const getEventPosition = (event: Event) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;

    // 月の範囲内でのイベントの開始日と終了日を計算
    const start = eventStart < monthStart ? monthStart : eventStart;
    const end = eventEnd > monthEnd ? monthEnd : eventEnd;

    if (end < monthStart || start > monthEnd) {
      return null; // このイベントは表示範囲外
    }

    const startDay = differenceInDays(start, monthStart);
    const duration = Math.max(1, differenceInDays(end, start) + 1);

    return { startDay, duration };
  };

  // カテゴリごとにイベントをグループ化
  const eventsByCategory = CATEGORIES.map((category) => ({
    category,
    events: events.filter((e) => e.category === category.id),
  }));

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {format(currentMonth, 'yyyy年 M月', { locale: ja })} のガントチャート
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
      </div>

      {/* ガントチャート */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* 日付ヘッダー */}
            <div className="flex border-b-2 border-gray-300 bg-gradient-to-r from-pink-50 to-purple-50">
              <div className="w-48 p-3 font-semibold text-gray-700 border-r-2 border-gray-300 flex items-center">
                カテゴリ
              </div>
              <div className="flex flex-1">
                {daysInMonth.map((day) => {
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  const isToday = isSameDay(day, new Date());
                  return (
                    <div
                      key={day.toString()}
                      className={`flex-1 min-w-[40px] p-2 text-center border-r border-gray-200 ${
                        isToday
                          ? 'bg-blue-100 font-bold'
                          : isWeekend
                          ? 'bg-gray-50'
                          : ''
                      }`}
                    >
                      <div className={`text-xs ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                        {format(day, 'E', { locale: ja })}
                      </div>
                      <div className={`text-sm font-semibold ${
                        isToday
                          ? 'text-blue-600'
                          : isWeekend
                          ? 'text-gray-500'
                          : 'text-gray-800'
                      }`}>
                        {format(day, 'd')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* カテゴリとイベント */}
            {eventsByCategory.map(({ category, events: categoryEvents }) => (
              <div key={category.id} className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors">
                {/* カテゴリラベル */}
                <div
                  className="w-48 p-3 border-r-2 border-gray-300 flex items-center gap-2"
                  style={{ backgroundColor: category.color + '15' }}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <div className="font-semibold text-sm">{category.name}</div>
                    <div className="text-xs text-gray-600">
                      {categoryEvents.length}件
                    </div>
                  </div>
                </div>

                {/* タイムラインエリア */}
                <div className="flex-1 relative" style={{ height: '60px' }}>
                  <div className="absolute inset-0 flex">
                    {daysInMonth.map((day) => {
                      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                      const isToday = isSameDay(day, new Date());
                      return (
                        <div
                          key={day.toString()}
                          className={`flex-1 min-w-[40px] border-r border-gray-200 ${
                            isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50' : ''
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* イベントバー */}
                  <div className="absolute inset-0 p-1">
                    {categoryEvents.map((event, index) => {
                      const position = getEventPosition(event);
                      if (!position) return null;

                      const { startDay, duration } = position;
                      const dayWidth = 100 / daysInMonth.length;
                      const left = startDay * dayWidth;
                      const width = duration * dayWidth;

                      return (
                        <div
                          key={event.id}
                          className="absolute rounded-full px-2 py-1 text-xs font-medium text-white shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                            top: `${(index % 2) * 50}%`,
                            height: '45%',
                            backgroundColor: category.color,
                          }}
                          title={`${event.title}\n${format(new Date(event.startDate), 'M/d', { locale: ja })}${
                            event.endDate ? ` - ${format(new Date(event.endDate), 'M/d', { locale: ja })}` : ''
                          }`}
                        >
                          <div className="truncate flex items-center gap-1 h-full">
                            <span>{category.icon}</span>
                            <span>{event.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* 空の状態 */}
            {events.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-lg">まだ予定がありません</p>
                <p className="text-sm">カレンダービューから予定を追加してみましょう！</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 説明 */}
      <div className="mt-4 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">💡 ガントチャートの見方：</span>
          各カテゴリの予定が横棒で表示されます。長さは期間を表し、色はカテゴリを表します。
          マウスを乗せると詳細が表示されます。
        </p>
      </div>
    </div>
  );
};

export default GanttView;
