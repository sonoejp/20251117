import React, { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Plus, Edit, Trash2, Calendar, MapPin, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../types';
import type { EventCategory } from '../types';

const ListView: React.FC = () => {
  const { events, familyMembers } = useApp();
  const [filterCategory, setFilterCategory] = useState<EventCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'category'>('date');

  // フィルタリングとソート
  const filteredEvents = events
    .filter((event) => filterCategory === 'all' || event.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else {
        return a.category.localeCompare(b.category);
      }
    });

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">予定リスト</h2>

          <div className="flex flex-wrap gap-3">
            {/* カテゴリフィルター */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as EventCategory | 'all')}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">すべてのカテゴリ</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>

            {/* ソート */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'category')}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="date">日付順</option>
              <option value="category">カテゴリ順</option>
            </select>

            <button className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>予定を追加</span>
            </button>
          </div>
        </div>

        {/* 統計 */}
        <div className="mt-4 flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => {
            const count = events.filter((e) => e.category === cat.id).length;
            return (
              <div
                key={cat.id}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: cat.color + '30' }}
              >
                {cat.icon} {cat.name}: {count}件
              </div>
            );
          })}
        </div>
      </div>

      {/* イベントリスト */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-lg text-gray-600">予定がありません</p>
            <p className="text-sm text-gray-500 mt-2">
              {filterCategory !== 'all'
                ? 'このカテゴリには予定がありません'
                : '予定を追加してみましょう！'}
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const category = CATEGORIES.find((c) => c.id === event.category);
            const members = event.familyMembers
              .map((id) => familyMembers.find((m) => m.id === id))
              .filter(Boolean);

            return (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="flex">
                  {/* カテゴリカラーバー */}
                  <div
                    className="w-2"
                    style={{ backgroundColor: category?.color }}
                  />

                  {/* コンテンツ */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* タイトル */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{category?.icon}</span>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {event.title}
                          </h3>
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: category?.color + '30' }}
                          >
                            {category?.name}
                          </span>
                        </div>

                        {/* 詳細 */}
                        <div className="space-y-2 text-sm text-gray-600">
                          {/* 日時 */}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(new Date(event.startDate), 'yyyy年M月d日(E) HH:mm', {
                                locale: ja,
                              })}
                              {event.endDate &&
                                ` - ${format(new Date(event.endDate), 'M月d日(E) HH:mm', {
                                  locale: ja,
                                })}`}
                            </span>
                          </div>

                          {/* 場所 */}
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}

                          {/* メンバー */}
                          {members.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{members.map((m) => m?.name).join(', ')}</span>
                            </div>
                          )}

                          {/* 説明 */}
                          {event.description && (
                            <p className="text-gray-700 mt-2">{event.description}</p>
                          )}
                        </div>
                      </div>

                      {/* アクション */}
                      <div className="flex gap-2 ml-4">
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ListView;
