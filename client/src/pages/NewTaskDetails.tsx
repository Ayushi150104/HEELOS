import React, { useState, useEffect } from "react";
import clsx from "clsx";
import {
  FaBookmark,
  FaBug,
  FaCode,
  FaExclamation,
  FaHourglassStart,
  FaDotCircle,
  FaList,
  FaPlus,
} from "react-icons/fa";
import { HiClock, HiExclamation } from "react-icons/hi";
import { GiFinishLine } from "react-icons/gi";
import InfoCard from "../components/infoCard";
import Tooltip from "../components/toolTip";
import Button from "../components/Button";
import api from "../api/axiosInstance";
import { HiTrash } from "react-icons/hi2";
import { toast } from "sonner";

type Subtask = {
  name: string;
  des: string;
  color: string;
  date: string;
  completetion: number;
};

type Activity = {
  type: string;
  time: string;
};

type Task = {
  _id: string;
  name: string;
  color: string;
  difficulty: string;
  endBy: string;
  priority: string;
  status: string;
  tags: string[];
  description: string;
  createdAt: string;
  subtasks: Subtask[];
  activityLog: Activity[];
};

type NewTaskDetailsProps = {
  darkMode: boolean;
  scheduleName: string;
  scheduleId: string;
  taskId: string;
  close: () => void;
  task: Task;
  status: string;
  setStatus: (status: string) => void;
};

type Status = {
  status: string
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "text-red-500";
    case "medium":
      return "text-yellow-500";
    case "low":
      return "text-green-500";
    default:
      return "";
  }
};

const IconDisplay = (timeType?: string) => {
  switch (timeType?.toLowerCase()) {
    case "created":
      return <FaHourglassStart />;
    case "completed":
      return <GiFinishLine />;
    case "error":
      return <FaExclamation />;
    case "bug":
      return <FaBug />;
    case "code":
      return <FaCode />;
    default:
      return <FaBookmark className="text-gray-400" />;
  }
};


