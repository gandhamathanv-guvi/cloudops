import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, LogOut } from 'lucide-react';
import { Button } from './Button';

interface NavbarProps {
  user?: { name: string; avatar: string; };
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Terminal className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">DevOps Academy</span>
            </Link>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{user.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};