
import { UserRole, UserProfile } from '../types';

/**
 * Since this is a standalone generation, we provide a robust mock service
 * that implements the EXACT logic requested (fail-safe, role checking, etc.)
 * This allows the app to be fully interactive and "functional" immediately.
 */

const STORAGE_KEY_USERS = 'checkmaster_users';
const SESSION_KEY_AUTH = 'checkmaster_auth';

const getStoredUsers = (): Record<string, UserProfile> => {
  const data = localStorage.getItem(STORAGE_KEY_USERS);
  return data ? JSON.parse(data) : {};
};

const saveUsers = (users: Record<string, UserProfile>) => {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
};

// Fail-safe logic for the specific admin email
const FAIL_SAFE_EMAIL = "aandreand3@gmail.com";

export const firebaseService = {
  // Authentication Flow
  async login(email: string, pass: string): Promise<UserProfile> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getStoredUsers();
    const user = Object.values(users).find(u => u.email === email);

    // Fail-safe check
    if (email === FAIL_SAFE_EMAIL) {
      if (!user) {
        const adminUser: UserProfile = {
          uid: 'failsafe-admin-id',
          name: 'Super Admin',
          email: FAIL_SAFE_EMAIL,
          role: 'ADMIN',
          createdAt: new Date().toISOString(),
          active: true
        };
        const updatedUsers = { ...users, [adminUser.uid]: adminUser };
        saveUsers(updatedUsers);
        return adminUser;
      }
      return user;
    }

    if (!user) {
      throw new Error("Usuário não encontrado ou credenciais inválidas.");
    }

    if (!user.active) {
      throw new Error("Sua conta está inativa. Entre em contato com o suporte.");
    }

    return user;
  },

  async register(data: { name: string, email: string, role: UserRole, password?: string }): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = getStoredUsers();
    
    if (Object.values(users).some(u => u.email === data.email)) {
      throw new Error("Este e-mail já está em uso.");
    }

    const newUser: UserProfile = {
      uid: `uid-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: new Date().toISOString(),
      active: true,
      ...(data.role === 'EMPRESA' ? { professionalCount: 0 } : {})
    };

    // Role-based validation as per requirements
    if (!data.role) throw new Error("Role é obrigatório.");

    const updatedUsers = { ...users, [newUser.uid]: newUser };
    saveUsers(updatedUsers);
    
    return newUser;
  },

  // Firestore Simulation
  async getUsers(): Promise<UserProfile[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return Object.values(getStoredUsers());
  },

  async getUserById(uid: string): Promise<UserProfile | null> {
    const users = getStoredUsers();
    return users[uid] || null;
  },

  async toggleUserStatus(uid: string): Promise<void> {
    const users = getStoredUsers();
    if (users[uid]) {
      users[uid].active = !users[uid].active;
      saveUsers(users);
    }
  }
};
