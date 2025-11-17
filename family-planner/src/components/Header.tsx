import React from 'react';
import { Calendar, List, BarChart3, PieChart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ViewMode } from '../types';

const Header: React.FC = () => {
  const { viewMode, setViewMode } = useApp();

  const viewButtons: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'calendar', icon: <Calendar className="w-5 h-5" />, label: 'カレンダー' },
    { mode: 'gantt', icon: <BarChart3 className="w-5 h-5" />, label: 'ガントチャート' },
    { mode: 'list', icon: <List className="w-5 h-5" />, label: 'リスト' },
    { mode: 'dashboard', icon: <PieChart className="w-5 h-5" />, label: '統計' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ・タイトル */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">👨‍👩‍👧‍👦</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Family Planner
              </h1>
              <p className="text-xs text-gray-500">育児計画管理アプリ</p>
            </div>
          </div>

          {/* ビュー切替ボタン */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {viewButtons.map((btn) => (
              <button
                key={btn.mode}
                onClick={() => setViewMode(btn.mode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === btn.mode
                    ? 'bg-white shadow-md text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {btn.icon}
                <span className="hidden sm:inline font-medium">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
