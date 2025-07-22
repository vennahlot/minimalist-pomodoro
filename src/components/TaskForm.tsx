import React, { useState } from 'react';
import { Project } from '@/types';

interface TaskFormProps {
  projects: Project[];
  onAdd: (name: string, projectId: string, targetSessions: number) => void;
  onCancel: () => void;
  initialName?: string;
  initialProjectId?: string;
  initialTargetSessions?: number;
  isEditing?: boolean;
}

export default function TaskForm({ 
  projects, 
  onAdd, 
  onCancel,
  initialName = '',
  initialProjectId,
  initialTargetSessions = 4,
  isEditing = false
}: TaskFormProps) {
  const [name, setName] = useState(initialName);
  const [projectId, setProjectId] = useState(initialProjectId || projects[0]?.id || '');
  const [targetSessions, setTargetSessions] = useState(initialTargetSessions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), projectId, targetSessions);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-3 bg-stone-700 rounded-lg border border-stone-600">
      <input
        type="text"
        placeholder="Task name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 border border-stone-500 rounded mb-2 text-sm bg-stone-600 text-amber-100 placeholder-stone-400"
        autoFocus
      />
      <div className="flex gap-2 mb-2">
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="flex-1 px-3 py-2 border border-stone-500 rounded text-sm bg-stone-600 text-amber-100"
        >
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={targetSessions}
          onChange={(e) => setTargetSessions(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 px-3 py-2 border border-stone-500 rounded text-sm bg-stone-600 text-amber-100"
          min="1"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-cyan-600 text-white py-2 rounded text-sm hover:bg-cyan-500 transition-colors"
        >
          {isEditing ? 'Update' : 'Add'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-stone-400 hover:text-stone-300 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
} 