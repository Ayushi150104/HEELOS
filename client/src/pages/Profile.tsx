import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { BiRefresh } from 'react-icons/bi';
import { FaList } from 'react-icons/fa';
import Card from '../components/Cards/Cards';
import ProfileButton from '../components/ProfileButton';
import TaskCard from '../components/Cards/taskCard';
import axiosInstance from '../api/axiosInstance'; // make sure this includes token logic
import { SiTicktick } from 'react-icons/si';
import { LuClockAlert } from "react-icons/lu";

interface ProfileProps {
  darkMode: boolean;
}

interface Task {
  name: string;
  description?: string;
  endBy?: string;
  status?: string;
  priority?: string;
  tags?: string[];
  startHour?: number;
  endHour?: number;
}

interface UserData {
  username: string;
  plan: string;
  schedules?: { tasks?: Task[] }[]; // added schedules since you use it
}

const Profile: React.FC<ProfileProps> = ({ darkMode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    axiosInstance.get('/tasks/my')
      .then(res => setUserData(res.data))
      .catch(err => console.error('Failed to load user data:', err));
  }, []);

  // Flatten all tasks from schedules
  const allTasks = userData?.schedules?.flatMap(schedule => schedule.tasks || []) ?? [];

  const totalTasksCount = allTasks.length;
  
  // Stats cards data
  const stats = [
    { label: 'Total Tasks', value: totalTasksCount, Icon: FaList, accent: 'blue' },
    { label: 'Pending', value: allTasks.filter(t => t.status === 'pending').length, Icon: BiRefresh, accent: 'yellow' },
    { label: 'Completed', value: allTasks.filter(t => t.status === 'completed').length, Icon: SiTicktick, accent: 'green' },
    { label: 'Overdue', value: allTasks.filter(t => t.status === 'overdue').length, Icon: LuClockAlert, accent: 'red' },
  ];

  // Last 4 tasks for Urgent Tasks (you can filter by 'urgent' tag if you want)
  const recentScheduleTasks = allTasks.slice(-4).reverse();

  const containerBg = darkMode
    ? 'bg-gradient-to-br from-[#1b1b1b] to-[#27292c] text-white'
    : 'bg-gradient-to-br from-[#f7f7ff] to-[#e4e6fb] text-[#232946]';

  const panelBg = darkMode
    ? 'bg-[#232526]/90 text-white backdrop-blur border border-gray-700'
    : 'bg-white/70 text-black backdrop-blur border border-gray-300';

  return (
    <div className={clsx('min-h-screen w-full md:w-fit p-4 sm:p-6 md:p-8 relative md:left-[2em] top-[2em] left-[2.8em]', containerBg)}>
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
              accent === 'green' && 'bg-green-500 text-white hover:bg-green-600',
              accent === 'red' && 'bg-red-500 text-white hover:bg-red-600',
            )}
            body={String(value)}
            bodyClassName="text-3xl sm:text-4xl font-semibold mt-3 sm:mt-4"
          />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full">
        {/* Profile & Recent Tasks */}
        <aside className="w-full lg:w-1/3 flex flex-col space-y-6 mr-16">
          <div className={clsx('p-5 sm:p-6 rounded-xl shadow-lg w-full', panelBg)}>
            <div className="flex flex-col items-center">
              <ProfileButton
                avatarUrl="https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg"
                classImg="h-[4em] w-[4em] rounded-full object-cover scale-[4] mb-16"
              />
              <h2 className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-center">
                {userData?.username || 'Loading...'}
              </h2>
              <p className="text-center text-gray-400">Plan: {userData?.plan || 'Loading...'}</p>
            </div>
          </div>

          <div className={clsx('p-5 sm:p-6 rounded-xl shadow-lg w-max relative md:left-0 left-8', panelBg)}>
            <h3 className="text-lg font-semibold mb-4">Urgent Tasks</h3>
            <div className="flex flex-col gap-5 w-max">
              {recentScheduleTasks.map((task, idx) => (
                <TaskCard
                  key={idx}
                  imp={task.priority}
                  name={task.name}
                  des={task.description || ''}
                  tags={task.tags || []}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Task List */}
        <main className="flex-1 md:flex flex-col space-y-6 lg:space-y-10 w-full hidden mr-16">
          <div className={clsx('p-5 sm:p-6 rounded-xl shadow-lg overflow-x-auto w-full', darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-gray-900')}>
            <h3 className="text-lg font-semibold mb-4">Task List</h3>
            <table className="min-w-full text-left border-collapse">
              <thead className={clsx(darkMode ? 'bg-zinc-700 text-white' : 'bg-gray-100 text-gray-700')}>
                <tr>
                  <th className="py-3 px-4 sm:px-6 text-sm font-semibold tracking-wide">Title</th>
                  <th className="py-3 px-4 sm:px-6 text-sm font-semibold tracking-wide">Priority</th>
                  <th className="py-3 px-4 sm:px-6 text-sm font-semibold tracking-wide">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {allTasks.map((task, idx) => {
                  const priority = (task.priority || '').toLowerCase();

                  // Normalize priority for med/medium
                  const normalizedPriority = priority === 'medium' || priority === 'medium' ? 'medium' : priority;

                  const badgeClass = clsx(
                    'inline-block px-3 py-1 text-xs font-semibold rounded-full',
                    normalizedPriority === 'high'
                      ? darkMode
                        ? 'bg-red-900 text-red-300'
                        : 'bg-red-100 text-red-700'
                      : normalizedPriority === 'medium'
                      ? darkMode
                        ? 'bg-yellow-900 text-yellow-300'
                        : 'bg-yellow-100 text-yellow-700'
                      : normalizedPriority === 'low'
                      ? darkMode
                        ? 'bg-green-900 text-green-300'
                        : 'bg-green-100 text-green-700'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-700'
                  );

                  return (
                    <tr
                      key={idx}
                      className={clsx(
                        idx % 2 === 0
                          ? darkMode ? 'bg-zinc-800' : 'bg-white'
                          : darkMode ? 'bg-zinc-900' : 'bg-gray-50',
                        'cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors'
                      )}
                    >
                      <td className="py-3 px-4 sm:px-6 max-w-xs truncate" title={task.name}>{task.name}</td>
                      <td className="py-3 px-4 sm:px-6">
                        <span className={badgeClass}>{task.priority?.toUpperCase() || 'NORMAL'}</span>
                      </td>
                      <td className="py-3 px-4 sm:px-6 whitespace-nowrap">
                        {task.endBy ? new Date(task.endBy).toLocaleDateString() : 'No deadline'}
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
