import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl transition-all disabled:opacity-50 disabled:pointer-events-none focus:outline-none',
          {
            'clay-btn': variant === 'primary',
            'clay-btn-secondary': variant === 'secondary',
            'border-2 border-[var(--color-navy)] bg-transparent text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-white': variant === 'outline',
            'bg-transparent hover:bg-black/5 text-[var(--color-navy)]': variant === 'ghost',
            'h-10 px-4 text-sm': size === 'sm',
            'h-14 px-6 text-base': size === 'md',
            'h-16 px-8 text-lg font-bold': size === 'lg',
            'h-12 w-12': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
