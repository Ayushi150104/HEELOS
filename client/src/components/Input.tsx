import clsx from "clsx";
import React from "react";

type InputProp = React.InputHTMLAttributes<HTMLInputElement> & {
  placeHolder?: string;
  darkMode?: boolean;
};

const Input: React.FC<InputProp> = ({
  type = "text",
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
        aria-label={placeHolder}
        className={clsx(
          "w-full rounded-xl px-4 py-3 text-base font-normal transition duration-300 ease-in-out outline-none",
          "border",
          "placeholder:text-sm placeholder:font-normal",
          darkMode
            ? "bg-zinc-900 border-zinc-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600",
          className
        )}
        {...rest}
      />
    </div>
  );
};

export default Input;
