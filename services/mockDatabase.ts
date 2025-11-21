import { Job, User, UserRole } from '../types';
import { MOCK_FREELANCERS, MOCK_JOBS } from '../constants';

// Keys for LocalStorage
const USERS_KEY = 'fhkz_users';
const JOBS_KEY = 'fhkz_jobs';
const CURRENT_USER_KEY = 'fhkz_current_user';

class MockDatabase {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(MOCK_FREELANCERS));
    }
    if (!localStorage.getItem(JOBS_KEY)) {
      localStorage.setItem(JOBS_KEY, JSON.stringify(MOCK_JOBS));
    }
  }

  getUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  getJobs(): Job[] {
    const data = localStorage.getItem(JOBS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // If updating current user, update session too
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === user.id) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  }

  addJob(job: Job): void {
    const jobs = this.getJobs();
    jobs.unshift(job); // Add to top
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  }

  login(email: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.email === email); // Simple mock login (no password check for ease of demo)
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  }

  register(user: User): User {
    this.saveUser(user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }
}

export const db = new MockDatabase();