const NewTaskDetails: React.FC<NewTaskDetailsProps> = ({
  darkMode,
  scheduleName,
  scheduleId,
  taskId,
  status,
  setStatus,
  task,
  close,
}) => {
  // Local state for live updates of task subtasks and activities
  const [localTask, setLocalTask] = useState<Task>(task);
  // Sync localTask when prop task changes
  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  // Tabs for mobile view
  const [activeTab, setActiveTab] = useState(1);

  // Form state for new subtask
  const [subtaskData, setSubtaskData] = useState<Partial<Subtask>>({
    name: "",
    des: "",
    color: "#6366f1",
    date: "",
    completetion: 0,
  });



  // Form state for new activity
  const [activityData, setActivityData] = useState<Partial<Activity>>({
    type: "",
    time: new Date().toISOString().slice(0, 16),
  });

  // Handle input changes for subtask form
  const handleSubtaskChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSubtaskData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for activity form
  const handleActivityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setActivityData((prev) => ({ ...prev, [name]: value }));
  };

  

  // Add new subtask to backend + update local state
  const handleAddSubtask = async () => {
    if (!subtaskData.name || !subtaskData.des) return;
    try {
      const response = await api.post(
        `/tasks/my/${scheduleId}/${task._id}/new-subtask`,
        subtaskData
      );
      const updated = response.data.task.subtasks;
      setLocalTask((prev) => ({
        ...prev,
        subtasks: updated,
      }));
      setSubtaskData({
        name: "",
        des: "",
        color: "#22c55e",
        date: new Date().toISOString().split("T")[0],
        completetion: 0,
      });
      toast.success("Added Subtask Successsfully")
      closeSubtask();
    } catch (err) {
      toast.success("Failed to add subtask");
    }
  };

  // Add new activity to backend + update local state
  const handleAddActivity = async () => {
    if (!activityData.type || !activityData.time) {
      alert("Activity type and time are required");
      return;
    }
    try {
      const res = await api.post(
        `/tasks/my/${scheduleId}/${task._id}/newActivity`,
        activityData
      );
      const updated = res.data.task.activityLog;
      if (!updated) {
        alert("Failed to add activity");
        return;
      }
      setLocalTask((prev) => ({
        ...prev,
        activityLog: updated,
      }));
      setActivityData({
        type: "",
        time: new Date().toISOString().slice(0, 16),
      });
      toast.success("Activity added successfully")
    } catch (error) {
      toast.error("An error occurred while adding activity.");
      console.error(error);
    }
  };

  const [showAddSubtaskForm, setShowAddSubtaskForm] = useState(false)
  const [statusDropdown, setStatusDropdown] = useState(false);

  // Only notify parent to update status; parent handles API and state
  const handleStatusChange = async(newStatus: string) => {
    const updatedStatus = {
      status: newStatus
    }
    try {
      const res = await api.patch(
        `/tasks/my/${scheduleId}/${task._id}/status`,
        updatedStatus
      );



      const updated = res.data.task;
      console.log(updated)
      toast.success('Status updated successfully refresh to see thr updated site (this problem will be solved in later updates)')
    } catch (error) {
      toast.error('Failed to update Status')
    }
  };

  const openSubtask = () => {
    setShowAddSubtaskForm(true)
  }

  const closeSubtask = () => {
    setShowAddSubtaskForm(false)
  }

  useEffect(() => {
    // Scroll to bottom of activity log when new activity is added
    const activityLog = document.getElementById("activity-log");
    if (activityLog) {
      activityLog.scrollTop = activityLog.scrollHeight;
    }
  }, [localTask.activityLog]);

  const executeDelete = async() => {
    try {
      const res = await api.delete(
        `/tasks/my/${scheduleId}/${task._id}/delete`,
      )

      const updated  = res.data;
      console.log(updated)
      toast.success("Task deleted successfully please refresh the page to view the updated page(this feature will be improved in later updates)");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  }

  // [Rendering JSX begins below, which will be in next part]

  return (
    <div
      className={`h-full w-full absolute top-0 left-0 rounded-lg p-6 overflow-y-auto z-50 grid grid-cols-1 md:grid-cols-2 text-left gap-6 
        transition-colors duration-300 ${
          darkMode ? "bg-[#0e0e15] text-white" : "bg-white text-gray-900"
        }`}
    >
      {/* Left Column - Desktop only */}
      <div className="space-y-6 md:block hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-full shadow-md"
              style={{ backgroundColor: localTask.color }}
            />
            <h2 className="text-3xl font-bold tracking-tight">{localTask.name}</h2>
          </div>
          <Button 
            icon={<HiTrash size={23} />}
            className="h-max w-max p-2 bg-red-600 rounded-xl" 
            onAsyncClick={executeDelete}
          />
        </div>  

        {/* Metadata */}
        <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
          <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-5">
            {scheduleName}
          </p>
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Created:
            </span>{" "}
            {new Date(localTask.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Due:
            </span>{" "}
            {new Date(localTask.endBy).toLocaleDateString()}
          </p>
        </div>

        {/* Tags */}
        {localTask.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {localTask.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-4 py-1 text-sm rounded-md font-medium tracking-wide
                  ${
                    darkMode
                      ? "bg-indigo-700 text-indigo-100"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="text-base font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Description
          </h3>
          <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-300">
            {localTask.description || "No description available."}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard
            icon={<FaBookmark />}
            label="Priority"
            value={localTask.priority}
            darkMode={darkMode}
            colorClass={getPriorityColor(localTask.priority)}
          />
          <div onClick={() => setStatusDropdown((prev) => !prev)}>
            <InfoCard
              icon={<HiClock />}
              label="Status"
              value={localTask.status}
              darkMode={darkMode}
            />
          </div>
          {statusDropdown && (
            <div className={`absolute z-[80] bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-4 mt-2 w-48 left-[15em] top-[22em]`}>
              <ul className="space-y-2">
                {['pending', 'completed', 'overdue'].map((statusOption) => (
                  <li
                    key={statusOption}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 p-2 rounded"
                    onClick={() => {
                      handleStatusChange(statusOption)
                      setStatusDropdown(false)
                    }}
                  >
                    {statusOption}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <InfoCard
            icon={<HiExclamation />}
            label="Difficulty"
            value={localTask.difficulty}
            darkMode={darkMode}
          />
        </div>

        {/* Subtasks */}
        {(localTask.subtasks?.length ?? 0) > 0 ? (
          <div className="mt-4 space-y-4 h-[20em] overflow-y-auto">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">
              Subtasks
            </h3>
            {localTask.subtasks.map((sub, idx) => (
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {sub.des}
                </p>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Due: {new Date(sub.date).toLocaleDateString()}</span>
                  <span>Completion: {sub.completetion}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No subtasks available.
          </p>
        )}


        {/* Add Subtask Form */}
{showAddSubtaskForm && (
  <div className={`w-[40em] bg-gradient-to-br ${!darkMode ? "from-gray-100 via-gray-200 to-gray-100" : "dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"}   p-4 h-fit rounded-2xl pb-16  absolute top-6 left-[11em] z-50 flex flex-col gap-6 `}>
  <div className="backdrop-blur-md bg-white/60 dark:bg-black/40 rounded-2xl shadow-xl p-6 flex items-center justify-evenly">

      <h3 className="font-bold text-2xl text-indigo-700 dark:text-indigo-200 flex items-center gap-2">
        <FaPlus className="text-indigo-500 text-xl" /> Add Subtask
      </h3>
      <button
        onClick={closeSubtask}
        className="text-gray-400 hover:text-indigo-500 text-2xl font-bold transition"
        aria-label="Close"
      >
        &times;
      </button>
    </div>

    <div className="space-y-6">
      {/* Subtask Name */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
          Subtask Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          value={subtaskData.name}
          onChange={handleSubtaskChange}
          placeholder="Enter subtask name"
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none transition
            ${darkMode
              ? "border-indigo-600 bg-zinc-800 text-white placeholder:text-indigo-300"
              : "border-indigo-300 bg-gray-50 text-black"
            }`}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
          Description
        </label>
        <textarea
          name="des"
          value={subtaskData.des}
          onChange={handleSubtaskChange}
          placeholder="Describe this subtask"
          rows={3}
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none transition resize-none
            ${darkMode
              ? "border-indigo-600 bg-zinc-800 text-white placeholder:text-indigo-300"
              : "border-indigo-300 bg-gray-50 text-black"
            }`}
        />
      </div>

      {/* Color + Due Date */}
      <div className="flex gap-4">
        {/* Color */}
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Color
          </label>
          <div className="flex items-center gap-3">
            <input
              name="color"
              type="color"
              value={subtaskData.color}
              onChange={handleSubtaskChange}
              title="Choose subtask color"
              className="w-10 h-10 rounded-full border-2 border-indigo-300 dark:border-indigo-600 shadow cursor-pointer transition"
              style={{ background: "none" }}
            />
            <span className="text-xs font-mono px-2 py-1 rounded bg-indigo-100 dark:bg-zinc-700 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-zinc-700">
              {subtaskData.color}
            </span>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Due Date
          </label>
          <input
            name="date"
            type="date"
            value={subtaskData.date}
            onChange={handleSubtaskChange}
            className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none transition
              ${darkMode
                ? "border-indigo-600 bg-zinc-800 text-white"
                : "border-indigo-300 bg-gray-50 text-black"
              }`}
          />
        </div>
      </div>

      {/* Completion */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
          Completion %
        </label>
        <input
          name="completetion"
          type="number"
          min={0}
          max={100}
          value={subtaskData.completetion}
          onChange={handleSubtaskChange}
          placeholder="0-100"
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none transition
            ${darkMode
              ? "border-indigo-600 bg-zinc-800 text-white"
              : "border-indigo-300 bg-gray-50 text-black"
            }`}
        />
      </div>
    </div>

    {/* Buttons */}
    <div className="flex gap-4 mt-8">
      <Button
        text="Add Subtask"
        onClick={
          handleAddSubtask
        }
        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 rounded-xl shadow-lg font-semibold text-lg transition"
      />
      <Button
        text="Cancel"
        onClick={closeSubtask}
        className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-800 dark:text-white py-3 rounded-xl shadow-lg font-semibold text-lg transition"
      />
    </div>

    {/* Subtask Preview */}
    <div
      className={`rounded-md px-4 py-3 space-y-1 border mt-8 ${
        darkMode ? "bg-zinc-900 border-zinc-700" : "bg-zinc-50 border-zinc-200"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold">
          {subtaskData.name || <span className="text-gray-400">Subtask Name</span>}
        </span>
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: subtaskData.color || "#6366f1" }}
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {subtaskData.des || <span className="text-gray-400">Description...</span>}
      </p>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>
          Due:{" "}
          {subtaskData.date
            ? new Date(subtaskData.date).toLocaleDateString()
            : <span className="text-gray-400">Not set</span>}
        </span>
        <span>
          Completion: {subtaskData.completetion ?? 0}%
        </span>
      </div>
    </div>
  </div>
)}


        {/* Close Button */}
        <div className="mt-4">
          <Button
            text="Add Subtask"
            className="w-full bg-purple-500 py-3 text-white rounded-lg shadow-lg"
            onClick={openSubtask}
          />
          <Button
            text="Close"
            className="w-full bg-purple-500 py-3 text-white rounded-lg shadow-lg mt-5"
            onClick={close}
          />
        </div>
      </div>
      {/* Right Column - Timeline (desktop only) */}
      <div
        className={`rounded-xl shadow-md p-6 w-full max-w-md mx-auto self-start h-full overflow-y-auto md:block hidden
          ${
            darkMode
              ? "bg-zinc-900 border border-zinc-800"
              : "bg-zinc-50 border border-zinc-200"
          }`}
        style={{ position: "relative" }}
      >
        <h3 className="text-lg font-semibold mb-6">Timeline</h3>

        {/* Add Activity Form */}
        <div className={`mb-6 p-4  rounded-md ${darkMode ? "bg-zinc-700" : "bg-zinc-200/50"}`}>
          <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Add Activity
          </h3>
          <select
            name="type"
            value={activityData.type}
            onChange={handleActivityChange}
            className={`w-full mb-2 p-2 rounded  border-indigo-300 ${darkMode ? "bg-zinc-800" : "bg-white"}`}
          >
            <option value="">Select Activity Type </option>
            <option value="created">Created</option>
            <option value="completed">Completed</option>
            <option value="error">Error</option>
            <option value="bug">Bug</option>
            <option value="code">Code</option>
            <option value="other">Other</option>
          </select>
          <input
            name="time"
            type="datetime-local"
            value={activityData.time}
            onChange={handleActivityChange}
            className={`w-full mb-2 p-2 rounded  border-indigo-300 ${darkMode ? "bg-zinc-800 text-white" : "bg-white text-black"}`}
          />
          <Button
            text="Add Activity"
            onClick={handleAddActivity}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded shadow"
          />
        </div>

        {/* Timeline Events */}
        {localTask.activityLog && localTask.activityLog?.length > 0 ? (
          <div className="relative">
            {/* Vertical line through icon centers */}
            <div
              className="absolute left-[28px] top-5 bottom-5 w-[2px] bg-indigo-500 z-0"
              aria-hidden="true"
            />

            {localTask.activityLog.map((entry, idx) => (
              <div key={idx} className="relative flex items-start mb-10">
                {/* Timeline Icon */}
                <Tooltip text={entry.type}>
                  <div
                    className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg
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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No timeline events available.
          </p>
        )}
      </div>

      {/* Mobile View */}
      <div className="block md:hidden h-full overflow-y-auto p-4 space-y-4">
        {/* Sticky Tab Buttons */}
        <div className="flex sticky top-0 bg-inherit z-20 gap-4 py-2">
          <Button
            text="Details"
            className={`flex-1 p-2 text-sm rounded-md ${
              activeTab === 1
                ? "bg-indigo-700 text-white"
                : darkMode
                ? "bg-zinc-800 text-gray-300"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab(1)}
          />
          <Button
            text="Timeline"
            className={`flex-1 p-2 text-sm rounded-md ${
              activeTab === 2
                ? "bg-indigo-700 text-white"
                : darkMode
                ? "bg-zinc-800 text-gray-300"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab(2)}
          />
        </div>

        {/* Details Tab */}
        {activeTab === 1 && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div
                className="h-4 w-4 rounded-full shadow-md"
                style={{ backgroundColor: localTask.color }}
              />
              <h2 className="text-2xl font-bold">{localTask.name}</h2>
            </div>

            {/* Metadata */}
            <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                {scheduleName}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(localTask.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Due:</strong>{" "}
                {new Date(localTask.endBy).toLocaleDateString()}
              </p>
            </div>

            {/* Tags */}
            {localTask.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {localTask.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 text-xs rounded-md font-medium ${
                      darkMode
                        ? "bg-indigo-700 text-indigo-100"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold mb-1">Description</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {localTask.description || "No description available."}
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoCard
                icon={<FaBookmark />}
                label="Priority"
                value={localTask.priority}
                darkMode={darkMode}
                colorClass={getPriorityColor(localTask.priority)}
              />
              <InfoCard
                icon={<HiClock />}
                label="Status"
                value={status}
                darkMode={darkMode}
              />
              <InfoCard
                icon={<HiExclamation />}
                label="Difficulty"
                value={localTask.difficulty}
                darkMode={darkMode}
              />
            </div>

            {/* Subtasks */}
            {localTask.subtasks?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold mb-1">Subtasks</h3>
                {localTask.subtasks.map((sub, idx) => (
                  <div
                    key={idx}
                    className={`rounded-md p-3 space-y-1 ${
                      darkMode ? "bg-zinc-900" : "bg-zinc-100"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{sub.name}</span>
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: sub.color }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {sub.des}
                    </p>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Due: {new Date(sub.date).toLocaleDateString()}</span>
                      <span>Completion: {sub.completetion}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Subtask Form */}
{showAddSubtaskForm && (
  <div className={`w-[calc(100%-2em)] bg-gradient-to-br ${!darkMode ? "from-gray-100 via-gray-200 to-gray-100" : "dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"}   p-4 h-fit rounded-2xl pb-16  absolute top-6 left-[1em] z-50 flex flex-col gap-6 `}>
  <div className="backdrop-blur-md bg-white/60 dark:bg-black/40 rounded-2xl shadow-xl p-6 flex items-center justify-evenly">

      <h3 className="font-bold text-2xl text-indigo-700 dark:text-indigo-200 flex items-center gap-2">
        <FaPlus className="text-indigo-500 text-xl" /> Add Subtask
      </h3>
      <button
        onClick={closeSubtask}
        className="text-gray-400 hover:text-indigo-500 text-2xl font-bold transition"
        aria-label="Close"
      >
        &times;
      </button>
    </div>

    <div className="space-y-6">
      {/* Subtask Name */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
          Subtask Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          value={subtaskData.name}
          onChange={handleSubtaskChange}
          placeholder="Enter subtask name"
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none transition
            ${darkMode
              ? "border-indigo-600 bg-zinc-800 text-white placeholder:text-indigo-300"
              : "border-indigo-300 bg-gray-50 text-black"
            }`}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
          Description
        </label>
        <textarea
          name="des"
          value={subtaskData.des}
          onChange={handleSubtaskChange}
          placeholder="Describe this subtask"
          rows={3}
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none transition resize-none
            ${darkMode
              ? "border-indigo-600 bg-zinc-800 text-white placeholder:text-indigo-300"
              : "border-indigo-300 bg-gray-50 text-black"
            }`}
        />
      </div>

      {/* Color + Due Date */}
      <div className="flex gap-4">
        {/* Color */}
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Color
          </label>
          <div className="flex items-center gap-3">
            <input
              name="color"
              type="color"
              value={subtaskData.color}
              onChange={handleSubtaskChange}
              title="Choose subtask color"
              className="w-10 h-10 rounded-full border-2 border-indigo-300 dark:border-indigo-600 shadow cursor-pointer transition"
              style={{ background: "none" }}
            />
            <span className="text-xs font-mono px-2 py-1 rounded bg-indigo-100 dark:bg-zinc-700 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-zinc-700">
              {subtaskData.color}
            </span>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Due Date
          </label>
          <input
            name="date"
            type="date"
            value={subtaskData.date}
            onChange={handleSubtaskChange}
            className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none transition
              ${darkMode
                ? "border-indigo-600 bg-zinc-800 text-white"
                : "border-indigo-300 bg-gray-50 text-black"
              }`}
          />
        </div>
      </div>

      {/* Completion */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
          Completion %
        </label>
        <input
          name="completetion"
          type="number"
          min={0}
          max={100}
          value={subtaskData.completetion}
          onChange={handleSubtaskChange}
          placeholder="0-100"
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none transition
            ${darkMode
              ? "border-indigo-600 bg-zinc-800 text-white"
              : "border-indigo-300 bg-gray-50 text-black"
            }`}
        />
      </div>
    </div>

    {/* Buttons */}
    <div className="flex gap-4 mt-8">
      <Button
        text="Add Subtask"
        onClick={
          handleAddSubtask
        }
        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 rounded-xl shadow-lg font-semibold text-lg transition"
      />
      <Button
        text="Cancel"
        onClick={closeSubtask}
        className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-800 dark:text-white py-3 rounded-xl shadow-lg font-semibold text-lg transition"
      />
    </div>

    {/* Subtask Preview */}
    <div
      className={`rounded-md px-4 py-3 space-y-1 border mt-8 ${
        darkMode ? "bg-zinc-900 border-zinc-700" : "bg-zinc-50 border-zinc-200"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold">
          {subtaskData.name || <span className="text-gray-400">Subtask Name</span>}
        </span>
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: subtaskData.color || "#6366f1" }}
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {subtaskData.des || <span className="text-gray-400">Description...</span>}
      </p>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>
          Due:{" "}
          {subtaskData.date
            ? new Date(subtaskData.date).toLocaleDateString()
            : <span className="text-gray-400">Not set</span>}
        </span>
        <span>
          Completion: {subtaskData.completetion ?? 0}%
        </span>
      </div>
    </div>
  </div>
)}

            {/* Close Button */}
            <div className="mt-4">
              <Button
                text="Open Subtask"
                className="w-full bg-purple-500 py-3 text-white rounded-lg shadow-lg mb-3"
                onClick={openSubtask}
              />
              <Button
                text="Close"
                className="w-full bg-purple-500 py-3 text-white rounded-lg shadow-lg"
                onClick={close}
              />
            </div>
          </div>
      
        )}

        {/* Timeline Tab */}
        {activeTab === 2 && (
          <div
            className={`rounded-lg p-4 shadow-md ${
              darkMode
                ? "bg-zinc-900 border border-zinc-800"
                : "bg-zinc-50 border border-zinc-200"
            }`}
          >
            <h3 className="text-base font-semibold mb-4">Timeline</h3>

            {/* Add Activity Form */}
        <div className={`mb-6 p-4  rounded-md ${darkMode ? "bg-zinc-700" : "bg-zinc-200/50"}`}>
          <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Add Activity
          </h3>
          <select
            name="type"
            value={activityData.type}
            onChange={handleActivityChange}
            className={`w-full mb-2 p-2 rounded  border-indigo-300 ${darkMode ? "bg-zinc-800" : "bg-white"}`}
          >
            <option value="">Select Activity Type </option>
            <option value="created">Created</option>
            <option value="completed">Completed</option>
            <option value="error">Error</option>
            <option value="bug">Bug</option>
            <option value="code">Code</option>
            <option value="other">Other</option>
          </select>
          <input
            name="time"
            type="datetime-local"
            value={activityData.time}
            onChange={handleActivityChange}
            className={`w-full mb-2 p-2 rounded  border-indigo-300 ${darkMode ? "bg-zinc-800 text-white" : "bg-white text-black"}`}
          />
          <Button
            text="Add Activity"
            onClick={handleAddActivity}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded shadow"
          />
        </div>

            {localTask.activityLog?.length ? (
              <div className="relative">
                <div
                  className="absolute left-[28px] top-5 bottom-5 w-[2px] bg-indigo-500 z-0"
                  aria-hidden="true"
                />
                {localTask.activityLog.map((entry, idx) => (
                  <div key={idx} className="relative flex items-start mb-10">
                    <Tooltip text={entry.type}>
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full text-white shadow-lg ring-4 ring-white dark:ring-zinc-900"
                        style={{ backgroundColor: "#6366f1", marginLeft: "6px" }}
                      >
                        {IconDisplay(entry.type)}
                      </div>
                    </Tooltip>
                    <div className="ml-4 text-sm">
                      <div className="font-semibold capitalize">{entry.type}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(entry.time).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No timeline events available.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
 export default NewTaskDetails;