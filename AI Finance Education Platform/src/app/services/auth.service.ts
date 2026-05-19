// JWT-based Authentication Service (Client-side simulation)
// In production, this would connect to a real backend API

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  xp: number;
  level: number;
  streak: number;
  avatar?: string;
  createdAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export class AuthService {
  private static readonly TOKEN_KEY = 'wealthnexus_token';
  private static readonly USER_KEY = 'wealthnexus_user';

  static async login(email: string, password: string): Promise<AuthResponse> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock JWT token
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ email, exp: Date.now() + 86400000 }))}`;
    
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: 'user',
      xp: 1250,
      level: 5,
      streak: 7,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    return { user, token };
  }

  static async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ email, exp: Date.now() + 86400000 }))}`;
    
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role: 'user',
      xp: 0,
      level: 1,
      streak: 0,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    return { user, token };
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static updateUser(updates: Partial<User>): void {
    const user = this.getCurrentUser();
    if (user) {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    }
  }

  static addXP(amount: number): User | null {
    const user = this.getCurrentUser();
    if (user) {
      user.xp += amount;
      // Level up every 500 XP
      user.level = Math.floor(user.xp / 500) + 1;
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  }
}
