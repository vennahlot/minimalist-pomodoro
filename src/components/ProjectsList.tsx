import React, { useState } from 'react';
import { Project, Task } from '@/types';
import ProjectForm from './ProjectForm';

interface ProjectsListProps {
  projects: Project[];
  tasks: Task[];
  onAddProject: (name: string, color: string) => void;
  onEditProject: (projectId: string, name: string, color: string) => void;
  onDeleteProject: (projectId: string) => void;
}

export default function ProjectsList({ 
  projects, 
  tasks, 
  onAddProject, 
  onEditProject,
  onDeleteProject 
}: ProjectsListProps) {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const getProjectTotalSessions = (projectId: string) => {
    return tasks
      .filter(task => task.projectId === projectId)
      .reduce((total, task) => total + task.completedSessions, 0);
  };

  const handleAddProject = (name: string, color: string) => {
    onAddProject(name, color);
    setShowProjectForm(false);
  };

  const handleEditProject = (name: string, color: string) => {
    if (editingProjectId) {
      onEditProject(editingProjectId, name, color);
      setEditingProjectId(null);
    }
  };

  const startEditing = (projectId: string) => {
    setEditingProjectId(projectId);
    setShowProjectForm(false);
  };

  const cancelEditing = () => {
    setEditingProjectId(null);
  };

  const editingProject = editingProjectId ? projects.find(p => p.id === editingProjectId) : null;

  return (
    <div className="bg-stone-800 rounded-2xl p-6 shadow-sm border border-stone-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-amber-100">Projects</h3>
        <button
          onClick={() => setShowProjectForm(true)}
          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
        >
          + Add
        </button>
      </div>
      
      {showProjectForm && (
        <ProjectForm
          onAdd={handleAddProject}
          onCancel={() => setShowProjectForm(false)}
        />
      )}

      {editingProject && (
        <ProjectForm
          initialName={editingProject.name}
          initialColor={editingProject.color}
          onAdd={handleEditProject}
          onCancel={cancelEditing}
          isEditing={true}
        />
      )}

      <div className="space-y-3">
        {projects.map(project => (
          <div key={project.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${project.color}`} />
              <span className="text-stone-300">{project.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-400">
                {getProjectTotalSessions(project.id)}
              </span>
              {project.id !== 'default' && (
                <>
                  <button
                    onClick={() => startEditing(project.id)}
                    className="text-amber-400 hover:text-amber-300 text-sm"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => onDeleteProject(project.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 