import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../types';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ja } from 'date-fns/locale';
import { TrendingUp, Calendar, Users, BarChart } from 'lucide-react';

const DashboardView: React.FC = () => {
  const { events, familyMembers } = useApp();

  // 今月の予定を取得
  const thisMonth = new Date();
  const monthInterval = {
    start: startOfMonth(thisMonth),
    end: endOfMonth(thisMonth),
  };

  const thisMonthEvents = useMemo(() =>
    events.filter(event =>
      isWithinInterval(new Date(event.startDate), monthInterval)
    ),
    [events, monthInterval.start, monthInterval.end]
  );

  // カテゴリごとの統計
  const categoryStats = useMemo(() => {
    return CATEGORIES.map(category => {
      const count = events.filter(e => e.category === category.id).length;
      const thisMonthCount = thisMonthEvents.filter(e => e.category === category.id).length;
      return { ...category, count, thisMonthCount };
    });
  }, [events, thisMonthEvents]);

  // 家族メンバーごとの統計
  const memberStats = useMemo(() => {
    return familyMembers.map(member => {
      const count = events.filter(e => e.familyMembers.includes(member.id)).length;
      const thisMonthCount = thisMonthEvents.filter(e => e.familyMembers.includes(member.id)).length;
      return { ...member, count, thisMonthCount };
    });
  }, [events, thisMonthEvents, familyMembers]);

  // 総予定数
  const totalEvents = events.length;
  const totalThisMonth = thisMonthEvents.length;

  // 最も多いカテゴリ
  const mostCategory = categoryStats.reduce((max, cat) =>
    cat.count > max.count ? cat : max, categoryStats[0] || { count: 0 }
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          📊 統計ダッシュボード
        </h2>
        <p className="text-gray-600 mt-2">あなたの予定を見える化</p>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 総予定数 */}
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm opacity-90">総予定数</div>
            <Calendar className="w-5 h-5 opacity-75" />
          </div>
          <div className="text-3xl font-bold">{totalEvents}</div>
          <div className="text-xs mt-2 opacity-75">すべての予定</div>
        </div>

        {/* 今月の予定 */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm opacity-90">今月の予定</div>
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <div className="text-3xl font-bold">{totalThisMonth}</div>
          <div className="text-xs mt-2 opacity-75">{format(thisMonth, 'M月', { locale: ja })}</div>
        </div>

        {/* カテゴリ数 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm opacity-90">カテゴリ</div>
            <BarChart className="w-5 h-5 opacity-75" />
          </div>
          <div className="text-3xl font-bold">{CATEGORIES.length}</div>
          <div className="text-xs mt-2 opacity-75">種類</div>
        </div>

        {/* 家族メンバー */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm opacity-90">家族メンバー</div>
            <Users className="w-5 h-5 opacity-75" />
          </div>
          <div className="text-3xl font-bold">{familyMembers.length}</div>
          <div className="text-xs mt-2 opacity-75">人</div>
        </div>
      </div>

      {/* カテゴリ別グラフ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">カテゴリ別予定数</h3>
          <div className="space-y-3">
            {categoryStats.map(cat => {
              const percentage = totalEvents > 0 ? (cat.count / totalEvents) * 100 : 0;
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-sm font-medium">{cat.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">{cat.count}件</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 家族メンバー別 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">メンバー別予定数</h3>
          <div className="space-y-3">
            {memberStats.map(member => {
              const percentage = totalEvents > 0 ? (member.count / totalEvents) * 100 : 0;
              return (
                <div key={member.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold">
                        {member.name[0]}
                      </div>
                      <span className="text-sm font-medium">{member.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">{member.count}件</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* インサイト */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-md p-6 border-l-4 border-yellow-400">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>💡</span>
          <span>インサイト</span>
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• 今月は{totalThisMonth}件の予定があります</p>
          <p>• 最も多いカテゴリは「{mostCategory.name}」({mostCategory.count}件)です</p>
          <p>• 平均して1日あたり{(totalEvents / 30).toFixed(1)}件の予定があります</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
