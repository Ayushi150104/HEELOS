import React, { useState } from 'react';
import { FaBookmark, FaBug, FaCode, FaExclamation, FaHourglassStart } from 'react-icons/fa';
import { HiClock, HiExclamation } from 'react-icons/hi';
import InfoCard from '../components/infoCard';
import { GiFinishLine } from 'react-icons/gi';
import Tooltip from '../components/toolTip';
import Button from '../components/Button';

type taskDetailsProp = {
  darkMode: boolean;
  scheduleName: string;
  close: ()=>null;
  task: {
    id: string;
    name: string;
    color: string;
    difficulty: string;
    endBy: string;
    priority: string;
    status: string;
    tags: string[];
    description: string;
    createdAt: string;
    subtasks: {
      name: string;
      des: string;
      color: string;
      date: string;
      completetion: number;
    }[];
    activityLog: {
      type: string;
      time: string;
    }[]
  };
};

// Priority color helper
const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-green-500';
    default:
      return '';
  }
};

const IconDisplay = (timeType?: string) => {
  switch (timeType?.toLowerCase()) {
    case 'created':
      return <FaHourglassStart />;
    case 'completed':
      return <GiFinishLine />;
    case 'error':
      return <FaExclamation />;
    case 'bug':
      return <FaBug />;
    case 'code':
      return <FaCode />;
    default:
      return <FaBookmark className="text-gray-400" />; // fallback icon
  }
};

