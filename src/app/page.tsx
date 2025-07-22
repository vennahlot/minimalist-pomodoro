'use client';

import { useState, useEffect, useRef } from 'react';
import { Task, Project, DailyStats, TimerMode, TIMER_DURATIONS } from '@/types';
import Timer from '@/components/Timer';
import DailyChart from '@/components/DailyChart';
import ProjectsList from '@/components/ProjectsList';
import TasksList from '@/components/TasksList';

export default function PomodoroApp() {
  // Timer state
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('pomodoro-projects');
    const savedTasks = localStorage.getItem('pomodoro-tasks');
    const savedStats = localStorage.getItem('pomodoro-stats');

    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedStats) setDailyStats(JSON.parse(savedStats));

    // Initialize with default project if none exist
    if (!savedProjects) {
      const defaultProject = { id: 'default', name: 'Personal', color: 'bg-yellow-600' };
      setProjects([defaultProject]);
      localStorage.setItem('pomodoro-projects', JSON.stringify([defaultProject]));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pomodoro-stats', JSON.stringify(dailyStats));
  }, [dailyStats]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      
      if (mode === 'focus') {
        // Complete focus session
        setSessionsCompleted(prev => prev + 1);
        
        // Update task sessions
        if (activeTaskId) {
          setTasks(prev => prev.map(task => 
            task.id === activeTaskId 
              ? { ...task, completedSessions: task.completedSessions + 1 }
              : task
          ));
        }

        // Update daily stats
        const today = new Date().toISOString().split('T')[0];
        setDailyStats(prev => {
          const existingDay = prev.find(stat => stat.date === today);
          if (existingDay) {
            return prev.map(stat => 
              stat.date === today 
                ? { ...stat, sessions: stat.sessions + 1 }
                : stat
            );
          } else {
            return [...prev, { date: today, sessions: 1 }];
          }
        });

        // Determine next mode
        const nextMode = sessionsCompleted % 4 === 0 ? 'longBreak' : 'shortBreak';
        setMode(nextMode);
        setTimeLeft(TIMER_DURATIONS[nextMode]);
      } else {
        // Break completed, return to focus
        setMode('focus');
        setTimeLeft(TIMER_DURATIONS.focus);
      }
    }
  }, [timeLeft, isRunning, mode, sessionsCompleted, activeTaskId]);

  // Timer control functions
  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  
  const skipSession = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      // When skipping a focus session, we still increment sessions completed
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      // Update task sessions (same as timer completion)
      if (activeTaskId) {
        setTasks(prev => prev.map(task => 
          task.id === activeTaskId 
            ? { ...task, completedSessions: task.completedSessions + 1 }
            : task
        ));
      }

      // Update daily stats (same as timer completion)
      const today = new Date().toISOString().split('T')[0];
      setDailyStats(prev => {
        const existingDay = prev.find(stat => stat.date === today);
        if (existingDay) {
          return prev.map(stat => 
            stat.date === today 
              ? { ...stat, sessions: stat.sessions + 1 }
              : stat
          );
        } else {
          return [...prev, { date: today, sessions: 1 }];
        }
      });
      
      const nextMode = newSessionsCompleted % 4 === 0 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      setTimeLeft(TIMER_DURATIONS[nextMode]);
    } else {
      setMode('focus');
      setTimeLeft(TIMER_DURATIONS.focus);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_DURATIONS[mode]);
  };

  // Project management functions
  const addProject = (name: string, color: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      color,
    };
    setProjects(prev => [...prev, newProject]);
  };

  const editProject = (projectId: string, name: string, color: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, name, color }
        : project
    ));
  };

  const deleteProject = (projectId: string) => {
    if (projectId === 'default') return; // Don't delete default project
    setProjects(prev => prev.filter(project => project.id !== projectId));
    // Move tasks to default project
    setTasks(prev => prev.map(task => 
      task.projectId === projectId 
        ? { ...task, projectId: 'default' }
        : task
    ));
  };

  // Task management functions
  const addTask = (name: string, projectId: string, targetSessions: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      name,
      projectId,
      completedSessions: 0,
      targetSessions,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const editTask = (taskId: string, name: string, projectId: string, targetSessions: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, name, projectId, targetSessions }
        : task
    ));
  };

  const updateTaskSessions = (taskId: string, sessions: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completedSessions: Math.max(0, sessions) }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-light text-amber-100 mb-2">Minimalist Pomodoro</h1>
          <p className="text-stone-400">Stay focused, get things done</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer Section */}
          <div className="lg:col-span-2">
            <Timer
              mode={mode}
              timeLeft={timeLeft}
              isRunning={isRunning}
              sessionsCompleted={sessionsCompleted}
              activeTaskId={activeTaskId}
              tasks={tasks}
              onStart={startTimer}
              onPause={pauseTimer}
              onSkip={skipSession}
              onReset={resetTimer}
            />

            <DailyChart dailyStats={dailyStats} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ProjectsList
              projects={projects}
              tasks={tasks}
              onAddProject={addProject}
              onEditProject={editProject}
              onDeleteProject={deleteProject}
            />

            <TasksList
              tasks={tasks}
              projects={projects}
              activeTaskId={activeTaskId}
              onAddTask={addTask}
              onEditTask={editTask}
              onDeleteTask={deleteTask}
              onUpdateTaskSessions={updateTaskSessions}
              onSetActiveTask={setActiveTaskId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
