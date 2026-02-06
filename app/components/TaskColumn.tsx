'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TaskCard from './TaskCard';
import { Task } from '../types/task';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onAddTask: () => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  icon?: string;
  color?: string;
}

const columnColors: Record<string, string> = {
  backlog: 'border-gray-700 bg-gray-900/20',
  current: 'border-blue-700 bg-blue-900/10',
  done: 'border-green-700 bg-green-900/10',
};

const emptyMessages: Record<string, string> = {
  backlog: 'No tasks in backlog',
  current: 'Nothing in progress',
  done: 'No completed tasks',
};

export default function TaskColumn({
  id,
  title,
  tasks,
  onAddTask,
  onDeleteTask,
  onEditTask,
  icon,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const isEmpty = tasks.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-100">{title}</h2>
          <Badge 
            variant="secondary" 
            className="bg-gray-800/50 text-gray-400 hover:bg-gray-800/70 border-gray-700 font-mono text-xs"
          >
            {tasks.length}
          </Badge>
        </div>
        <Button
          onClick={onAddTask}
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 rounded-lg border-2 transition-all duration-200 min-h-[500px]',
          isOver 
            ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10' 
            : 'border-gray-800/50 bg-[#0a0a0a]/30'
        )}
      >
        <div className="p-4 space-y-3 h-full">
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
              />
            ))}
          </SortableContext>

          {/* Empty State */}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center h-64 text-center animate-in">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-800/30 to-gray-900/20 flex items-center justify-center mb-4 border border-gray-800/50">
                  <Plus className="w-10 h-10 text-gray-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500/20 rounded-full animate-ping" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {emptyMessages[id] || 'No tasks yet'}
              </p>
              <p className="text-xs text-gray-700">
                Drag tasks here or click <span className="text-gray-600 font-medium">+</span> to add
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
        <span>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
        {tasks.length > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Active
          </span>
        )}
      </div>
    </div>
  );
}