const TaskDetails: React.FC<taskDetailsProp> = ({ darkMode, scheduleName, task, close }) => {
  const [activeTab, setActiveTab] = useState(1)
  return (
    <div
      className={`h-full w-full absolute top-0 left-0 rounded-lg p-6 overflow-y-auto z-50 grid grid-cols-1 md:grid-cols-2 text-left gap-6 
        transition-colors duration-300 ${darkMode ? "bg-[#0e0e15] text-white" : "bg-white text-gray-900"}`}
    >
      
      {/* Left Column */}
      <div className="space-y-6 md:block hidden">
        

        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="h-4 w-4 rounded-full shadow-md"
            style={{ backgroundColor: task.color }}
          />
          <h2 className="text-3xl font-bold tracking-tight">{task.name}</h2>
        </div>

        {/* Metadata */}
        <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
          <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-5">{scheduleName}</p>
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Created:</span>{" "}
            {new Date(task.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Due:</span>{" "}
            {new Date(task.endBy).toLocaleDateString()}
          </p>
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-4 py-1 text-sm rounded-md font-medium tracking-wide
                  ${darkMode ? "bg-indigo-700 text-indigo-100" : "bg-indigo-100 text-indigo-700"}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="text-base font-semibold mb-1 text-gray-700 dark:text-gray-200">Description</h3>
          <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-300">
            {task.description || "No description available."}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard
            icon={<FaBookmark />}
            label="Priority"
            value={task.priority}
            darkMode={darkMode}
            colorClass={getPriorityColor(task.priority)}
          />
          <InfoCard
            icon={<HiClock />}
            label="Status"
            value={task.status}
            darkMode={darkMode}
          />
          <InfoCard
            icon={<HiExclamation />}
            label="Difficulty"
            value={task.difficulty}
            darkMode={darkMode}
          />
        </div>



        {/* Subtasks */}
        {task.subtasks.length > 0 && (
          <div className="mt-4 space-y-4 h-[20em] overflow-y-auto">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">Subtasks</h3>
            {task.subtasks.map((sub, idx) => (
              <div
                key={idx}
                className={`rounded-md px-4 py-3 space-y-1 border-none
                  ${darkMode ? " bg-zinc-900" : " bg-zinc-50"}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{sub.name}</span>
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: sub.color }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{sub.des}</p>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Due: {new Date(sub.date).toLocaleDateString()}</span>
                  <span>Completion: {sub.completetion}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div>
          <Button text='Close' className='w-full bg-purple-500 py-3 text-white rounded-lg shadow-lg' onClick={close}  />
        </div>
      </div>

      {/* Right Column - Timeline */}
      <div
        className={`rounded-xl shadow-md p-6 w-full max-w-md mx-auto self-start h-full overflow-y-auto md:block hidden
          ${darkMode ? "bg-zinc-900 border border-zinc-800" : "bg-zinc-50 border border-zinc-200"}`}
        style={{ position: 'relative' }}
      >
        <h3 className="text-lg font-semibold mb-6">Timeline</h3>
        
        {task.activityLog && task.activityLog.length > 0 ? (
          <div className="relative">
            {/* Vertical line through icon centers */}
            <div className="absolute left-[28px] top-5 bottom-5 w-[2px] bg-indigo-500 z-0" />
        
            {task.activityLog.map((entry, idx) => (
              <div
                key={idx}
                className="relative flex items-start mb-10"
              >
                {/* Timeline Icon */}
                <Tooltip text={entry.type}>
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg
                    ring-4 ring-white dark:ring-zinc-900"
                    style={{
                      backgroundColor: darkMode ? "#6366f1" : "#6366f1",
                      marginLeft: "6px",
                    }}
                  >
                    {IconDisplay(entry.type)}
                  </div>
                </Tooltip>
                  
                {/* Entry Text */}
                <div className="ml-4 text-sm">
                  <div className="font-semibold capitalize text-gray-800 dark:text-gray-200">
                    {entry.type}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(entry.time).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No timeline events available.</p>
        )}
      </div>

        {/*Mobile View */}
{/* Mobile View */}
<div className='block md:hidden h-full overflow-y-auto p-4 space-y-4'>
  {/* Sticky Tab Buttons */}
  <div className='flex sticky top-0 bg-inherit z-20 gap-4 py-2'>
    <Button
      text='Details'
      className={`flex-1 p-2 text-sm rounded-md ${
        activeTab === 1
          ? 'bg-indigo-700 text-white'
          : darkMode
          ? 'bg-zinc-800 text-gray-300'
          : 'bg-gray-100 text-gray-700'
      }`}
      onClick={() => setActiveTab(1)}
    />
    <Button
      text='Timeline'
      className={`flex-1 p-2 text-sm rounded-md ${
        activeTab === 2
          ? 'bg-indigo-700 text-white'
          : darkMode
          ? 'bg-zinc-800 text-gray-300'
          : 'bg-gray-100 text-gray-700'
      }`}
      onClick={() => setActiveTab(2)}
    />
  </div>

  {/* Details Tab */}
  {activeTab === 1 && (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <div
          className='h-4 w-4 rounded-full shadow-md'
          style={{ backgroundColor: task.color }}
        />
        <h2 className='text-2xl font-bold'>{task.name}</h2>
      </div>

      {/* Metadata */}
      <div className='space-y-1 text-sm text-gray-500 dark:text-gray-400'>
        <p className='text-lg font-medium text-gray-600 dark:text-gray-300'>{scheduleName}</p>
        <p><strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}</p>
        <p><strong>Due:</strong> {new Date(task.endBy).toLocaleDateString()}</p>
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {task.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 text-xs rounded-md font-medium ${
                darkMode ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <div>
        <h3 className='text-sm font-semibold mb-1'>Description</h3>
        <p className='text-sm text-gray-700 dark:text-gray-300'>
          {task.description || 'No description available.'}
        </p>
      </div>

      {/* Info Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <InfoCard
          icon={<FaBookmark />}
          label='Priority'
          value={task.priority}
          darkMode={darkMode}
          colorClass={getPriorityColor(task.priority)}
        />
        <InfoCard
          icon={<HiClock />}
          label='Status'
          value={task.status}
          darkMode={darkMode}
        />
        <InfoCard
          icon={<HiExclamation />}
          label='Difficulty'
          value={task.difficulty}
          darkMode={darkMode}
        />
      </div>

      {/* Subtasks */}
      {task.subtasks.length > 0 && (
        <div className='space-y-4'>
          <h3 className='text-sm font-semibold mb-1'>Subtasks</h3>
          {task.subtasks.map((sub, idx) => (
            <div
              key={idx}
              className={`rounded-md p-3 space-y-1 ${
                darkMode ? 'bg-zinc-900' : 'bg-zinc-100'
              }`}
            >
              <div className='flex justify-between items-center'>
                <span className='font-medium'>{sub.name}</span>
                <span
                  className='h-3 w-3 rounded-full'
                  style={{ backgroundColor: sub.color }}
                />
              </div>
              <p className='text-xs text-gray-600 dark:text-gray-400'>{sub.des}</p>
              <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400'>
                <span>Due: {new Date(sub.date).toLocaleDateString()}</span>
                <span>Completion: {sub.completetion}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Close Button */}
      <div>
        <Button
          text='Close'
          className='w-full bg-purple-500 py-3 text-white rounded-lg shadow-lg'
          onClick={close}
        />
      </div>
    </div>
  )}

  {/* Timeline Tab */}
  {activeTab === 2 && (
    <div
      className={`rounded-lg p-4 shadow-md ${
        darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-zinc-50 border border-zinc-200'
      }`}
    >
      <h3 className='text-base font-semibold mb-4'>Timeline</h3>
      {task.activityLog?.length ? (
        <div className='relative'>
          <div className='absolute left-[28px] top-5 bottom-5 w-[2px] bg-indigo-500 z-0' />
          {task.activityLog.map((entry, idx) => (
            <div key={idx} className='relative flex items-start mb-10'>
              <Tooltip text={entry.type}>
                <div
                  className='flex items-center justify-center w-10 h-10 rounded-full text-white shadow-lg ring-4 ring-white dark:ring-zinc-900'
                  style={{ backgroundColor: '#6366f1', marginLeft: '6px' }}
                >
                  {IconDisplay(entry.type)}
                </div>
              </Tooltip>
              <div className='ml-4 text-sm'>
                <div className='font-semibold capitalize'>{entry.type}</div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  {new Date(entry.time).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-sm text-gray-500 dark:text-gray-400'>No timeline events available.</p>
      )}
    </div>
  )}
</div>


    </div>
  );
};

export default TaskDetails;
