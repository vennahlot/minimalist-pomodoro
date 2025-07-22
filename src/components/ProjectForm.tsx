import React, { useState } from 'react';

interface ProjectFormProps {
  onAdd: (name: string, color: string) => void;
  onCancel: () => void;
  initialName?: string;
  initialColor?: string;
  isEditing?: boolean;
}

export default function ProjectForm({ 
  onAdd, 
  onCancel, 
  initialName = '', 
  initialColor = 'bg-cyan-600',
  isEditing = false 
}: ProjectFormProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  const colors = [
    'bg-cyan-600', 'bg-green-600', 'bg-purple-600', 'bg-pink-600',
    'bg-yellow-600', 'bg-indigo-600', 'bg-red-600', 'bg-orange-600'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), color);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-3 bg-stone-700 rounded-lg border border-stone-600">
      <input
        type="text"
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 border border-stone-500 rounded mb-3 text-sm bg-stone-600 text-amber-100 placeholder-stone-400"
        autoFocus
      />
      <div className="flex gap-2 mb-3">
        {colors.map(colorClass => (
          <button
            key={colorClass}
            type="button"
            onClick={() => setColor(colorClass)}
            className={`w-6 h-6 rounded-full ${colorClass} ${
              color === colorClass ? 'ring-2 ring-amber-400' : ''
            }`}
          />
        ))}
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