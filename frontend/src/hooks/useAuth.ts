import { useState, useEffect } from 'react';
import { authApi } from '../lib/api';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

export function useAuth(userCheck = true) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const nav = useNavigate()

  useEffect(() => {
    if (userCheck===false) return;
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      nav("/login")
    }

    authApi.getUser()
      .then((userData) => {
        console.log("userData", userData)
        setUser(userData);
      })
      .catch((err) => {
        setError(err);
        localStorage.removeItem('token');
        nav("/login")
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token, user: userData } = await authApi.login(email, password);
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };
  const signup = async (name: string, email: string, password: string) => {
    try {
      const { token, user: userData } = await authApi.signup(name, email, password);
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading,login, signup, error, logout };
}