import clsx from 'clsx';
import React from 'react';

type ButtonProps = {
  className?: string;
  onClick?: () => void;
  text?: string;  // prefer lowercase 'string'
  disabled?: boolean;
  icon?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ className, onClick, text, disabled = false, icon }) => {
  return (
    <button
      className={clsx('inline-flex items-center justify-center gap-2', className)}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {icon}
      {text}
    </button>
  );
};

export default Button;
