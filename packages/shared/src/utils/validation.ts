// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements
export const PASSWORD_MIN_LENGTH = 8;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH;
}

export function validateRequired(value: any, fieldName: string): string | null {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';
  if (!isValidEmail(email)) return 'Please enter a valid email address';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (!isValidPassword(password)) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`;
  }
  return null;
}

export function validateTaskTitle(title: string): string | null {
  if (!title) return 'Task title is required';
  if (title.length > 200) return 'Task title must be less than 200 characters';
  return null;
}

export function validateProjectName(name: string): string | null {
  if (!name) return 'Project name is required';
  if (name.length > 100) return 'Project name must be less than 100 characters';
  return null;
}