import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600': variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500': variant === 'secondary',
          'text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500': variant === 'ghost',
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};