'use client';

import { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Loader2, Sparkles, Keyboard } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import TaskCard from './components/TaskCard';
import TaskColumn from './components/TaskColumn';
import TaskDialog from './components/TaskDialog';
import { Task, TaskColumn as TaskColumnType } from './types/task';
import { Card } from '@/components/ui/card';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { playSound } from './utils/sounds';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [addToColumn, setAddToColumn] = useState<TaskColumnType>('backlog');
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'cmd+k': () => {
      openAddDialog('backlog');
    },
    'cmd+shift+k': () => {
      openAddDialog('current');
    },
    'cmd+/': () => {
      setShowShortcuts(prev => !prev);
      toast.info('Keyboard Shortcuts', {
        description: '⌘K - Quick add task | ⌘⇧K - Add to current | ⌘/ - Toggle shortcuts',
      });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    setSaving(true);
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: updatedTasks }),
      });
      toast.success('Changes saved');
    } catch (error) {
      console.error('Failed to save tasks:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const overColumn = over.id as TaskColumnType;
    if (['backlog', 'current', 'done'].includes(overColumn)) {
      if (activeTask.column !== overColumn) {
        const updatedTasks = tasks.map(task =>
          task.id === active.id ? { ...task, column: overColumn } : task
        );
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
        
        if (overColumn === 'done') {
          playSound.success();
          toast.success('🎉 Task completed!', {
            description: activeTask.text,
          });
        } else {
          playSound.move();
          toast.success('Task moved');
        }
      }
    }
  };

  const handleSaveTask = (taskData: Partial<Task> & { text: string }) => {
    if (taskData.id) {
      // Edit existing task
      const updatedTasks = tasks.map(t =>
        t.id === taskData.id ? { ...t, ...taskData } : t
      );
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      toast.success('Task updated');
    } else {
      // Add new task
      const newTask: Task = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text: taskData.text,
        column: addToColumn,
        priority: taskData.priority,
        description: taskData.description,
        dueDate: taskData.dueDate,
        createdAt: new Date().toISOString(),
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      toast.success('Task created');
    }
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    toast.success('Task deleted', {
      description: task?.text,
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const openAddDialog = (column: TaskColumnType) => {
    setEditingTask(null);
    setAddToColumn(column);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const activeTask = tasks.find(t => t.id === activeId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0e11] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <p className="text-sm text-gray-500">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0e11] text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-[#111111]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                Task Dashboard
              </h1>
              <p className="text-xs text-gray-600">Organize your work efficiently</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saving && (
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-800/30 px-3 py-1.5 rounded-full">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </div>
            )}
            <button
              onClick={() => {
                toast.info('Keyboard Shortcuts', {
                  description: '⌘K - Quick add | ⌘⇧K - Add to current | ⌘/ - Show shortcuts',
                });
              }}
              className="p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors"
              title="Keyboard shortcuts (⌘/)"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Board */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TaskColumn
              id="backlog"
              title="📋 Backlog"
              tasks={tasks.filter(t => t.column === 'backlog')}
              onAddTask={() => openAddDialog('backlog')}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
            <TaskColumn
              id="current"
              title="🔄 In Progress"
              tasks={tasks.filter(t => t.column === 'current')}
              onAddTask={() => openAddDialog('current')}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
            <TaskColumn
              id="done"
              title="✅ Completed"
              tasks={tasks.filter(t => t.column === 'done')}
              onAddTask={() => openAddDialog('done')}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeTask ? (
              <Card className="bg-[#1a1a1a] border-blue-500/50 p-3 shadow-2xl opacity-90 scale-105 animate-pulse ring-2 ring-blue-500/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <p className="text-sm text-gray-200 font-medium">{activeTask.text}</p>
                </div>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-[#1a1a1a]/50 border-gray-800/50 p-4 hover:border-gray-700/50 transition-all duration-200">
            <div className="text-2xl font-bold text-gray-300">
              {tasks.filter(t => t.column === 'backlog').length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Pending Tasks</div>
          </Card>
          <Card className="bg-[#1a1a1a]/50 border-gray-800/50 p-4 hover:border-gray-700/50 transition-all duration-200">
            <div className="text-2xl font-bold text-blue-400">
              {tasks.filter(t => t.column === 'current').length}
            </div>
            <div className="text-xs text-gray-600 mt-1">In Progress</div>
          </Card>
          <Card className="bg-[#1a1a1a]/50 border-gray-800/50 p-4 hover:border-gray-700/50 transition-all duration-200">
            <div className="text-2xl font-bold text-green-400">
              {tasks.filter(t => t.column === 'done').length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Completed</div>
          </Card>
        </div>
      </main>

      {/* Task Dialog */}
      <TaskDialog
        open={isDialogOpen}
        onClose={closeDialog}
        onSave={handleSaveTask}
        task={editingTask}
        defaultColumn={addToColumn}
      />

      {/* Toast Notifications */}
      <Toaster 
        position="bottom-right" 
        theme="dark"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            border: '1px solid #333',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}
