import { useEffect, useState } from "react";
import { BsPinAngleFill } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoCubeOutline } from "react-icons/io5";
import { RiCalendarEventFill } from "react-icons/ri";
import { HiMiniTag } from "react-icons/hi2";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlineKeyboardDoubleArrowUp,
} from "react-icons/md";
import clsx from "clsx";
import Calendar from "../components/Calendar";
import Dialog from "../components/dialog";
import Cards from "../components/Cards/Cards";
import axiosInstance from "../api/axiosInstance";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface UserProps {
  darkMode: boolean;
}

interface Task {
  id: string;
  name: string;
  endBy: string;
  status: string;
  priority: "low" | "medium" | "high";
}

interface Schedule {
  id: string;
  tasks: Task[];
}

const User: React.FC<UserProps> = ({ darkMode }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [pinOpen, setPinOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const allTasks = schedules.flatMap(s => s.tasks);

  // Calculate dynamic stats
  const today = new Date().toISOString().split("T")[0];
  const stats = [
    { label: "Tasks Today", value: allTasks.filter(t => t.endBy?.split("T")[0] === today).length },
    { label: "Completed", value: allTasks.filter(t => t.status === "completed").length },
    { label: "Pending", value: allTasks.filter(t => t.status === "pending").length },
    { label: "Overdue", value: allTasks.filter(t => new Date(t.endBy) < new Date() && t.status !== "completed").length },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/tasks/my");
        setSchedules(response.data?.schedules || []);
      } catch (err) {
        console.error("Failed to fetch schedules:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const bgGradient = darkMode
    ? "bg-gradient-to-br from-[#1b1b1b] to-[#27292c]"
    : "bg-gradient-to-br from-[#f7f7ff] to-[#e4e6fb]";

  const textColor = darkMode ? "text-white" : "text-[#232946]";
  const cardBg = darkMode ? "bg-[#232526]/90 text-white" : "bg-white/70 text-black";
  const asideBg = darkMode ? "bg-[#1a1a1a]" : "bg-[#ffffffcc]";
  const statBg = darkMode
    ? "bg-[#232526]/60 border border-gray-700 text-white"
    : "bg-white/70 border border-gray-300 text-black";
  const taskListBg = statBg;
  const headerBg = darkMode ? "bg-[#1b1b1b] border-gray-700" : "bg-[#f7f7ff] border-gray-300";

  return (
    <div className={`relative z-50 md:top-14 md:w-[128.5%] w-[92%] md:-left-4 left-[74px] min-h-screen ${bgGradient} ${textColor} top-14`}>
      <header className={`flex items-center justify-between px-8 py-6 ${headerBg} border-b shadow`}>
        <div className="flex items-center gap-4">
          <IoCubeOutline className="text-3xl text-blue-400" />
          <span className="text-2xl font-bold tracking-wide">Task Dashboard</span>
        </div>
        <div className="flex items-center gap-6 text-2xl">
          <FaRegBell className="hover:text-blue-400 transition transform hover:scale-110 cursor-pointer" />
          <HiOutlineDotsVertical className="hover:text-blue-400 transition transform hover:scale-110 cursor-pointer" />
        </div>
      </header>

      {/* Cards (Static example, adjust if needed) */}
      <section className="flex flex-wrap gap-6 justify-center mt-8 mb-8">
        {stats.map((card, idx) => (
          <Cards
            key={idx}
            darkMode={darkMode}
            title={card.label}
            icon={<RiCalendarEventFill />}
            className={clsx('min-w-[220px] max-w-xs rounded-xl p-5 backdrop-blur shadow-lg transition-colors', cardBg)}
            iconContainerClassName="p-3 rounded-full bg-blue-100 text-blue-900"
            body={String(card.value)}
            bodyClassName="text-3xl font-bold"
            titleClassName="font-semibold"
          />
        ))}
      </section>

      <main className="flex flex-col md:flex-row gap-8 px-8 pb-12">
        <aside className={`flex-col w-full md:w-1/4 ${asideBg} p-6 rounded-xl shadow-lg mb-8 md:mb-0`}>
          <h1 className="text-3xl font-semibold tracking-[0.3em] mb-2 text-center">YEAR</h1>
          <h2 className="text-2xl font-bold tracking-[0.3em] mb-6 text-center">2025</h2>
          <div className="relative w-full h-72 overflow-hidden rounded-xl shadow md:h-[35em]">
            <div
              className="overflow-y-scroll h-full no-scrollbar"
              style={{
                scrollBehavior: "smooth",
                maskImage: "linear-gradient(to bottom, transparent 0%, white 20%, white 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, white 20%, white 80%, transparent 100%)",
              }}
            >
              {months.map((month, index) => (
                <div
                  key={month}
                  onClick={() => setSelectedMonth(index)}
                  className={`flex items-center justify-center py-3 text-lg font-semibold cursor-pointer transition-all rounded-lg ${
                    selectedMonth === index
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-400 hover:bg-[#2d2f33] hover:text-white"
                  }`}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex-1 flex flex-col items-center">
          <div className="flex items-center justify-between w-full max-w-lg mb-6 text-xl">
            <div className="flex items-center gap-3 font-semibold">
              <RiCalendarEventFill />
              <span>{months[selectedMonth].slice(0, 3)} 26, TUE</span>
            </div>
            <div className="flex items-center gap-4 text-2xl">
              <BsPinAngleFill
                className="cursor-pointer hover:text-blue-400 transition transform hover:scale-110"
                onClick={() => setPinOpen(true)}
              />
              <HiMiniTag
                className="cursor-pointer hover:text-red-400 transition transform hover:scale-110"
                onClick={() => setTagOpen(true)}
              />
            </div>
          </div>

          <Calendar
            className={`${statBg} w-full max-w-lg p-6 rounded-xl shadow-lg backdrop-blur`}
            info={`You have ${stats[0].value} tasks today`}
            darkMode={darkMode}
            button={[
              {
                icon: <BsPinAngleFill />,
                className: "bg-blue-500 rounded-full h-10 w-10 text-white",
                onClick: () => setPinOpen(true),
              },
              {
                icon: <HiMiniTag />,
                className: "bg-red-500 rounded-full h-10 w-10 text-white",
                onClick: () => setTagOpen(true),
              },
            ]}
          />

          {/* Dialogs */}
          <Dialog
            isOpen={pinOpen}
            setIsOpen={setPinOpen}
            Header="Pin Important Task"
            Body="Pin your most important tasks for quick access and reminders."
            className={`w-full max-w-md mx-auto ${darkMode ? "bg-[#232526cc] text-white" : "bg-white/90 text-black"} p-6 rounded-lg shadow-lg relative top-[5em] z-50 backdrop-blur`}
            button={[
              {
                text: "Start Pinning",
                onClick: () => setPinOpen(false),
                className: "bg-blue-600 text-white rounded-md px-4 py-2",
              },
            ]}
          />
          <Dialog
            isOpen={tagOpen}
            setIsOpen={setTagOpen}
            Header="Tag Your Task"
            Body="Organize your tasks with tags for better tracking and filtering."
            className={`w-full max-w-md mx-auto ${darkMode ? "bg-[#232526cc] text-white" : "bg-white/90 text-black"} p-6 rounded-lg shadow-lg relative top-[5em] z-50 backdrop-blur`}
            button={[
              {
                text: "Start Tagging",
                onClick: () => setTagOpen(false),
                className: "bg-red-700 text-white rounded-md px-4 py-2",
              },
            ]}
          />
        </section>

        <div className={`${taskListBg} w-full max-w-lg mb-8 rounded-lg p-4 shadow-lg backdrop-blur border`}>
          <h2 className="text-2xl font-semibold mb-4">Task List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm md:text-base">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="py-2 px-3">Priority</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">End By</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="py-4 px-3" colSpan={5}>Loading...</td></tr>
                ) : allTasks.length === 0 ? (
                  <tr><td className="py-4 px-3" colSpan={5}>No tasks found.</td></tr>
                ) : (
                  allTasks.map(({ id, priority, status, name, endBy }) => {
                    const formattedDate = new Date(endBy).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <tr key={id} className="border-b border-gray-700 transition-colors cursor-pointer py-[5rem]">
                        <td className={`py-2 px-3 capitalize font-semibold flex items-center gap-2 ${
                          priority === "high" ? "text-red-500" :
                          priority === "medium" ? "text-yellow-400" :
                          "text-green-400"
                        }`}>
                          {priority === "high" && <MdOutlineKeyboardDoubleArrowUp className="text-xl" />}
                          {priority === "medium" && <MdOutlineKeyboardArrowUp className="text-lg" />}
                          {priority === "low" && <MdOutlineKeyboardDoubleArrowDown className="text-xl" />}
                          <span>{priority}</span>
                        </td>
                        <td className={`py-2 px-3 capitalize font-medium ${
                          status === "completed" ? "text-green-400" :
                          status === "pending" ? "text-yellow-400" : "text-red-500"
                        }`}>
                          {status}
                        </td>
                        <td className="py-2 px-3 truncate max-w-[150px]" title={name}>{name}</td>
                        <td className="py-2 px-3">{formattedDate}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default User;
