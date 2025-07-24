import React from 'react';
import clsx from 'clsx';

type TagsProps = {
  text: string;
  darkMode: boolean;
  selected: boolean; // ✅ Required now
  onClick: (text: string) => void;
  onClicked: () => void;
};

const Tags: React.FC<TagsProps> = ({ text, darkMode, selected, onClick, onClicked }) => {
  return (
    <div
      onClick={() => onClick(text)} // ✅ Just call parent
      role="button"
      onDoubleClick={onClicked} // ✅ Call onClicked prop
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(text); }}
      className={clsx(
        'inline-block select-none rounded-lg border font-medium transition duration-300 ease-in-out cursor-pointer px-4 py-2 text-sm',
        'focus:outline-none focus:ring-offset-0',
        {
          // Dark mode
          'bg-zinc-800 text-white border-zinc-700 hover:bg-blue-800 hover:shadow-lg':
            darkMode && !selected,
          'bg-blue-600 text-white border-blue-500 shadow-md':
            darkMode && selected,

          // Light mode
          'bg-gray-50/70 text-gray-800 border-gray-300 hover:bg-blue-100 hover:shadow-md':
            !darkMode && !selected,
          'bg-blue-500 text-white border-blue-600 shadow-lg':
            !darkMode && selected,
        }
      )}
    >
      {text}
    </div>
  );
};


export default Tags;
