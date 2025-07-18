import React from 'react';
import clsx from 'clsx';
import { BiDesktop, BiServer } from 'react-icons/bi';
import { FaList } from 'react-icons/fa';
import Card from '../components/Cards/Cards';
import ProfileButton from '../components/ProfileButton';
import TaskCard from '../components/Cards/taskCard';
import Schedule from '../components/Schedule';
import { schedules } from '../assets/Data';

interface ProfileProps {
  darkMode: boolean;
}

// Compute total tasks count from schedules
const totalTasksCount = schedules.flatMap(s => s.tasks || []).length;

const stats = [
  { label: 'Total Tasks', value: totalTasksCount, Icon: FaList, accent: 'blue' },
  { label: 'Servers', value: 3, Icon: BiServer, accent: 'yellow' },
  { label: 'Desktops', value: 5, Icon: BiDesktop, accent: 'green' },
  { label: 'Desktops', value: 5, Icon: BiDesktop, accent: 'green' },
];

// Flatten all tasks from all schedules
const allTasks = schedules.flatMap(schedule => schedule.tasks || []);

// Format today's date string yyyy-mm-dd for filtering tasks by deadline
const todayKey = new Date().toISOString().split('T')[0];

// Filter tasks whose endBy matches today (date only)
const scheduleTasksForToday = allTasks
  .filter(task => {
    if (!task.endBy) return false;
    const taskDateKey = new Date(task.endBy).toISOString().split('T')[0];
    return taskDateKey === todayKey;
  })
  .map(task => ({
    title: task.name,
    start: task.startHour ?? 9, // fallback start time if missing
    end: task.endHour ?? (task.startHour ? task.startHour + 1 : 10), // fallback end time
    priority: (task.priority ?? 'normal').toUpperCase(),
  }));

// Recent 4 tasks, most recent last
const recentScheduleTasks = allTasks.slice(-4).reverse();

const Profile: React.FC<ProfileProps> = ({ darkMode }) => {
  const containerBg = darkMode
    ? 'bg-gradient-to-br from-[#1b1b1b] to-[#27292c] text-white'
    : 'bg-gradient-to-br from-[#f7f7ff] to-[#e4e6fb] text-[#232946]';

  const panelBg = darkMode
    ? 'bg-[#232526]/90 text-white backdrop-blur border border-gray-700'
    : 'bg-white/70 text-black backdrop-blur border border-gray-300';

  const tableHeaderBg = darkMode ? 'bg-[#2d2f33]' : 'bg-[#e4e6fb]';
  const tableRowHover = darkMode ? 'hover:bg-[#393e6c]' : 'hover:bg-[#cdd0f0]';

  return (
    <div
      className={clsx(
        'min-h-screen w-full md:w-fit p-4 sm:p-6 md:p-8 relative md:left-[2em] top-[2em] left-[2.8em]',
        containerBg
      )}
    >
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">My Profile</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 w-full">
        {stats.map(({ label, value, Icon, accent }) => (
          <Card
            key={label}
            darkMode={darkMode}
            title={label}
            icon={<Icon />}
            className="p-5 sm:p-6 rounded-xl shadow-lg backdrop-blur transition-colors w-full"
            iconContainerClassName={clsx(
              'rounded-full p-3 transition-colors',
              accent === 'blue' && 'bg-blue-500 text-white hover:bg-blue-600',
              accent === 'yellow' && 'bg-yellow-400 text-black hover:bg-yellow-500',
              accent === 'green' && 'bg-green-500 text-white hover:bg-green-600'
            )}
            body={String(value)}
            bodyClassName="text-3xl sm:text-4xl font-semibold mt-3 sm:mt-4"
          />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full">
        {/* Left Panel: Avatar & Recent Tasks */}
        <aside className="w-full lg:w-1/3 flex flex-col space-y-6 mr-16">
          <div className={clsx('p-5 sm:p-6 rounded-xl shadow-lg w-full', panelBg)}>
            <div className="flex flex-col items-center">
              <ProfileButton
                avatarUrl="https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg"
                classImg="h-[4em] w-[4em] rounded-full object-cover scale-[4] mb-16"
              />
              <h2 className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-center">
                Chandransh_WK
              </h2>
              <p className="text-center text-gray-400">Plan: Basic</p>
            </div>
          </div>

          <div className={clsx('p-5 sm:p-6 rounded-xl shadow-lg w-max relative md:left-0 left-8', panelBg)}>
            <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
            <div className="flex flex-col gap-5 w-max">
              {recentScheduleTasks.map((task, idx) => (
                <TaskCard
                  key={idx}
                  imp={task.priority}
                  name={task.name || task.title}
                  des={task.description || task.des || ''}
                  tags={task.tags || []}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Right Panel: Schedule & Task List */}
        <main className="flex-1 md:flex flex-col space-y-6 lg:space-y-10 w-full hidden mr-16 ">
          <div
            className={clsx(
              'p-5 sm:p-6 rounded-xl shadow-lg overflow-x-auto w-full',
              panelBg
            )}
          >
            <h3 className="text-lg font-semibold mb-4">Task List</h3>
            <table className="min-w-full text-left border-collapse">
              <thead className={clsx(tableHeaderBg)}>
                <tr>
                  <th className="py-3 px-4 sm:px-6 text-sm font-semibold tracking-wide">
                    Title
                  </th>
                  <th className="py-3 px-4 sm:px-6 text-sm font-semibold tracking-wide">
                    Priority
                  </th>
                  <th className="py-3 px-4 sm:px-6 text-sm font-semibold tracking-wide">
                    Deadline
                  </th>
                </tr>
              </thead>
              <tbody>
                {allTasks.map((task, idx) => {
                  // Map priority to badge color classes
                  const priority = (task.priority || '').toLowerCase();
                  const priorityColors: Record<string, string> = {
                    high: 'bg-red-100 text-red-700',
                    med: 'bg-yellow-100 text-yellow-700',
                    normal: 'bg-blue-100 text-blue-700',
                    low: 'bg-green-100 text-green-700',
                  };
                  const badgeClass = priorityColors[priority] || 'bg-gray-100 text-gray-700';

                  return (
                    <tr
                      key={idx}
                      className={clsx(
                        idx % 2 === 0
                          ? 'bg-white dark:bg-gray-800'
                          : 'bg-gray-50 dark:bg-gray-900',
                        'cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors'
                      )}
                    >
                      <td
                        className="py-3 px-4 sm:px-6 max-w-xs truncate"
                        title={task.name}
                      >
                        {task.name}
                      </td>
                      <td className="py-3 px-4 sm:px-6">
                        <span
                          className={clsx(
                            'inline-block px-3 py-1 text-xs font-semibold rounded-full',
                            badgeClass
                          )}
                        >
                          {task.priority?.toUpperCase() || 'NORMAL'}
                        </span>
                      </td>
                      <td className="py-3 px-4 sm:px-6 whitespace-nowrap">
                        {task.endBy
                          ? new Date(task.endBy).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'No deadline'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
