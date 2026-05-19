import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400',
  secondary:
    'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600',
  danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400',
  ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) => (
  <button
    disabled={disabled ?? isLoading}
    className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    {...props}
  >
    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
    {children}
  </button>
);
