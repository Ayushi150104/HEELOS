import clsx from 'clsx';
import React from 'react';

type Task = {
  name: string;
  color: string;
};

type TabletipProps = {
  darkMode: boolean;
  tasks?: Task[];
  className?: string;
  children?: React.ReactNode;
  open?: boolean;
  title?: string;
  selected: (task: Task) => void; // ✅ Accepts selected task
};

const Tabletip: React.FC<TabletipProps> = ({
  darkMode,
  selected,
  tasks,
  children,
  className,
  title,
  open = false,
}) => {
  if (!open) return <>{children}</>;

  return (
    <div className={clsx('relative inline-block w-max h-max', className)}>
      {children}

      <div
        className="
          absolute top-1/2 left-full ml-4 -translate-y-1/2 z-50
          animate-[fadeIn 0.3s ease-in-out] scale-95 origin-left w-max h-max
        "
      >
        <div
          className={clsx(
            'rounded-xl shadow-2xl backdrop-blur-md transition-all px-4 py-3 max-w-sm border',
            darkMode
              ? 'bg-white/10 text-white border-white/10'
              : 'bg-white/90 text-gray-900 border-gray-300'
          )}
        >
          <h4 className="text-xl font-semibold mb-2 tracking-[0.2em]">
            {title}
          </h4>
          <hr className="text-gray-300/50 mb-4" />
          <div className="flex flex-col gap-4 text-left">
            {tasks?.map((card, idx) => (
              <div
                key={idx}
                onClick={() => selected(card)} // ✅ When clicked, send to parent
                className={`bg-zinc-900/10 p-4 flex gap-4 rounded-lg cursor-pointer hover:scale-[1.01] transition-transform`}
              >
                <div className={` w-3 h-full text-transparent rounded-r-sm`} style={{background: card.color}}>
                  f
                </div>
                <span>{card.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Glowing Arrow */}
        <div
          className={clsx(
            'absolute w-2.5 h-2.5 rotate-45 top-1/2 -left-1.5 transform -translate-y-1/2',
            darkMode ? 'bg-white/20 shadow-white/20' : 'bg-white shadow-md'
          )}
        />
      </div>
    </div>
  );
};

export default Tabletip;
