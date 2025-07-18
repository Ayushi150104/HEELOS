import clsx from 'clsx';
import React, { useState } from 'react';
import Button from './Button';

type CalendarProps = {
  className?: string;
  info: string;
  button?: { icon: React.ReactNode; className?: string; onClick?: () => void }[];
  darkMode?: boolean; // <-- new prop
};

const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const Calendar: React.FC<CalendarProps> = ({ className = '', info, button = [], darkMode = false }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedMonth] = useState(today.getMonth());
  const [selectedYear] = useState(today.getFullYear());

  const getCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const weeks = [];
    // Adjust firstDay to Monday = 0
    const offset = (firstDay + 6) % 7;
    let currentDay = 1 - offset;

    for (let week = 0; week < 6; week++) {
      const weekDaysArr = [];
      for (let day = 0; day < 7; day++) {
        if (currentDay < 1 || currentDay > daysInMonth) {
          weekDaysArr.push(null);
        } else {
          weekDaysArr.push(currentDay);
        }
        currentDay++;
      }
      weeks.push(weekDaysArr);
    }
    return weeks;
  };

  const calendarDays = getCalendarDays(selectedYear, selectedMonth);

  // Define colors based on darkMode prop
  const containerBg = darkMode ? 'bg-[#1e1e1e]' : 'bg-white';
  const containerShadow = darkMode ? 'shadow-lg shadow-black/70' : 'shadow-lg shadow-gray-300';
  const weekdayTextColor = darkMode ? 'text-blue-400' : 'text-blue-700';
  const dateTextColor = darkMode ? 'text-white' : 'text-gray-900';
  const selectedBg = darkMode ? 'bg-green-500' : 'bg-green-600';
  const hoverBg = darkMode ? 'hover:bg-green-600' : 'hover:bg-green-700';
  const infoTextColor = darkMode ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className="flex justify-center items-center w-full">
      <div
        className={clsx(
          containerBg,
          containerShadow,
          'p-4 sm:p-6 rounded-xl w-full max-w-md',
          className
        )}
      >
        {/* Day Headers */}
        <div className={clsx('grid grid-cols-7 text-center font-semibold mb-2 sm:mb-4 text-xs sm:text-base', weekdayTextColor)}>
          {weekDays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
          {calendarDays.flat().map((date, idx) => (
            <div
              key={idx}
              role={date ? 'button' : undefined}
              tabIndex={date ? 0 : -1}
              onClick={() => date && setSelectedDate(date)}
              onKeyDown={(e) => {
                if (date && (e.key === 'Enter' || e.key === ' ')) {
                  setSelectedDate(date);
                }
              }}
              className={clsx(
                'h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full cursor-pointer transition-all select-none',
                date === selectedDate
                  ? `${selectedBg} text-white font-bold`
                  : `${dateTextColor} ${hoverBg} hover:text-white`,
                !date && 'opacity-20 pointer-events-none'
              )}
            >
              {date || ''}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          {/* Task Info */}
          <div className={clsx('text-xs sm:text-sm mb-3 sm:mb-4 text-left break-words w-[10em]', infoTextColor)}>
            {info}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 flex-row">
            {button.map((btn, idx) => (
              <Button key={idx} className={btn.className} icon={btn.icon} onClick={btn.onClick} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
