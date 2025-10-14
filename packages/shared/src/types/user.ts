export interface User {
  id: string; // UUID
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  created_at: Date;
}