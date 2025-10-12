export type ProjectRole = 'owner' | 'member';

export interface Project {
  id: string; // UUID
  name: string;
  description: string | null;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectMember {
  id: string; // UUID
  project_id: string;
  user_id: string;
  role: ProjectRole;
  created_at: Date;
  // Populated fields
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface AddMemberRequest {
  email: string;
  role?: ProjectRole; // defaults to 'member'
}

export interface ProjectWithMembers extends Project {
  members: ProjectMember[];
  memberCount: number;
  userRole: ProjectRole; // current user's role in this project
}