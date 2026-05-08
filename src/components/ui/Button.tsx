'use client';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

    const variants = {
      primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25',
      secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
      ghost: 'hover:bg-white/10 text-white/80 hover:text-white',
      danger: 'bg-red-600 hover:bg-red-500 text-white',
      glass: 'bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-5 py-2.5 text-sm rounded-xl',
      lg: 'px-7 py-3.5 text-base rounded-2xl',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
export default Button;
