'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MoreVertical, Trash2, Edit2, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task, TaskPriority } from '../types/task';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
};

const priorityLabels: Record<TaskPriority, string> = {
  high: '🔴 High',
  medium: '🟡 Medium',
  low: '🟢 Low',
};

export default function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    opacity: isDragging ? 0.4 : 1,
  };

  const handleQuickEdit = () => {
    onEdit(task);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative',
        isDragging && 'z-50'
      )}
    >
      <Card className="bg-[#1a1a1a] border-gray-800 hover:border-gray-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5 cursor-default">
        <div className="p-3 space-y-2">
          {/* Header with drag handle and menu */}
          <div className="flex items-start gap-2">
            <button
              className="mt-0.5 text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing transition-colors touch-none"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-4 h-4" />
            </button>
            
            <div className="flex-1 min-w-0 space-y-2">
              {/* Task text */}
              <p className="text-sm text-gray-200 leading-relaxed break-words">
                {task.text}
              </p>

              {/* Metadata row */}
              <div className="flex items-center gap-2 flex-wrap">
                {task.priority && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'text-xs font-medium border px-2 py-0.5',
                      priorityColors[task.priority]
                    )}
                  >
                    {priorityLabels[task.priority]}
                  </Badge>
                )}
                
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Description preview */}
              {task.description && (
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-600 hover:text-gray-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded hover:bg-gray-800">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#1a1a1a] border-gray-800">
                <DropdownMenuItem 
                  onClick={handleQuickEdit}
                  className="cursor-pointer text-gray-300 focus:bg-gray-800 focus:text-gray-100"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Hover indicator */}
        <div className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/20 rounded-lg pointer-events-none transition-colors duration-200" />
      </Card>
    </div>
  );
}
