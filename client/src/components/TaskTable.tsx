import React, { useState } from "react";
import {
  MdOutlineKeyboardDoubleArrowUp,
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardDoubleArrowDown,
} from "react-icons/md";
import NewTaskDetails from "../pages/NewTaskDetails";

type SingleSchedule = {
  scheduleName: string;
  scheduleId: string;
  taskId?: string; // Optional, used for specific task details
  color: string;
  createdBy: string;
  tasks: {
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
  }[];
};

type TaskTableProps = {
  darkMode: boolean;
  schedule: SingleSchedule; // only one schedule now
};

const TaskTable: React.FC<TaskTableProps> = ({ darkMode, schedule }) => {
  const [selectedTaskIdx, setSelectedTaskIdx] = useState<number | null>(null);

  const handleRowClick = (taskIdx: number) => {
    setSelectedTaskIdx(prev => (prev === taskIdx ? null : taskIdx));
  };

  return (
    <div
      className={`overflow-x-auto w-full p-4 rounded-xl shadow-md ${
        darkMode ? "bg-zinc-800/80 text-white" : "bg-white text-black"
      }`}
    >
      <table
        className={`min-w-full border-collapse w-full text-sm ${
          darkMode ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <thead>
          <tr
            className={`text-left text-xs uppercase tracking-wider ${
              darkMode ? "bg-zinc-900 text-gray-200" : "bg-gray-100 text-gray-700"
            }`}
          >
            <th className="py-3 px-4">Priority</th>
            <th className="py-3 px-4">Task Name</th>
            <th className="py-3 px-4">Due Date</th>
          </tr>
        </thead>

        <tbody>
          {schedule.tasks.map((task, taskIdx) => (
            <React.Fragment key={taskIdx}>
              <tr
                className={`transition-all border-b text-left cursor-pointer ${
                  darkMode
                    ? "border-gray-700 hover:bg-zinc-700"
                    : "border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => handleRowClick(taskIdx)}
              >
                <td className="py-3 px-4 flex items-center gap-2 font-medium">
                  {task.priority === "high" && (
                    <MdOutlineKeyboardDoubleArrowUp className="text-red-500 text-lg" />
                  )}
                  {task.priority === "medium" && (
                    <MdOutlineKeyboardArrowUp className="text-yellow-400 text-lg" />
                  )}
                  {task.priority === "low" && (
                    <MdOutlineKeyboardDoubleArrowDown className="text-green-400 text-lg" />
                  )}
                  <span
                    className={`capitalize ${
                      task.priority === "high"
                        ? "text-red-500"
                        : task.priority === "medium"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="py-3 px-4">{task.name}</td>
                <td className="py-3 px-4">
                  {new Date(task.endBy).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>

              {selectedTaskIdx === taskIdx && (
                <tr>
                  <td colSpan={3} className="p-4 bg-gray-100 dark:bg-zinc-900">
                    <NewTaskDetails
                      darkMode={darkMode}
                      task={task}
                      scheduleId={schedule._id}
                      scheduleName={schedule.scheduleName}
                      close={() => setSelectedTaskIdx(null)}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
