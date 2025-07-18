import React from 'react';

type Task = {
  title: string;
  start: number;
  end: number;
  priority: 'HIGH' | 'MED' | 'NORMAL' | 'LOW';
};

type ScheduleProps = {
  tasks: Task[];
  date?: string;
  startHour?: number;
  totalHours?: number;
  priorities?: ('HIGH' | 'MED' | 'NORMAL' | 'LOW')[];
  darkMode: boolean,
};

const defaultPriorities = ['HIGH', 'MED', 'NORMAL', 'LOW'] as const;

const getTaskBarPosition = (
  taskStart: number,
  taskEnd: number,
  startHour: number,
  totalHours: number
) => {
  const start = Math.max(taskStart, startHour);
  const end = Math.min(taskEnd, startHour + totalHours);
  const leftPercent = ((start - startHour) / totalHours) * 100;
  const widthPercent = ((end - start) / totalHours) * 100;
  return { leftPercent, widthPercent };
};

const formatHour = (hour: number) => {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  const suffix = hour < 12 || hour === 24 ? 'am' : 'pm';
  return `${h}:00${suffix}`;
};

const priorityStyleMap: Record<string, { border: string; bg: string; darkBg: string }> = {
  HIGH: { border: 'border-red-600', bg: 'bg-red-500/20', darkBg: 'bg-red-800/40' },
  MED: { border: 'border-yellow-600', bg: 'bg-yellow-400/20', darkBg: 'bg-yellow-700/40' },
  NORMAL: { border: 'border-blue-600', bg: 'bg-blue-500/20', darkBg: 'bg-blue-800/40' },
  LOW: { border: 'border-green-600', bg: 'bg-green-500/20', darkBg: 'bg-green-800/40' },
};

// Helper to split hours for mobile
const getHourLabels = (startHour: number, count: number) =>
  Array.from({ length: count + 1 }, (_, i) => formatHour((startHour + i) % 24));

const Schedule: React.FC<ScheduleProps> = ({
  tasks,
  date = 'Today',
  startHour = 9,
  totalHours = 12,
  priorities = defaultPriorities,
  darkMode,
}) => {
  const halfHours = Math.ceil(totalHours / 2);

  // For each half, get startHour and hourLabels
  const halves = [
    {
      start: startHour,
      count: halfHours,
      hourLabels: getHourLabels(startHour, halfHours),
    },
    {
      start: startHour + halfHours,
      count: totalHours - halfHours,
      hourLabels: getHourLabels(startHour + halfHours, totalHours - halfHours),
    },
  ];

  // Set background classes based on darkMode
  const containerBg = darkMode
    ? 'bg-[#18181b] border-gray-700 text-white'
    : 'bg-white/40 border-gray-300 text-black';

  return (
    <div className="overflow-x-auto w-full mt-[7em]">
      <div className={`
        min-w-[320px] sm:min-w-[600px] p-2 sm:p-6 rounded-lg shadow backdrop-blur border
        ${containerBg}
        transition-colors
        max-w-full
      `}>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Schedule for {date}
        </h2>

        {/* Responsive: On small screens, show two rows; on sm+ show one */}
        <div className="space-y-2 sm:space-y-4">
          {priorities.map((priority) => {
            const rowTasks = tasks
              .filter((t) => t.priority === priority)
              .sort((a, b) => a.start - b.start);

            const style = priorityStyleMap[priority];

            return (
              <div key={priority} className="flex flex-col gap-2 sm:flex-row sm:gap-0 items-start sm:items-center">
                <div className="w-14 sm:w-20 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
                  {priority}
                </div>
                {/* Mobile: two rows */}
                <div className="flex-1 flex flex-col gap-2 sm:hidden">
                  {halves.map((half, halfIdx) => (
                    <div key={halfIdx} className="relative h-7">
                      {/* Gridlines */}
                      <div
                        className="absolute inset-0 grid"
                        style={{
                          gridTemplateColumns: `repeat(${half.count}, minmax(min(3rem, 10vw), 1fr))`,
                        }}
                      >
                        {Array.from({ length: half.count }).map((_, i) => (
                          <div
                            key={i}
                            className="border-r border-dashed border-gray-200 dark:border-gray-700"
                          />
                        ))}
                      </div>
                      {/* Hour labels */}
                      <div className="absolute -top-5 left-0 w-full flex">
                        {half.hourLabels.map((lbl, i) => (
                          <div
                            key={i}
                            className="flex-1 text-center text-[10px] text-gray-600 dark:text-gray-400"
                          >
                            {lbl}
                          </div>
                        ))}
                      </div>
                      {/* Task Bars */}
                      {rowTasks.map((task, idx) => {
                        // Only render if task overlaps this half
                        const taskStart = Math.max(task.start, half.start);
                        const taskEnd = Math.min(task.end, half.start + half.count);
                        if (taskEnd <= taskStart) return null;
                        const { leftPercent, widthPercent } = getTaskBarPosition(
                          taskStart,
                          taskEnd,
                          half.start,
                          half.count
                        );
                        if (widthPercent <= 0) return null;
                        return (
                          <div
                            key={idx}
                            className={`
                              absolute top-0 h-7 rounded-lg shadow-sm flex items-center justify-center text-[10px] font-medium 
                              ${darkMode ? style.darkBg : style.bg} ${style.border}
                              text-gray-800 dark:text-gray-100
                              transition-colors
                              px-1
                              overflow-hidden whitespace-nowrap text-ellipsis
                            `}
                            style={{
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                              minWidth: '2rem',
                              maxWidth: '100%',
                            }}
                            title={`${task.title} (${formatHour(task.start)} - ${formatHour(task.end)})`}
                          >
                            {task.title}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                {/* Desktop: single row */}
                <div className="relative flex-1 h-7 sm:h-8 hidden sm:block">
                  {/* Gridlines */}
                  <div
                    className="absolute inset-0 grid"
                    style={{
                      gridTemplateColumns: `repeat(${totalHours}, minmax(min(3rem, 10vw), 1fr))`,
                    }}
                  >
                    {Array.from({ length: totalHours }).map((_, i) => (
                      <div
                        key={i}
                        className="border-r border-dashed border-gray-200 dark:border-gray-700"
                      />
                    ))}
                  </div>
                  {/* Hour labels */}
                  <div className="absolute -top-5 left-0 w-full flex">
                    {getHourLabels(startHour, totalHours).map((lbl, i) => (
                      <div
                        key={i}
                        className="flex-1 text-center text-[10px] text-gray-600 dark:text-gray-400"
                      >
                        {lbl}
                      </div>
                    ))}
                  </div>
                  {/* Task Bars */}
                  {rowTasks.map((task, idx) => {
                    const { leftPercent, widthPercent } = getTaskBarPosition(
                      task.start,
                      task.end,
                      startHour,
                      totalHours
                    );
                    if (widthPercent <= 0) return null;
                    return (
                      <div
                        key={idx}
                        className={`
                          absolute top-0 h-7 sm:h-8 rounded-lg shadow-sm flex items-center justify-center text-[10px] sm:text-xs font-medium 
                          ${darkMode ? style.darkBg : style.bg} ${style.border}
                          text-gray-800 dark:text-gray-100
                          transition-colors
                          px-1 sm:px-2
                          overflow-hidden whitespace-nowrap text-ellipsis
                        `}
                        style={{
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`,
                          minWidth: '2rem',
                          maxWidth: '100%',
                        }}
                        title={`${task.title} (${formatHour(task.start)} - ${formatHour(task.end)})`}
                      >
                        {task.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
