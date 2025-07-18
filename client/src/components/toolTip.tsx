import clsx from 'clsx';
import React from 'react';

type TooltipProps = {
  darkMode: boolean;
  text: string;
  className: string;
  children: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ darkMode, text, children, className }) => {
  return (
    <div className={clsx("relative group inline-block", className)}>
      {children}

      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 duration-200 pointer-events-none z-50 scale-90 group-hover:scale-100 transition-all"
>
        {/* Tooltip bubble */}
        <div
          className={`
            px-3 py-2 rounded-md text-sm shadow-lg whitespace-nowrap
            ${darkMode ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}
          `}
        >
          {text}
        </div>

        {/* Arrow */}
        <div
          className={`
            absolute w-2 h-2 rotate-45
            ${darkMode ? 'bg-white' : 'bg-gray-800'}
            left-1/2 -bottom-1 transform -translate-x-1/2
          `}
        />
      </div>
    </div>
  );
};

export default Tooltip;
