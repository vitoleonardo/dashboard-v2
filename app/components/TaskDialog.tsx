'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Task, TaskPriority } from '../types/task';
import { cn } from '@/lib/utils';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task> & { text: string }) => void;
  task?: Task | null;
  defaultColumn?: 'backlog' | 'current' | 'done';
}

const priorities: TaskPriority[] = ['low', 'medium', 'high'];
const priorityConfig: Record<TaskPriority, { label: string; color: string; emoji: string }> = {
  high: { label: 'High', color: 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20', emoji: '🔴' },
  medium: { label: 'Medium', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20', emoji: '🟡' },
  low: { label: 'Low', color: 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20', emoji: '🟢' },
};

export default function TaskDialog({ open, onClose, onSave, task, defaultColumn }: TaskDialogProps) {
  const isEditing = !!task;
  
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (open) {
      if (task) {
        setText(task.text || '');
        setDescription(task.description || '');
        setPriority(task.priority || 'medium');
        setDueDate(task.dueDate || '');
      } else {
        setText('');
        setDescription('');
        setPriority('medium');
        setDueDate('');
      }
    }
  }, [open, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const taskData: Partial<Task> & { text: string } = {
      text: text.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
    };

    if (task) {
      taskData.id = task.id;
      taskData.column = task.column;
    }

    onSave(taskData);
    handleClose();
  };

  const handleClose = () => {
    setText('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1a1a1a] border-gray-800 text-gray-100 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            {isEditing 
              ? 'Make changes to your task. Changes are saved automatically.' 
              : 'Add a new task to your board. Fill in the details below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Task Title */}
          <div className="space-y-2">
            <label htmlFor="task-text" className="text-sm font-medium text-gray-300">
              Task Title <span className="text-red-400">*</span>
            </label>
            <Input
              id="task-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done?"
              className="bg-[#0d0d0d] border-gray-800 text-gray-200 placeholder-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
              autoFocus
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="task-description" className="text-sm font-medium text-gray-300">
              Description
            </label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              className="bg-[#0d0d0d] border-gray-800 text-gray-200 placeholder-gray-600 focus:border-blue-500 focus:ring-blue-500/20 resize-none min-h-[100px]"
              rows={4}
            />
          </div>

          {/* Priority Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Priority
            </label>
            <div className="flex gap-2">
              {priorities.map((p) => {
                const config = priorityConfig[p];
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      'flex-1 px-4 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm font-medium',
                      isSelected 
                        ? config.color + ' ring-2 ring-offset-2 ring-offset-[#1a1a1a]'
                        : 'bg-[#0d0d0d] border-gray-800 text-gray-500 hover:border-gray-700'
                    )}
                  >
                    <span className="mr-1.5">{config.emoji}</span>
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label htmlFor="task-duedate" className="text-sm font-medium text-gray-300">
              Due Date
            </label>
            <Input
              id="task-duedate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-[#0d0d0d] border-gray-800 text-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="bg-transparent border-gray-800 text-gray-300 hover:bg-gray-900 hover:text-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!text.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
