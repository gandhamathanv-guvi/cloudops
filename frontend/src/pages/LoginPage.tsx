import React, { useState } from 'react';
import { Terminal, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, error } = useAuth(false);
  const navigate = useNavigate()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
        navigate('/dashboard')
        return
      } else {
        await signup(name, email, password);
        setIsLogin(true)
      }
    } catch (err) {
      console.error(err);
    }
  };

  // const toggleForm = () => {
  //   setIsLogin(!isLogin);
  //   setEmail('');
  //   setPassword('');
  //   setName('');
  // };

  return (
    <div className="min-h-screen bg-[#0a061e] text-white">
      <nav className="px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Terminal className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold">DevOpsLearn</span>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="bg-[#1a1533] rounded-2xl p-8 shadow-xl border border-purple-500/20">
            <div className="flex mb-8 bg-[#2a2444] rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-md transition-colors ${
                  isLogin ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-md transition-colors ${
                  !isLogin ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#2a2444] border border-purple-500/30 rounded-lg py-3 px-11 focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#2a2444] border border-purple-500/30 rounded-lg py-3 px-11 focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#2a2444] border border-purple-500/30 rounded-lg py-3 px-11 focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error.message}</p>}

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-medium transition-colors"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
