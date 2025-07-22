export interface Task {
  id: string;
  name: string;
  projectId: string;
  completedSessions: number;
  targetSessions: number;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface DailyStats {
  date: string;
  sessions: number;
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export const TIMER_DURATIONS = {
  focus: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
}; 