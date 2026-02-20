import type { ChangeEvent,InputHTMLAttributes } from 'react';
import { useRef } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  clearable?: boolean;
  onClear?: () => void;
};

export const Input = ({
  className = '',
  clearable = false,
  onClear,
  value,
  onChange,
  ...props
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const showClear = clearable && value && String(value).length > 0;

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      const event = {
        ...((typeof Event === 'function'
          ? new Event('input', { bubbles: true })
          : {}) as ChangeEvent<HTMLInputElement>),
        target: {
          ...inputRef.current,
          value: '',
          name: props.name,
        },
      } as ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        className={`border-(--foreground) bg-(--input) text-(--foreground) placeholder:text-(--muted) focus:shadow-(--glow) w-full border-2 px-3 py-2 pr-8 font-mono tracking-wide outline-none transition-all disabled:cursor-not-allowed disabled:opacity-30 ${className}`}
        value={value}
        onChange={onChange}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          aria-label="Clear input"
          tabIndex={0}
          onClick={handleClear}
          className="text-(--muted) hover:text-(--destructive) h-7.5 w-7.5 absolute right-2 top-1/2 m-0 -translate-y-1/2 cursor-pointer bg-transparent p-0 text-3xl focus:outline-none"
          style={{ lineHeight: 1 }}
        >
          ×
        </button>
      )}
    </div>
  );
};
