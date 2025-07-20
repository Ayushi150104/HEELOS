import clsx from 'clsx';
import React from 'react';

type InputProp = React.InputHTMLAttributes<HTMLInputElement> & {
  placeHolder?: string;
  darkMode?: boolean;
};

const Input: React.FC<InputProp> = ({
  type,
  placeHolder,
  className,
  darkMode = false,
  ...rest
}) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeHolder}
        className={clsx(
          'h-auto w-full p-4 rounded-2xl border transition-colors duration-300 text-black',
          darkMode
            ? 'bg-gray-800  border-gray-600 placeholder-gray-400 focus:border-blue-500'
            : 'bg-white  border-gray-300 placeholder-gray-500 focus:border-blue-600',
          className
        )}
        {...rest}
      />
    </div>
  );
};

export default Input;
