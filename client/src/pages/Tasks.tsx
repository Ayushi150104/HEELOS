import React, { useEffect, useState } from "react";
import clsx from "clsx";
import {
  FaDotCircle,
  FaList,
  FaPlus,
} from "react-icons/fa";
import { MdOutlineGridView } from "react-icons/md";
import { IoCubeSharp } from "react-icons/io5";

import ImpCards from "../components/Cards/ImpCards";
import Button from "../components/Button";
import Input from "../components/Input";
import Tags from "../components/tags";
import TaskTable from "../components/TaskTable";
import TabTable from "../components/tabTable";
import axiosInstance from "../api/axiosInstance";
import NewTaskDetails from "./NewTaskDetails";
import { toast } from "sonner";

type TasksProp = {
  darkMode: boolean;
};

interface Task {
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
  _id: string;
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
  const [active, setActive] = useState("Total Tasks");
  const [activeTab, setActiveTab] = useState(1);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [openedScheduleName, setOpenedScheduleName] = useState<string | null>(null);
  const [selectedTaskIdx, setSelectedTaskIdx] = useState<number | null>(null);


  // New schedule form state
  const [newScheduleName, setNewScheduleName] = useState("");
  const [newScheduleDate, setNewScheduleDate] = useState("");
  const [newScheduleTags, setNewScheduleTags] = useState<string[]>([]);
  const [newScheduleColor, setNewScheduleColor] = useState("#7c3aed");
  const [formShow, setFormShow] = useState(false);

