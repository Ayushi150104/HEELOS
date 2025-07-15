import React from 'react';
import clsx from 'clsx';
import { BiDesktop, BiServer } from 'react-icons/bi';
import { FaList } from 'react-icons/fa';
import Card from '../components/Cards';
import ProfileButton from '../components/ProfileButton';
import TaskCard from '../components/taskCard';
import Schedule from '../components/Schedule';
import { tasks, cardData, scheduleData, recentCards } from "../assets/Data";


interface ProfileProps {
  darkMode: boolean;
}

const stats = [
  { label: 'Total Tasks', value: tasks.length, Icon: FaList, accent: 'blue' },
  { label: 'Servers', value: 3, Icon: BiServer, accent: 'yellow' },
  { label: 'Desktops', value: 5, Icon: BiDesktop, accent: 'green' },
  { label: 'Desktops', value: 5, Icon: BiDesktop, accent: 'green' },
];

const todayTasks = [
  { title: 'Team Meeting', start: 10, end: 11, priority: 'HIGH' },
  { title: 'Code Review', start: 11, end: 12, priority: 'MED' },
  { title: 'Lunch Break', start: 13, end: 14, priority: 'LOW' },
  { title: 'Project Work', start: 14, end: 17, priority: 'NORMAL' },
  { title: 'Client Call', start: 16, end: 17, priority: 'HIGH' },
];



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
    <div className={clsx('min-h-screen w-full md:w-[77vw] p-4 sm:p-6 md:p-8 relative md:left-[2em] top-[2em] left-[2.8em]', containerBg)}>
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
        {/* Left Panel: Avatar & Recent Task */}
        <aside className="w-full lg:w-1/3 flex flex-col space-y-6">
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

          <div className={clsx('p-5 sm:p-6 rounded-xl shadow-lg w-full', panelBg)}>
            <h3 className="text-lg font-semibold mb-4">Recent Task</h3>
            <div className={clsx('p-6 rounded-xl shadow-lg gap-5 ', panelBg)}>
  <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
  <div className='flex flex-col gap-5'>
  {recentCards.map((card, idx) => (
    <TaskCard
      key={idx}
      imp={card.imp}
      name={card.name}
      des={card.des}
      tags={card.tags}
      darkMode={darkMode}
    />
  ))}
  </div>
</div>

          </div>
        </aside>

        {/* Right Panel: Schedule & Task List */}
        <main className="flex-1 md:flex flex-col space-y-6 lg:space-y-10 w-full hidden ">
          <div className={clsx('p-5 sm:p-6 rounded-xl shadow-lg w-full', panelBg)}>
            <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
            <Schedule tasks={todayTasks} startHour={9} totalHours={12} darkMode={darkMode} />
          </div>

          <div className={clsx('p-5 sm:p-6 rounded-xl shadow-lg overflow-x-auto w-full', panelBg)}>
            <h3 className="text-lg font-semibold mb-4">Task List</h3>
            <table className="min-w-full text-left">
              <thead className={clsx(tableHeaderBg)}>
                <tr>
                  <th className="py-2 px-3 sm:px-4">Title</th>
                  <th className="py-2 px-3 sm:px-4">Priority</th>
                  <th className="py-2 px-3 sm:px-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {todayTasks.map((task, idx) => (
                  <tr
                    key={idx}
                    className={clsx(
                      'border-b transition cursor-pointer',
                      tableRowHover
                    )}
                  >
                    <td className="py-2 px-3 sm:px-4">{task.title}</td>
                    <td className="py-2 px-3 sm:px-4 capitalize font-semibold">{task.priority}</td>
                    <td className="py-2 px-3 sm:px-4">{`${task.start}:00 - ${task.end}:00`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
