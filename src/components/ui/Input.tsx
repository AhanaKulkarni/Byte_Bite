import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-14 w-full neumorphic-input px-4 py-2 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-byte-orange)] disabled:cursor-not-allowed disabled:opacity-50 text-[var(--color-navy)] transition-shadow',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