  // Task form state (inside modal)
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskColor, setTaskColor] = useState("#8B5CF6");
  const [taskDifficulty, setTaskDifficulty] = useState("easy");
  const [taskPriority, setTaskPriority] = useState("low");
  const [taskEndBy, setTaskEndBy] = useState("");
  const [taskTags, setTaskTags] = useState<string[]>([]);

  const tabs = ["Active Tasks", "Total Tasks", "Completed", "Overdue"];
  const tags = ["Website", "Work", "School", "Shopping", "Study", "Others"];

  const colors = [
    "#8B5CF6", // purple-500
    "#EC4899", // pink-500
    "#6366F1", // indigo-500
    "#14B8A6", // teal-500
    "#F43F5E", // rose-500
    "#3B82F6", // blue-500
    "#FB923C", // orange-400
    "#10B981", // emerald-500
    "#FACC15", // yellow-400
    "#EF4444", // red-500
    "#0EA5E9", // sky-500
    "#84CC16", // lime-500
    "#E879F9", // fuchsia-500
  ];

  const [status, setStatus] = useState("pending");

  // Fetch user data on mount
  useEffect(() => {
    axiosInstance
      .get("/tasks/my")
      .then((res) => {
        setUserData(res.data);
        if (res.data?.schedules?.length) {
          setSelectedSchedule(res.data.schedules[0]);
        }
      })
      .catch((err) => console.error("Failed to load user data:", err));
  }, []);

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

  // Toggle task tags in form
 

  // Reset task form inputs
  const resetTaskForm = () => {
    setTaskName("");
    setTaskDescription("");
    setTaskColor("#8B5CF6");
    setTaskDifficulty("easy");
    setTaskPriority("low");
    setTaskEndBy("");
    setTaskTags([]);
  };

  // Create new schedule function
  const createNewSchedule = async () => {
    if (!newScheduleName || !newScheduleDate) {
      alert("Please enter schedule name and date.");
      return;
    }

    try {
      const res = await axiosInstance.post("/tasks", {
        scheduleName: newScheduleName,
        color: newScheduleColor,
      });

      // Backend returns the created schedule with _id and tasks
      const newSchedule: Schedule = res.data;

      setUserData((prev) =>
        prev
          ? { ...prev, schedules: [...prev.schedules, newSchedule] }
          : { username: "", plan: "Basic", schedules: [newSchedule] }
      );

      // Auto select new schedule
      setSelectedSchedule(newSchedule);
      toast.success(`Schedule created successfully : ${newScheduleName}`)

      // Reset form
      setNewScheduleName("");
      setNewScheduleDate("");
      setNewScheduleTags([]);
      setNewScheduleColor("#7c3aed");
    } catch (error) {
      toast.error("Error creating schedule");
      alert("Failed to create schedule. Check console for details.");
    }
  };

  // Create new task function
  const createNewTask = async () => {
    if (!selectedSchedule) {
      alert("Please select a schedule first.");
      return;
    }
    if (!taskName.trim()) {
      alert("Please enter a task name.");
      return;
    }
    if (!taskEndBy) {
      alert("Please select an end date.");
      return;
    }

    try {
      const newTaskPayload = {
        name: taskName,
        description: taskDescription,
        color: taskColor,
        difficulty: taskDifficulty,
        priority: taskPriority,
        endBy: taskEndBy,
        tags: taskTags,
        status: "pending", // default status
        activityLog: [],
        subtasks: [],
      };

      const res = await axiosInstance.post(
        `/tasks/my/${selectedSchedule._id}/create-task`,
        newTaskPayload
      );

      if (res.data?.schedule) {
        // Update userData schedules array replacing the updated schedule
        setUserData((prev) => {
          if (!prev) return prev;
          const updatedSchedules = prev.schedules.map((sch) =>
            sch._id === selectedSchedule._id ? res.data.schedule : sch
          );
          return { ...prev, schedules: updatedSchedules };
        });

        // Update selectedSchedule to reflect changes
        setSelectedSchedule(res.data.schedule);

        toast.success(`Task added successfully : ${newTaskPayload.name}`)

        resetTaskForm();
        setFormShow(false);
      } else {
        alert("Failed to create task. Please try again.");
      }
    } catch (error) {
      toast.error("Error creating task");
      alert("Error creating task. Check console for details.");
    }
  };


  // Helper: collect all tasks from selected schedule, sorted by status
  const activeTasks = selectedSchedule
    ? selectedSchedule.tasks.filter((task) => task.status === "pending")
    : [];

  const completedTasks = selectedSchedule 
    ? selectedSchedule.tasks.filter((task) => task.status === "completed")
    : [];

  const OverdueTasks = selectedSchedule
    ? selectedSchedule.tasks.filter((task) => task.status === "overdue")
    : [];

  // total/all tasks without filtering
  const allTasks = selectedSchedule ? selectedSchedule.tasks : [];
  console.log(newScheduleTags)

  return (
    <div
      className={clsx(
        "px-1 sm:px-8 py-6 relative h-max z-50 mt-7 grid md:grid-cols-2 w-[calc(100%+4rem)] left-[-2em] md:w-[135%] gap-[27em] md:-left-19 pt-9",
        darkMode
          ? "bg-gradient-to-br from-[#1f1f1f] via-[#2f2f2fcc] to-[#3a3a4e] text-white"
          : "bg-gradient-to-br from-[#f0d8d8] via-[#f5f4ff] to-[#c6c6ec] text-gray-900"
      )}
    >
      {/* LEFT SIDE */}
      <div
        className={clsx(
          "md:w-[200%] w-full grid grid-cols-1 shadow-lg gap-6 p-4 md:p-6 rounded-xl order-1 h-full relative md:left-[2em]",
          darkMode ? "bg-zinc-800" : "bg-gradient-to-br from-[#fafafe] to-[#e4e6fb] text-black"
        )}
      >
        {formShow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div
              className={clsx(
                "w-full max-w-2xl rounded-xl shadow-2xl p-6 sm:p-8 border",
                darkMode ? "bg-zinc-900 text-white border-zinc-700" : "bg-white text-black border-gray-200"
              )}
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                Create New Task in{" "}
                <span className="text-purple-500">
                  {selectedSchedule?.scheduleName || "Selected Schedule"}
                </span>
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {/* Task Name */}
                <div>
                  <label className="block mb-2 font-medium">Task Name</label>
                  <Input
                    placeHolder="Enter task name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-2 font-medium">Description</label>
                  <Input
                    placeHolder="Brief description..."
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                  />
                </div>

                {/* Color Picker */}
                <div>
                  <label className="block mb-2 font-medium">Choose a Color</label>
                  <div className="flex flex-wrap gap-5 ">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-7 h-7 rounded-full border-2 ${
                          taskColor === color ? "border-purple-500" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setTaskColor(color)}
                        type="button"
                      />
                    ))}
                  </div>
                </div>

                {/* Difficulty & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium">Difficulty</label>
                    <select
                      className={clsx(
                        "w-full px-4 py-2 rounded-md border text-sm",
                        darkMode
                          ? "bg-zinc-800 text-white border-zinc-600"
                          : "bg-white border-gray-300"
                      )}
                      value={taskDifficulty}
                      onChange={(e) => setTaskDifficulty(e.target.value)}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">Priority</label>
                    <select
                      className={clsx(
                        "w-full px-4 py-2 rounded-md border text-sm",
                        darkMode
                          ? "bg-zinc-800 text-white border-zinc-600"
                          : "bg-white border-gray-300"
                      )}
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block mb-2 font-medium">Due Date</label>
                  <Input type="date" value={taskEndBy} onChange={(e) => setTaskEndBy(e.target.value)} />
                </div>

                {/* Tags */}
                <div>
                  <label className="block mb-2 font-medium">Select Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Tags
                        key={tag}
                        text={tag}
                        darkMode={darkMode}
                        selected={taskTags.includes(tag)}
                        onClick={() => setTaskTags((prev) => {
                          if (prev.includes(tag)) {
                            return prev.filter((t) => t !== tag);
                          } else {
                            return [...prev, tag];
                          }
                        })}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end mt-8 gap-4">
                <Button
                  text="Cancel"
                  className={clsx(
                    "py-2 px-4 rounded-md border",
                    darkMode
                      ? "bg-zinc-700 border-zinc-600 text-white"
                      : "bg-gray-100 border-gray-300"
                  )}
                  onClick={() => {
                    resetTaskForm();
                    setFormShow(false);
                  }}
                />
                <Button
                  text="Create Task"
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-md font-semibold"
                  onClick={createNewTask}
                />
              </div>
            </div>
          </div>
        )}

        {/* Important Schedules */}
        <div className="flex flex-wrap md:flex-nowrap justify-start gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent h-[20em] left-10 relative md:left-0">
          {userData?.schedules?.map(
            (schedule) =>
              schedule ? (
                <ImpCards
                  key={schedule._id}
                  scheduleId={schedule._id}
                  title={schedule.scheduleName || "Unnamed Schedule"}
                  des="Highly important Schedule"
                  icon={<IoCubeSharp />}
                  className="min-w-[18rem] md:min-w-[20em]"
                  darkMode={darkMode}
                  subtasks={schedule.tasks}
                  color={schedule.color}
                  padding={`${schedule.color} p-7`}
                  onClick={() => setSelectedSchedule(schedule)}
                />
              ) : null
          )}
        </div>

        {/* Recent Tasks Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4">
          <h2 className="text-xl md:text-2xl font-semibold">Recent Tasks</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              text="New"
              icon={<FaPlus />}
              className="text-sm hidden md:flex itmes-center bg-purple-500 px-4 py-2 rounded-full hover:bg-purple-600  text-white"
              onClick={() => setFormShow(true)}
            />
            <Button
              icon={<FaList />}
              className={`p-3 rounded-2xl ${
                activeTab === 1 ? "bg-purple-400 text-white" : "bg-gray-500/40"
              }`}
              onClick={() => setActiveTab(1)}
            />
            <Button
              icon={<MdOutlineGridView />}
              className={`p-3 rounded-2xl ${
                activeTab === 2 ? "bg-purple-400 text-white" : "bg-gray-500/40"
              }`}
              onClick={() => setActiveTab(2)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-between items-center border-b-2 border-gray-400/40 pb-2 px-4">
          <div className="flex gap-6 font-semibold text-lg">
            {tabs.map((tab, idx) => (
              <div
                key={idx}
                className={`cursor-pointer pb-1 ${
                  active === tab
                    ? "border-b-2 " +
                      (darkMode
                        ? "border-purple-400 text-purple-400"
                        : "border-purple-500 text-purple-600")
                    : "text-gray-600 hover:text-black"
                }`}
                onClick={() => setActive(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
          <div
            className={`flex items-center gap-2 text-lg font-semibold ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            <FaDotCircle />
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
              {active === "Active Tasks" && (
                <>
                  {activeTab === 1 && (
                    <TaskTable darkMode={darkMode} schedule={{ ...selectedSchedule, tasks: activeTasks }} />
                  )}
                  {activeTab === 2 &&
                    activeTasks.map((task, taskIdx) => (
                      <div
                        key={taskIdx}
                        className="cursor-pointer p-2 flex flex-row gap-2"
                        onClick={() => handleScheduleClick(selectedSchedule._id, taskIdx)}
                      >
                        <TabTable darkMode={darkMode} arr={[task]} />
                      </div>
                    ))}
                </>
              )}

              {active === "Completed" && (
                <>
                  {activeTab === 1 && (
                    <TaskTable darkMode={darkMode} schedule={{ ...selectedSchedule, tasks: completedTasks }} />
                  )}
                  {activeTab === 2 &&
                    completedTasks.map((task, taskIdx) => (
                      <div
                        key={taskIdx}
                        className="cursor-pointer p-2 flex flex-row gap-2"
                        onClick={() =>
                          handleScheduleClick(selectedSchedule.scheduleName, taskIdx)
                        }
                      >
                        <TabTable darkMode={darkMode} arr={[task]} />
                      </div>
                    ))}
                </>
              )}

              {active === "overdue" && (
                <>
                  {activeTab === 1 && (
                    <TaskTable darkMode={darkMode} schedule={{ ...selectedSchedule, tasks: OverdueTasks }} />
                  )}
                  {activeTab === 2 &&
                    OverdueTasks.map((task, taskIdx) => (
                      <div
                        key={taskIdx}
                        className="cursor-pointer p-2 flex flex-row gap-2"
                        onClick={() =>
                          handleScheduleClick(selectedSchedule.scheduleName, taskIdx)
                        }
                      >
                        <TabTable darkMode={darkMode} arr={[task]} />
                      </div>
                    ))}
                </>
              )}

              {active === "Total Tasks" && (
                <>
                  {activeTab === 1 && (
                    <TaskTable darkMode={darkMode}  schedule={{ ...selectedSchedule, tasks: allTasks, scheduleId: selectedSchedule._id, taskId: selectedTask?.id }} taskId={selectedTask?.id} />
                  )}
                  {activeTab === 2 &&
                    allTasks.map((task, taskIdx) => (
                      <div
                        key={taskIdx}
                        className="cursor-pointer p-2 flex flex-row gap-2"
                        onClick={() =>
                          handleScheduleClick(selectedSchedule.scheduleName, taskIdx)
                        }
                      >
                        <TabTable darkMode={darkMode} arr={[task]} />
                      </div>
                    ))}
                </>
              )}

              {selectedTask &&
                openedScheduleName === selectedSchedule.scheduleName && (
                  <NewTaskDetails
                    darkMode={darkMode}
                    task={selectedTask}
                    scheduleName={selectedSchedule.scheduleName}
                    scheduleId={selectedSchedule._id}
                    taskId={selectedTask.id}
                    status={status}
                    setStatus={setStatus}
                    close={closeTaskDetails}
                  />
                )}
            </>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - Schedule Form */}
      <div
        className={clsx(
          "md:w-[70%] relative md:left-[11.9em] shadow-xl h-max hidden md:grid w-full gap-5  grid-cols-1 p-4 md:p-6 rounded-xl order-1",
          darkMode
            ? "bg-zinc-800"
            : "bg-gradient-to-br from-[#f9fafb] to-[#e4e6fb] text-black"
        )}
      >
        <h3 className="font-semibold text-xl px-2 border-b border-gray-400/40 mb-4 pb-3">
          Create a New Schedule
        </h3>
        <div className="h-max flex flex-col gap-9">
          <Input
            type="text"
            placeHolder="Name your schedule"
            onChange={(e) => setNewScheduleName(e.target.value)}
            value={newScheduleName}
            darkMode={darkMode}
          />
          <Input
            type="date"
            placeHolder="Date of schedule"
            onChange={(e) => setNewScheduleDate(e.target.value)}
            value={newScheduleDate}
            darkMode={darkMode}
          />
        </div>
        <div className="h-max flex flex-col gap-9">
          <p className="font-semibold text-md px-2 border-b border-gray-500/60 pb-3">Select Color</p>
          <div className="grid grid-cols-4 gap-3 px-4">
            {colors.map((color, idx) => (
              <button
                key={idx}
                className={`w-10 h-10 rounded-full ${newScheduleColor === color ? "ring-2 ring-purple-500" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => setNewScheduleColor(color)}
                type="button"
              />
            ))}
          </div>
        </div>

        <Button
          text="Create Schedule"
          className="bg-purple-500 px-6 py-4 mt-8 rounded-lg font-semibold text-white h-max"
          onClick={createNewSchedule}
        />
      </div>
    </div>
  );
};

export default Tasks;
