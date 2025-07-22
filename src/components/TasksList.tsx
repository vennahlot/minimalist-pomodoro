import React, { useState } from 'react';
import { Project, Task } from '@/types';
import TaskForm from './TaskForm';

interface TasksListProps {
  tasks: Task[];
  projects: Project[];
  activeTaskId: string | null;
  onAddTask: (name: string, projectId: string, targetSessions: number) => void;
  onEditTask: (taskId: string, name: string, projectId: string, targetSessions: number) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskSessions: (taskId: string, sessions: number) => void;
  onSetActiveTask: (taskId: string | null) => void;
}

export default function TasksList({
  tasks,
  projects,
  activeTaskId,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onUpdateTaskSessions,
  onSetActiveTask,
}: TasksListProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleAddTask = (name: string, projectId: string, targetSessions: number) => {
    onAddTask(name, projectId, targetSessions);
    setShowTaskForm(false);
  };

  const handleEditTask = (name: string, projectId: string, targetSessions: number) => {
    if (editingTaskId) {
      onEditTask(editingTaskId, name, projectId, targetSessions);
      setEditingTaskId(null);
    }
  };

  const startEditing = (taskId: string) => {
    setEditingTaskId(taskId);
    setShowTaskForm(false);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  const handleTaskClick = (taskId: string) => {
    onSetActiveTask(taskId === activeTaskId ? null : taskId);
  };

  const editingTask = editingTaskId ? tasks.find(t => t.id === editingTaskId) : null;

  return (
    <div className="bg-stone-800 rounded-2xl p-6 shadow-sm border border-stone-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-amber-100">Tasks</h3>
        <button
          onClick={() => setShowTaskForm(true)}
          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
        >
          + Add
        </button>
      </div>

      {showTaskForm && (
        <TaskForm
          projects={projects}
          onAdd={handleAddTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          projects={projects}
          initialName={editingTask.name}
          initialProjectId={editingTask.projectId}
          initialTargetSessions={editingTask.targetSessions}
          onAdd={handleEditTask}
          onCancel={cancelEditing}
          isEditing={true}
        />
      )}

      <div className="space-y-3">
        {tasks.map(task => {
          const project = projects.find(p => p.id === task.projectId);
          return (
            <div
              key={task.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                activeTaskId === task.id
                  ? 'border-orange-500 bg-orange-900 bg-opacity-20'
                  : 'border-stone-600 hover:border-stone-500 bg-stone-700'
              }`}
              onClick={() => handleTaskClick(task.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-amber-100">{task.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(task.id);
                    }}
                    className="text-amber-400 hover:text-amber-300 text-sm"
                  >
                    ✎
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id);
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${project?.color}`} />
                  <span className="text-stone-400">{project?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateTaskSessions(task.id, task.completedSessions - 1);
                    }}
                    className="text-stone-400 hover:text-stone-300 w-6 h-6 flex items-center justify-center rounded"
                  >
                    −
                  </button>
                  <span className="text-amber-200">
                    {task.completedSessions}/{task.targetSessions}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateTaskSessions(task.id, task.completedSessions + 1);
                    }}
                    className="text-stone-400 hover:text-stone-300 w-6 h-6 flex items-center justify-center rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 