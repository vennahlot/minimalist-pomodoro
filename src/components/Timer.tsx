import React from 'react';
import { TimerMode, Task } from '@/types';

interface TimerProps {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  sessionsCompleted: number;
  activeTaskId: string | null;
  tasks: Task[];
  onStart: () => void;
  onPause: () => void;
  onSkip: () => void;
  onReset: () => void;
}

export default function Timer({
  mode,
  timeLeft,
  isRunning,
  sessionsCompleted,
  activeTaskId,
  tasks,
  onStart,
  onPause,
  onSkip,
  onReset,
}: TimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const modeColors = {
    focus: 'from-red-600 to-orange-600',
    shortBreak: 'from-blue-600 to-cyan-600',
    longBreak: 'from-blue-700 to-cyan-700',
  };

  const modeTexts = {
    focus: 'Focus Time',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  };

  const activeTask = activeTaskId ? tasks.find(t => t.id === activeTaskId) : null;

  return (
    <div className={`bg-gradient-to-br ${modeColors[mode]} rounded-2xl p-8 text-white shadow-lg`}>
      <div className="text-center">
        <h2 className="text-2xl font-light mb-4">{modeTexts[mode]}</h2>
        <div className="text-6xl font-light mb-8 font-mono">
          {formatTime(timeLeft)}
        </div>
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={isRunning ? onPause : onStart}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-8 py-3 rounded-full font-medium transition-all text-gray-900"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={onSkip}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-8 py-3 rounded-full font-medium transition-all text-gray-900"
          >
            Skip
          </button>
          <button
            onClick={onReset}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-full font-medium transition-all text-gray-900"
          >
            Reset
          </button>
        </div>
        
        {/* Active Task */}
        {activeTask && (
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-gray-900">
            <p className="text-sm opacity-80">Working on:</p>
            <p className="font-medium">{activeTask.name}</p>
          </div>
        )}
        
        {/* Session Counter */}
        <div className="mt-6 flex justify-center">
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < (sessionsCompleted % 4 === 0 && sessionsCompleted > 0 ? 4 : sessionsCompleted % 4)
                    ? 'bg-white' 
                    : 'border-2 border-white bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 