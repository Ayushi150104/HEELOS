import clsx from 'clsx';
import React from 'react';
import Button from './Button';

type DialogProps = {
  isOpen: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  Header?: string;
  Body?: string;
  color?: string | "text-black";
  className?: string;
  darkMode?: boolean;
  subTasks?: {
    name: string;
    des: string;
    color: string;
    date: string;
    completion: number;
  }[];
  button: {
    text: string;
    onClick: () => void;
    className?: string;
  }[];
};

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  subTasks,
  setIsOpen,
  Header,
  Body,
  className,
  darkMode = false,
  button,
  color,
}) => {
  if (!isOpen) return null;
  const appliedColor = typeof color === 'string' && color.trim() !== '' ? color : 'text-black';


  return (
    <div
      className={clsx(
        'fixed inset-0 flex items-center justify-center z-50 py-[5em] overflow-auto',
        darkMode ? 'bg-black/70' : 'bg-black/50'
      )}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        className={clsx(
          'w-full max-w-md rounded-lg shadow-lg p-6 text-black',
          darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black',
          className
        )}
      >
        {/* Header */}
        <div className={clsx(`text-lg font-semibold`, appliedColor)}>{Header ?? 'Dialog Header'}</div>
        <hr className={clsx('my-4', darkMode ? 'border-gray-700' : 'border-gray-300')} />

        {/* Body */}
        <div className={clsx('mb-6 text-sm', darkMode ? 'text-gray-300' : 'text-gray-800')}>
          {Body ?? 'Dialog Body Content'}
        </div>

        {/* Subtasks */}
        {Array.isArray(subTasks) && subTasks.length > 0 && (
          <div className="mb-6 space-y-2">
            <div className="font-semibold text-base">Subtasks:</div>
            {subTasks.map((st, idx) => (
              <div
                key={idx}
                className={clsx(
                  'p-3 rounded-md text-sm',
                  darkMode ? 'bg-gray-800 text-black' : 'bg-gray-100 text-black'
                )}
              >
                <div className="font-bold">{st.name}</div>
                <div className="text-xs">{st.des}</div>
                <div className="text-xs text-gray-500">
                  Due: {st.date} | Progress: {st.completion}%
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        {button.map((btn, idx) => (
          <Button
            key={idx}
            text={btn.text}
            className={clsx('w-full mb-2 p-4 py-2', btn.className)}
            onClick={() => {
              btn.onClick();
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Dialog;
