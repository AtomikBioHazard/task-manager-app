export type TaskStatus = 'pending' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string; // UUID
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority | null;
  due_date: Date | null;
  category: string | null;
  assigned_to: string | null; // UUID
  created_by: string; // UUID
  created_at: Date;
  updated_at: Date;
  completed_at: Date | null;
  // Populated fields
  assignee?: {
    id: string;
    email: string;
    name: string;
  };
  creator?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: Date | string;
  category?: string;
  assigned_to?: string; // UUID
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: Date | string | null;
  category?: string;
  assigned_to?: string | null; // UUID
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to?: string;
  category?: string;
  search?: string; // search in title/description
}