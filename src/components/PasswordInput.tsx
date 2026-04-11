"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  /** Classes on the wrapping div */
  wrapperClassName?: string;
  /** Classes on the input (right padding for the icon is appended) */
  inputClassName: string;
};

/**
 * Password field with show/hide toggle (eye icon).
 */
export function PasswordInput({
  wrapperClassName = "",
  inputClassName,
  className,
  disabled,
  ...props
}: PasswordInputProps) {
  void className;
  const [show, setShow] = useState(false);

  return (
    <div className={`relative ${wrapperClassName}`}>
      <input
        type={show ? "text" : "password"}
        disabled={disabled}
        className={`${inputClassName} pe-12`}
        {...props}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => setShow((v) => !v)}
        className="absolute top-1/2 -translate-y-1/2 end-3 rounded-lg p-1.5 text-muted transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          <EyeOff className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <Eye className="h-4 w-4 shrink-0" aria-hidden />
        )}
      </button>
    </div>
  );
}
