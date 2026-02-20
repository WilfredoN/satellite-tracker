import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'default' | 'error';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}


const baseClasses =
  'cursor-pointer border-2 px-4 py-2 font-bold uppercase tracking-wider transition-all focus:shadow-[var(--glow-strong)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:hover:shadow-none bg-transparent';

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'border-(--foreground) text-[var(--foreground)] hover:text-[var(--background)] hover:bg-[var(--foreground)]',
  error:
    'border-(--destructive) text-(--destructive) hover:text-white hover:bg-red-700',
};

export const Button = ({ className = '', variant = 'default', ...props }: ButtonProps) => (
  <button
    className={clsx(baseClasses, variantClasses[variant], className)}
    {...props}
  />
);
