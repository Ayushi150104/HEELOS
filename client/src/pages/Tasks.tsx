import React, { useEffect, useState } from "react";
import clsx from "clsx";
import {
  FaCalendar,
  FaCube,
  FaDotCircle,
  FaList,
  FaPlus,
} from "react-icons/fa";
import { MdOutlineGridView } from "react-icons/md";

import ImpCards from "../components/Cards/ImpCards";
import Button from "../components/Button";
import Input from "../components/Input";
import Tags from "../components/tags";
import { scheduleData } from "../assets/Data";
import TaskTable from "../components/TaskTable";
import TabTable from "../components/tabTable";
import TaskDetails from "./TaskDetails";
import axiosInstance from "../api/axiosInstance";
import { IoCubeSharp } from "react-icons/io5";

type TasksProp = {
  darkMode: boolean;
};

interface Task {
  name: string;
  color: string;
  difficulty: string;
  endBy: string;
  priority: string;
  status: string;
  tags: string[];
  description: string;
  createdAt: string;
  activityLog: {
    type: string;
    time: string;
  }[];
  subtasks: {
    name: string;
    des: string;
    color: string;
    date: string;
    completion: number;
  }[];
}

interface Schedule {
  scheduleName: string;
  color: string;
  tasks: Task[];
}

interface UserData {
  username: string;
  plan: string;
  schedules: Schedule[];
}

