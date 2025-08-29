// utils/auth.ts
import React from 'react'
const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
    errors?: string[];
}

export interface SignUpData {
    name: string;
    email: string;
    password: string;
    dateOfBirth?: string;
}

export interface SignInData {
    email: string;
    password: string;
}

// API calls
export const authAPI = {
    signUp: async (data: SignUpData): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to sign up');
        }

        return response.json();
    },

    signIn: async (data: SignInData): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to sign in');
        }

        return response.json();
    },

    getMe: async (): Promise<AuthResponse> => {
        const token = getToken();

        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to get user data');
        }

        return response.json();
    },
};

// Token management
export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export const removeToken = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getUser = (): User | null => {
    const userString = localStorage.getItem('user');
    if (!userString) return null;

    try {
        return JSON.parse(userString);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

export const setUser = (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

// Auth context hook (optional - for React Context)
export const useAuth = () => {
    const [user, setCurrentUser] = React.useState<User | null>(getUser());
    const [loading, setLoading] = React.useState(false);

    const signUp = async (data: SignUpData) => {
        setLoading(true);
        try {
            const response = await authAPI.signUp(data);
            if (response.success && response.user && response.token) {
                setToken(response.token);
                setUser(response.user);
                setCurrentUser(response.user);
            }
            return response;
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (data: SignInData) => {
        setLoading(true);
        try {
            const response = await authAPI.signIn(data);
            if (response.success && response.user && response.token) {
                setToken(response.token);
                setUser(response.user);
                setCurrentUser(response.user);
            }
            return response;
        } finally {
            setLoading(false);
        }
    };

    const signOut = () => {
        removeToken();
        setCurrentUser(null);
    };

    const checkAuth = async () => {
        if (!getToken()) {
            setCurrentUser(null);
            return;
        }

        try {
            const response = await authAPI.getMe();
            if (response.success && response.user) {
                setCurrentUser(response.user);
            } else {
                signOut();
            }
        } catch {
            signOut();
        }
    };

}