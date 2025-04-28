import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { API_URL } from '../config/constants';

type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'sales' | 'tech';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isSalesTeam: () => boolean;
  isTechTeam: () => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing auth token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Mock authenticated user data
          const mockUser = {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            first_name: 'Admin',
            last_name: 'User',
            role: 'sales' as const
          };
          setUser(mockUser);
          axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        } catch (error) {
          localStorage.removeItem('authToken');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock authentication
      if (username === 'admin' && password === 'admin123') {
        const mockToken = 'mock-auth-token';
        const mockUser = {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          first_name: 'Admin',
          last_name: 'User',
          role: 'sales' as const
        };
        
        localStorage.setItem('authToken', mockToken);
        axios.defaults.headers.common['Authorization'] = `Token ${mockToken}`;
        setUser(mockUser);
        
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Invalid username or password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isSalesTeam = () => user?.role === 'sales';
  const isTechTeam = () => user?.role === 'tech';

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login,
      logout,
      isSalesTeam,
      isTechTeam
    }}>
      {children}
    </AuthContext.Provider>
  );
}