const Tasks: React.FC<TasksProp> = ({ darkMode }) => {
  const [active, setActive] = useState("Active Tasks");
  const [activeTab, setActiveTab] = useState(1);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [openedScheduleName, setOpenedScheduleName] = useState<string | null>(null);
  const [selectedTaskIdx, setSelectedTaskIdx] = useState<number | null>(null);

  const tabs = ["Active Tasks", "Total Tasks", "Completed", "Trashed"];
  const tags = ["Website", "Work", "School", "Shopping", "Study", "Others"];

  useEffect(() => {
    axiosInstance.get('/tasks/my')
      .then(res => setUserData(res.data))
      .catch(err => console.error('Failed to load user data:', err));
  }, []);

  const allTasks = userData?.schedules?.flatMap(schedule => schedule.tasks || []) ?? [];

  const handleScheduleClick = (scheduleName: string, taskIdx: number) => {
    if (openedScheduleName === scheduleName && selectedTaskIdx === taskIdx) {
      setOpenedScheduleName(null);
      setSelectedTaskIdx(null);
    } else {
      setOpenedScheduleName(scheduleName);
      setSelectedTaskIdx(taskIdx);
    }
  };

  const closeTaskDetails = () => {
    setOpenedScheduleName(null);
    setSelectedTaskIdx(null);
  };

  const selectedTask = selectedSchedule?.tasks?.[selectedTaskIdx ?? -1];

  return (
    <div className={clsx(
      "px-1 sm:px-8 py-6 relative h-max z-50 mt-7 grid md:grid-cols-2 w-[calc(100%+4rem)] left-[-2em] md:w-[135%] gap-[27em] md:-left-19 pt-9",
      darkMode
        ? "bg-gradient-to-br from-[#1f1f1f] via-[#2f2f2fcc] to-[#3a3a4e] text-white"
        : "bg-gradient-to-br from-[#f0d8d8] via-[#f5f4ff] to-[#c6c6ec] text-gray-900"
    )}>
      {/* Left Section */}
      <div className={clsx(
        "md:w-[200%] w-full grid grid-cols-1 shadow-lg gap-6 p-4 md:p-6 rounded-xl order-1 h-full relative md:left-[2em]",
        darkMode ? "bg-zinc-800" : "bg-gradient-to-br from-[#fafafe] to-[#e4e6fb] text-black"
      )}>
        {/* Important Schedules */}
        <div className="flex flex-wrap md:flex-nowrap justify-start gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent h-[20em] left-10 relative md:left-0">
          {userData?.schedules?.map((schedule, idx) => (
            <ImpCards
              key={idx}
              title={schedule.scheduleName}
              des="Highly important Schedule"
              icon={<IoCubeSharp />}
              className="min-w-[18rem] md:min-w-[20em]"
              darkMode={darkMode}
              subtasks={schedule?.tasks}
              color={schedule.color}
              padding="bg-violet-800 p-7"
              onClick={() => setSelectedSchedule(schedule)}
            />
          ))}
        </div>

        {/* Recent Tasks Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4">
          <h2 className="text-xl md:text-2xl font-semibold">Recent Tasks</h2>
          <div className="flex flex-wrap gap-2">
            <Button text="New" icon={<FaPlus />} className="text-sm bg-purple-500 px-4 py-2 rounded-full hover:bg-purple-600 flex text-white" />
            <Button icon={<FaList />} className={`p-3 rounded-2xl ${activeTab === 1 ? "bg-purple-400 text-white" : "bg-gray-500/40"}`} onClick={() => setActiveTab(1)} />
            <Button icon={<MdOutlineGridView />} className={`p-3 rounded-2xl ${activeTab === 2 ? "bg-purple-400 text-white" : "bg-gray-500/40"}`} onClick={() => setActiveTab(2)} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-between items-center border-b-2 border-gray-400/40 pb-2 px-4">
          <div className="flex gap-6 font-semibold text-lg">
            {tabs.map((tab, idx) => (
              <div
                key={idx}
                className={`cursor-pointer pb-1 ${active === tab ? "border-b-2 " + (darkMode ? "border-purple-400 text-purple-400" : "border-purple-500 text-purple-600") : "text-gray-600 hover:text-black"}`}
                onClick={() => setActive(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
          <div className={`flex items-center gap-2 text-lg font-semibold ${darkMode ? "text-white" : "text-black"}`}>
            <FaDotCircle />
            <span>Search</span>
          </div>
        </div>

        {/* Tasks View */}
<div className="h-[25em] overflow-y-auto flex flex-wrap">
  {!selectedSchedule ? (
    <div className="w-full text-center text-lg text-gray-400 mt-10">
      Select a schedule to view tasks.
    </div>
  ) : (
    <>
      {activeTab === 1 && (
        <TaskTable darkMode={darkMode} schedule={selectedSchedule} />
      )}

      {activeTab === 2 && selectedSchedule.tasks.map((task, taskIdx) => (
        <div
          key={taskIdx}
          className="cursor-pointer p-2 flex flex-row gap-2"
          onClick={() => handleScheduleClick(selectedSchedule.scheduleName, taskIdx)}
        >
          <TabTable darkMode={darkMode} arr={[task]} />
        </div>
      ))}

      {selectedTask && openedScheduleName === selectedSchedule.scheduleName && (
        <TaskDetails
          darkMode={darkMode}
          task={selectedTask}
          scheduleName={selectedSchedule.scheduleName}
          close={closeTaskDetails}
        />
      )}
    </>
  )}
</div>

      </div>

      {/* Right Section - Upcoming Schedules */}
      <div className={clsx(
        "md:w-[70%] relative md:left-[11.9em] shadow-xl hidden md:grid w-full gap-4 grid-cols-1 p-4 md:p-6 rounded-xl order-1",
        darkMode ? "bg-zinc-800" : "bg-gradient-to-br from-[#f7f7ff] to-[#e4e6fb] text-black"
      )}>
        <div className="font-semibold text-[1.4em] flex items-center gap-4 mb-4">
          <Button icon={<FaCalendar />} className="p-2 bg-purple-400 text-white rounded-xl" />
          Upcoming Schedules
        </div>
        <hr className="text-gray-400/40" />
        <div className="flex flex-col gap-4 mt-4">
          {scheduleData.map((card, idx) => (
            <ImpCards
              key={idx}
              title={card.title}
              des={card.des}
              icon={card.icon}
              color={card.color}
              darkMode={darkMode}
              subtasks={card.subtasks}
              padding={card.className}
            />
          ))}
        </div>

        <hr className="text-gray-300/80 mt-4 mb-1" />
        <div className={`${darkMode ? "text-white" : "text-black"} text-xl font-semibold`}>
          Create A New Schedule
        </div>
        <div className="mt-1 gap-4 flex flex-col">
          <Input type="text" placeHolder="Enter the name of the Schedule" className="scale-95" darkMode={darkMode} />
          <Input type="text" placeHolder="dd-mm-yyyy" className="scale-95" darkMode={darkMode} />
          <div>
            <p className="font-medium text-md mb-2">Select the following tags:</p>
            <div className="flex gap-2 px-5 flex-wrap">
              {tags.map(tag => <Tags key={tag} text={tag} darkMode={darkMode} />)}
            </div>
            <Button icon={<FaPlus />} text="Create" className={`w-full p-2 mt-7 rounded-lg py-3 ${darkMode ? "bg-red-400" : "bg-purple-400 text-white"}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
