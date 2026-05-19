import { Moon, Sun, LogOut, User, Menu } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 lg:px-6 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">SL</span>
          </div>
          <span className="hidden sm:block font-semibold text-gray-900 dark:text-white text-lg">
            Smart Leads
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Toggle dark mode"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 bg-gray-100 dark:bg-gray-700">
          <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};
