
export type UserRole = "CLIENTE" | "PROFISSIONAL" | "EMPRESA" | "ADMIN";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
  createdAt: string;
  active: boolean;
  companyName?: string; // For Empresa role
  professionalCount?: number; // For Empresa role view
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}
