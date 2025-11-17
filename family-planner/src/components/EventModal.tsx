import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../types';
import type { Event, EventCategory } from '../types';
import { format } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
  editingEvent?: Event;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, initialDate, editingEvent }) => {
  const { addEvent, updateEvent, familyMembers } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    category: 'school' as EventCategory,
    startDate: '',
    endDate: '',
    allDay: false,
    description: '',
    location: '',
    familyMembers: [] as string[],
  });

  // モーダルが開かれたときにフォームを設定
  useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        // 編集モード：既存のイベントデータを設定
        setFormData({
          title: editingEvent.title,
          category: editingEvent.category,
          startDate: format(editingEvent.startDate, "yyyy-MM-dd'T'HH:mm"),
          endDate: editingEvent.endDate ? format(editingEvent.endDate, "yyyy-MM-dd'T'HH:mm") : '',
          allDay: editingEvent.allDay,
          description: editingEvent.description || '',
          location: editingEvent.location || '',
          familyMembers: editingEvent.familyMembers,
        });
      } else {
        // 新規作成モード：初期値を設定
        setFormData({
          title: '',
          category: 'school',
          startDate: initialDate ? format(initialDate, "yyyy-MM-dd'T'HH:mm") : '',
          endDate: '',
          allDay: false,
          description: '',
          location: '',
          familyMembers: [],
        });
      }
    }
  }, [isOpen, initialDate, editingEvent]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEvent) {
      // 編集モード：既存のイベントを更新
      updateEvent(editingEvent.id, {
        title: formData.title,
        category: formData.category,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        allDay: formData.allDay,
        description: formData.description,
        location: formData.location,
        familyMembers: formData.familyMembers,
      });
    } else {
      // 新規作成モード：新しいイベントを追加
      const newEvent: Event = {
        id: Date.now().toString(),
        title: formData.title,
        category: formData.category,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        allDay: formData.allDay,
        description: formData.description,
        location: formData.location,
        familyMembers: formData.familyMembers,
      };
      addEvent(newEvent);
    }

    onClose();
  };

  const handleMemberToggle = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.includes(memberId)
        ? prev.familyMembers.filter((id) => id !== memberId)
        : [...prev.familyMembers, memberId],
    }));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingEvent ? '予定を編集' : '予定を追加'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* タイトル */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              タイトル *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="予定のタイトルを入力"
            />
          </div>

          {/* カテゴリ */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              カテゴリ *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.category === cat.id
                      ? 'border-primary-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    backgroundColor:
                      formData.category === cat.id ? cat.color + '20' : 'white',
                  }}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-xs font-medium">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 日時 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                開始日時 *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                終了日時
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* 終日 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="allDay"
              checked={formData.allDay}
              onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="allDay" className="text-sm font-medium text-gray-700">
              終日
            </label>
          </div>

          {/* 場所 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              場所
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="場所を入力"
            />
          </div>

          {/* 家族メンバー */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              参加者
            </label>
            <div className="flex flex-wrap gap-2">
              {familyMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleMemberToggle(member.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.familyMembers.includes(member.id)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {member.name}
                </button>
              ))}
            </div>
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              説明・メモ
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="詳細やメモを入力"
            />
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
            >
              {editingEvent ? '更新' : '追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
