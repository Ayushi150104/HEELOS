import React, { useState } from "react";
import clsx from "clsx";
import {
  FaCalendar,
  FaDotCircle,
  FaList,
  FaPlus,
} from "react-icons/fa";
import { MdOutlineGridView } from "react-icons/md";

import ImpCards from "../components/Cards/ImpCards";
import Button from "../components/Button";
import Input from "../components/Input";
import Tags from "../components/tags";
import { cardData, scheduleData, schedules } from "../assets/Data";
import TaskTable from "../components/TaskTable";
import TabTable from "../components/tabTable";
import TaskDetails from "./TaskDetails";

type TasksProp = {
  darkMode: boolean;
};

const Tasks: React.FC<TasksProp> = ({ darkMode }) => {
  const [active, setActive] = useState("Active Tasks");
  const tags = ["Website", "Work", "School", "Shopping", "Study", "Others"];
  const tabs = ["Active Tasks", "Total Tasks", "Completed", "Trashed"];
  const [activeTab, setActiveTab] = useState(1);
  const [openedScheduleIdx, setOpenedScheduleIdx] = useState<number | null>(null);
  const [selectedTaskIdx, setSelectedTaskIdx] = useState<number | null>(null);

  // Toggles open/close task details
  const handleScheduleClick = (scheduleIdx: number, taskIdx: number) => {
    if (openedScheduleIdx === scheduleIdx && selectedTaskIdx === taskIdx) {
      // Close if already open
      setOpenedScheduleIdx(null);
      setSelectedTaskIdx(null);
    } else {
      setOpenedScheduleIdx(scheduleIdx);
      setSelectedTaskIdx(taskIdx);
    }
  };

  // Close handler to pass to TaskDetails
  const closeTaskDetails = () => {
    setOpenedScheduleIdx(null);
    setSelectedTaskIdx(null);
  };

  return (
    <div
      className={clsx(
        `px-1 sm:px-8 py-6 space-y-8 relative h-max z-50 mt-7 grid md:grid-cols-2 md:w-[135%] gap-[27em] md:-left-19 pt-9`,
        darkMode
          ? "bg-gradient-to-br from-[#1f1f1f]via-[#2f2f2fcc] to-[#3a3a4e]  text-white"
          : "bg-gradient-to-br from-[#f0d8d8] via-[#f5f4ff] to-[#c6c6ec] text-gray-900"
      )}
    >
      {/* Left Section */}
      <div
        className={clsx(
          "md:w-[200%] w-full grid grid-cols-1 shadow-lg gap-6 p-4 md:p-6 rounded-xl order-1 h-full relative md:left-[2em]",
          darkMode ? "bg-zinc-800" : "bg-gradient-to-br from-[#fafafe] to-[#e4e6fb] text-black"
        )}
      >
        {/* Important Task Cards */}
        <div className="flex flex-wrap md:flex-nowrap justify-start gap-4 w-full md:overflow-x-auto md:scroll-smooth md:py-2 md:pr-4 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent md:left-0 left-5 relative overflow-y-auto md:overflow-y-hidden h-[20em]">
          {cardData.map((car, idx) => (
            <ImpCards
              key={idx}
              title={car.title}
              des={car.des}
              icon={car.icon}
              className="min-w-[18rem] md:min-w-[20em]"
              darkMode={darkMode}
              subtasks={car.subtasks}
              color={car.color}
              padding={car.className}
            />
          ))}
        </div>

        {/* Recent Tasks Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4">
          <h2 className="text-xl md:text-2xl font-semibold">Recent Tasks</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              text="New"
              icon={<FaPlus />}
              className="text-sm bg-purple-500 px-4 py-2 items-center gap-2 rounded-full hover:bg-purple-500 flex text-white "
            />
            <Button
              icon={<FaList />}
              className={`p-3 text-sm rounded-2xl hover:bg-purple-600 ${activeTab === 1 ? "bg-purple-400 text-white" : "bg-gray-500/40"}`}
              onClick={() => setActiveTab(1)}
            />
            <Button
              icon={<MdOutlineGridView />}
              className={`p-3 text-sm rounded-2xl hover:bg-purple-600 ${activeTab === 2 ? "bg-purple-400 text-white" : "bg-gray-500/40"}`}
              onClick={() => setActiveTab(2)}
            />
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-wrap justify-between items-center border-b-2 border-gray-400/40 pb-2 px-4">
          <div className="flex gap-6 flex-wrap text-lg font-semibold">
            {tabs.map((kind, idx) => (
              <div
                key={idx}
                className={`cursor-pointer pb-1 relative top-[0.5278em] ${
                  active === kind
                    ? `border-b-2 ${!darkMode ? "border-purple-500 text-purple-600" : "border-purple-400 text-purple-400"}`
                    : "text-gray-600 hover:text-black"
                }`}
                onClick={() => setActive(kind)}
              >
                {kind}
              </div>
            ))}
          </div>
          <div className={`flex items-center gap-2 text-lg font-semibold mt-3 sm:mt-0 ${darkMode ? "text-white" : "text-black"}`}>
            <FaDotCircle />
            <span>Search</span>
          </div>
        </div>

        {/* Task Content */}
 <div className="h-[25em] overflow-y-auto">
        {activeTab === 1 && 
          <TaskTable darkMode={darkMode}  />
        }
        {activeTab === 2 &&
          schedules.map((schedule, scheduleIdx) => (
            <div key={scheduleIdx} className="mb-0">
              <div className="md:flex ">
              {/* List each task individually with its own click handler */}
              {schedule.tasks.map((task, taskIdx) => (
                <div
                  key={taskIdx}
                  className="cursor-pointer mb-1 p-2   rounded"
                  onClick={() => handleScheduleClick(scheduleIdx, taskIdx)}
                >
                  {/* You can render a task summary here or use TabTable for one task */}
                  <TabTable darkMode={darkMode} arr={[task]} />
                </div>
              ))}

              {/* Show TaskDetails only if this schedule and task is selected */}
              {openedScheduleIdx === scheduleIdx && selectedTaskIdx !== null && (
                <TaskDetails
                  darkMode={darkMode}
                  task={schedules[openedScheduleIdx].tasks[selectedTaskIdx]}
                  scheduleName={schedules[openedScheduleIdx].scheduleName}
                  close={() => {
                    setOpenedScheduleIdx(null);
                    setSelectedTaskIdx(null);
                  }}
                />
              )}

              <hr
                className={`w-full h-[1px] ${darkMode ? "text-gray-200/5" : "text-gray-900/20"}`}
              />
              </div>
            </div>
          ))}

      </div>
      </div>

      {/* Right Section - Schedules */}
      <div
        className={clsx(
          "md:w-[70%] relative md:left-[11.9em] shadow-xl hidden md:grid w-full gap-4 grid-cols-1 p-4 md:p-6 rounded-xl order-1",
          darkMode ? "bg-zinc-800" : "bg-gradient-to-br from-[#f7f7ff] to-[#e4e6fb] text-black"
        )}
      >
        <div className="font-semibold text-[1.4em] gap-4 flex h-max items-center mb-4">
          <Button icon={<FaCalendar />} className="p-2 bg-purple-400 text-white rounded-xl" />
          Upcoming Schedules
        </div>
        <hr className="text-gray-400/40" />
        <div className="flex flex-col gap-4 mt-4">
          {scheduleData.map((cardData, idx) => (
            <ImpCards
              key={idx}
              title={cardData.title}
              des={cardData.des}
              icon={cardData.icon}
              color={cardData.color}
              darkMode={darkMode}
              subtasks={cardData.subtasks}
              padding={cardData.className}
            />
          ))}
        </div>

        {/* Form Inputs */}
        <hr className="text-gray-300/80 mt-4 mb-1" />
        <div className={`${darkMode ? "text-white" : "text-black"} text-xl font-semibold`}>
          Create A New Schedule
        </div>
        <div className="mt-1 gap-4 flex flex-col">
          <Input
            type="text"
            placeHolder="Enter the name of the Schedule"
            className="w-full h-full scale-95"
            darkMode={darkMode}
          />
          <Input
            type="text"
            placeHolder="dd-mm-yyyy"
            darkMode={darkMode}
            className="scale-95"
          />
          <div>
            <p className="font-medium text-md mb-2">Select the following tags:</p>
            <div className="flex gap-2 px-5 flex-wrap">
              {tags.map((tag) => (
                <Tags key={tag} text={tag} darkMode={darkMode} />
              ))}
            </div>
            <Button
              icon={<FaPlus />}
              text={"Create"}
              className={` w-full p-2 mt-7 rounded-lg py-3 ${
                darkMode ? "bg-red-400" : "bg-purple-400 text-white"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
