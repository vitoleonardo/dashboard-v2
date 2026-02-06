'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (text: string) => void;
}

export default function AddTaskDialog({ open, onClose, onAdd }: AddTaskDialogProps) {
  const [text, setText] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
      onClose();
    }
  };

  const handleClose = () => {
    setText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-gray-200">Add New Task</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter task description..."
            className="w-full bg-[#0d0d0d] border border-gray-800 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-600 resize-none"
            rows={4}
            autoFocus
          />

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-[#0d0d0d] border border-gray-800 rounded-lg text-sm text-gray-300 hover:bg-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 rounded-lg text-sm text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
