import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'solid' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    'bg-gradient-to-r from-brand-accent/30 via-brand-accent2/30 to-brand-accent/20 text-white shadow-brand-md hover:from-brand-accent/50 hover:to-brand-accent2/40 disabled:opacity-60 disabled:cursor-not-allowed',
  outline:
    'border border-white/10 bg-transparent text-slate-200 hover:border-brand-accent/60 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed',
  ghost:
    'bg-white/5 text-slate-200 hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed'
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'solid', size = 'md', type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/80 disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
