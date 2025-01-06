import { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'px-6 py-2 rounded-lg font-medium transition-colors',
        variant === 'primary' && 'bg-amber-600 text-white hover:bg-amber-700',
        variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}