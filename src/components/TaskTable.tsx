import React, { useState } from "react";
import {
  MdOutlineKeyboardDoubleArrowUp,
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardDoubleArrowDown,
  MdInfoOutline,
} from "react-icons/md";
import { tasks } from "../assets/Data";
import Dialog from "./dialog";

type TaskTableProps = {
  darkMode: boolean;
};

const TaskTable: React.FC<TaskTableProps> = ({ darkMode }) => {
  const [selectedTask, setSelectedTask] = useState<any>(null);

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
            <th className="py-3 px-4">Details</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className={`transition-all border-b text-left ${
                darkMode
                  ? "border-gray-700 hover:bg-zinc-700"
                  : "border-gray-200 hover:bg-gray-100"
              }`}
            >
              {/* Priority */}
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

              {/* Name */}
              <td className="py-3 px-4 text-left">{task.name}</td>

              {/* Due Date */}
              <td className="py-3 px-4 text-left">
                {new Date(task.endBy).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>

              {/* Info Button */}
              <td className="py-3 px-4">
                <button
                  onClick={() => setSelectedTask(task)}
                  className="text-blue-500 hover:underline flex items-center gap-1"
                >
                  <MdInfoOutline className="text-lg" /> Info
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Description */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <Dialog 
          darkMode={darkMode} 
          isOpen={selectedTask} 
          Header={selectedTask.name} 
          Body={selectedTask.description} 
          subTasks={selectedTask.subTasks}
          button={[
            {text: "Close", onClick: () => setSelectedTask(null), className: "text-white rounded-md dark:bg-red-700/70 bg-zinc-70/40" }
          ]}
        />
        </div>
      )}
    </div>
  );
};

export default TaskTable;
