import clsx from 'clsx';
import React from 'react';

type taskCardProp = {
  imp?: string;
  name: string;
  des: string;
  tags: string[];
  darkMode: boolean;
  cn?: string;
};

const TaskCard: React.FC<taskCardProp> = ({ imp, name, des, tags, darkMode, cn }) => {
  let ic = '';
  if (imp === 'high') {
    ic = 'bg-red-500';
  } else if (imp === 'medium') {
    ic = 'bg-yellow-500';
  } else if (imp === 'low') {
    ic = 'bg-green-500';
  } else {
    ic = 'bg-zinc-400';
  }

  const cardBg = darkMode ? 'bg-zinc-800/50 text-white' : 'bg-gray-200/50 text-zinc-900';
  const tagBg = darkMode ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-zinc-800';

  return (
    <div
      className={clsx(`flex justify-between items-start gap-4 p-4 w-[22.5em] relative rounded-lg shadow ${cardBg} flex-wrap`, cn)}
    >
      {/* Left Section - Dot & Details */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Importance Dot */}
        <div className={`${ic} h-4 w-4 rounded-full mt-1 shrink-0 mr-2`} />

        {/* Task Details */}
        <div className="flex flex-col flex-1 min-w-fit ">
          <div className="font-semibold text-lg break-words relative   -top-0.5">{name}</div>
          <div className="text-sm break-words relative -left-7 text-left ">{des}</div>
        </div>
      </div>

      {/* Right Section - Tags */}
      <div className="flex flex-wrap gap-2 max-w-[7em] justify-end">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className={`px-3 py-1 rounded text-xs font-medium ${tagBg} hover:bg-red-300 transition-all duration-200 break-words text-center`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
