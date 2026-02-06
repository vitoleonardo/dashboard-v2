export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskColumn = 'backlog' | 'current' | 'done';

export interface Task {
  id: string;
  text: string;
  column: TaskColumn;
  priority?: TaskPriority;
  description?: string;
  createdAt?: string;
  dueDate?: string;
}
