import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Event, FamilyMember, ViewMode } from '../types';

interface AppContextType {
  events: Event[];
  familyMembers: FamilyMember[];
  viewMode: ViewMode;
  selectedDate: Date;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addFamilyMember: (member: FamilyMember) => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedDate: (date: Date) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // LocalStorageからデータを読み込み
  useEffect(() => {
    const savedEvents = localStorage.getItem('family-planner-events');
    const savedMembers = localStorage.getItem('family-planner-members');

    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((e: any) => ({
        ...e,
        startDate: new Date(e.startDate),
        endDate: e.endDate ? new Date(e.endDate) : undefined,
      }));
      setEvents(parsedEvents);
    }

    if (savedMembers) {
      setFamilyMembers(JSON.parse(savedMembers));
    } else {
      // デフォルトのメンバーを設定
      const defaultMembers: FamilyMember[] = [
        { id: '1', name: '自分', relation: 'parent' },
        { id: '2', name: '子供', relation: 'child' }
      ];
      setFamilyMembers(defaultMembers);
    }
  }, []);

  // データが変更されたらLocalStorageに保存
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('family-planner-events', JSON.stringify(events));
    }
  }, [events]);

  useEffect(() => {
    if (familyMembers.length > 0) {
      localStorage.setItem('family-planner-members', JSON.stringify(familyMembers));
    }
  }, [familyMembers]);

  const addEvent = (event: Event) => {
    setEvents((prev) => [...prev, event]);
  };

  const updateEvent = (id: string, updatedEvent: Partial<Event>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const addFamilyMember = (member: FamilyMember) => {
    setFamilyMembers((prev) => [...prev, member]);
  };

  return (
    <AppContext.Provider
      value={{
        events,
        familyMembers,
        viewMode,
        selectedDate,
        addEvent,
        updateEvent,
        deleteEvent,
        addFamilyMember,
        setViewMode,
        setSelectedDate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
