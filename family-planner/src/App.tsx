import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import CalendarView from './components/CalendarView';
import GanttView from './components/GanttView';
import ListView from './components/ListView';
import DashboardView from './components/DashboardView';
import EventModal from './components/EventModal';
import type { Event } from './types';

const AppContent: React.FC = () => {
  const { viewMode } = useApp();
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);

  const handleOpenModal = (event?: Event) => {
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleCloseModal = () => {
    setEditingEvent(undefined);
    setShowEventModal(false);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {viewMode === 'calendar' && <CalendarView onEditEvent={handleOpenModal} />}
        {viewMode === 'gantt' && <GanttView />}
        {viewMode === 'list' && <ListView onEditEvent={handleOpenModal} />}
        {viewMode === 'dashboard' && <DashboardView />}
      </main>

      <EventModal
        isOpen={showEventModal}
        onClose={handleCloseModal}
        editingEvent={editingEvent}
      />

      {/* フローティングアクションボタン */}
      <button
        onClick={() => handleOpenModal()}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-2xl z-40"
        title="予定を追加"
      >
        +
      </button>

      {/* フッター */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Family Planner - 育児計画管理アプリ</p>
          <p className="mt-1">育児中の複雑なスケジュールを一元管理 📅</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
