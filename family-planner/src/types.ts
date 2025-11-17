export type EventCategory =
  | 'hospital'   // 病院
  | 'school'     // 学校・保育園
  | 'hobby'      // 趣味
  | 'lesson'     // 習い事
  | 'event'      // イベント
  | 'friend'     // 友人
  | 'exam';      // 試験

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'parent' | 'child' | 'other';
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  category: EventCategory;
  startDate: Date;
  endDate?: Date;
  allDay: boolean;
  description?: string;
  location?: string;
  familyMembers: string[]; // FamilyMember IDs
  googleCalendarEventId?: string;
  color?: string;
  reminder?: {
    enabled: boolean;
    minutesBefore: number;
  };
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
}

export interface CategoryConfig {
  id: EventCategory;
  name: string;
  color: string;
  icon: string;
  description: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'hospital',
    name: '病院',
    color: '#81C784',
    icon: '🏥',
    description: '健診、予防接種、通院など'
  },
  {
    id: 'school',
    name: '学校・保育園',
    color: '#64B5F6',
    icon: '🏫',
    description: '行事、面談、参観日など'
  },
  {
    id: 'hobby',
    name: '趣味',
    color: '#BA68C8',
    icon: '🎨',
    description: '自分の趣味活動'
  },
  {
    id: 'lesson',
    name: '習い事',
    color: '#FFB74D',
    icon: '📚',
    description: '子供の習い事'
  },
  {
    id: 'event',
    name: 'イベント',
    color: '#F06292',
    icon: '🎉',
    description: '行事、パーティーなど'
  },
  {
    id: 'friend',
    name: '友人',
    color: '#4DB6AC',
    icon: '👥',
    description: '友人との予定'
  },
  {
    id: 'exam',
    name: '試験',
    color: '#FFF176',
    icon: '📝',
    description: '子供や自分の試験'
  }
];

export type ViewMode = 'calendar' | 'gantt' | 'list';
