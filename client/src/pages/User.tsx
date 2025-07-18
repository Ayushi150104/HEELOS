import { useState } from "react";
import { BsPinAngleFill } from "react-icons/bs";
import { FaLocationArrow, FaRegBell } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoCubeOutline } from "react-icons/io5";
import { RiCalendarEventFill } from "react-icons/ri";
import Calendar from "../components/Calendar";
import { HiMiniTag } from "react-icons/hi2";
import Dialog from "../components/dialog";
import Cards from "../components/Cards/Cards";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlineKeyboardDoubleArrowUp,
} from "react-icons/md";
import clsx from "clsx";
import { cardsData, schedules } from "../assets/Data";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];


interface UserProps {
  darkMode: boolean;
}

const User: React.FC<UserProps> = ({ darkMode }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [pinOpen, setPinOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);

  const stats = [
    { label: "Tasks Today", value: 12 },
    { label: "Completed", value: 8 },
    { label: "Pending", value: 3 },
    { label: "Overdue", value: 1 },
  ];

  // Dynamic classes based on dark mode
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
    <div
      className={`relative z-50 md:top-14 md:w-[128.5%] w-[92%] md:-left-4 left-[74px] min-h-screen ${bgGradient} ${textColor} top-14 `}
    >
      {/* Header */}
      <header
        className={`flex items-center justify-between px-8 py-6 ${headerBg} border-b shadow`}
      >
        <div className="flex items-center gap-4">
          <IoCubeOutline className="text-3xl text-blue-400" />
          <span className="text-2xl font-bold tracking-wide">Task Dashboard</span>
        </div>
        <div className="flex items-center gap-6 text-2xl">
          <FaRegBell className="hover:text-blue-400 transition transform hover:scale-110 cursor-pointer" />
          <HiOutlineDotsVertical className="hover:text-blue-400 transition transform hover:scale-110 cursor-pointer" />
        </div>
      </header>

      {/* Cards Section */}
<section className="flex flex-wrap gap-6 justify-center mt-8 mb-8">
  {cardsData.map((card, idx) => (
    <Cards
      key={idx}
      darkMode={darkMode}  // pass as darkMode prop if your Card expects it as darkMode
      title={card.text}
      icon={card.icon}
      className={clsx(
        'min-w-[220px] max-w-xs rounded-xl p-5 backdrop-blur shadow-lg transition-colors',
        darkMode
          ? 'bg-neutral-800/90 text-white'
          : 'bg-white/70 text-black',
        // Allow override via prop if needed
        card.className
      )}
      iconContainerClassName={clsx(
        card.classButton,
        'p-3 rounded-full transition-colors',
        darkMode
          ? 'bg-blue-900 text-blue-100'
          : 'bg-blue-100 text-blue-900'
      )}
      body={card.body}
      bodyClassName={clsx(
        'text-sm mt-1 w-[13em]',
        darkMode ? 'text-gray-300' : 'text-gray-700'
      )}
      titleClassName={clsx(
        'font-semibold',
        darkMode ? 'text-white' : 'text-black'
      )}
    />
  ))}
</section>


      <main className="flex flex-col md:flex-row gap-8 px-8 pb-12">
        {/* Aside - Months */}
        <aside
          className={`flex-col items-center justify-start w-full md:w-1/4 ${asideBg} p-6 rounded-xl shadow-lg mb-8 md:mb-0`}
        >
          <h1 className="text-3xl font-semibold tracking-[0.3em] mb-2 text-center">YEAR</h1>
          <h2 className="text-2xl font-bold tracking-[0.3em] mb-6 text-center">2025</h2>
          <div className="relative w-full h-72 overflow-hidden rounded-xl shadow md:h-[35em]">
            <div
              className="overflow-y-scroll h-full no-scrollbar"
              style={{
                scrollBehavior: "smooth",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, white 20%, white 80%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, white 20%, white 80%, transparent 100%)",
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

        {/* Main Section */}
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

          {/* Stats Grid */}
          <div className={`grid grid-cols-2 gap-6 mb-8 w-full max-w-lg`}>
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`${statBg} rounded-lg p-4 flex flex-col items-center shadow-lg backdrop-blur`}
              >
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className="text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <Calendar
            className={`${statBg} w-full max-w-lg p-6 rounded-xl shadow-lg backdrop-blur`}
            info="You have 3 more tasks this month"
            darkMode={darkMode}
            button={[
              {
                icon: <BsPinAngleFill />,
                className:
                  "bg-blue-500 rounded-full flex items-center justify-center h-10 w-10 text-lg hover:scale-110 transition p-2 text-white",
                onClick: () => setPinOpen(true),
              },
              {
                icon: <HiMiniTag />,
                className:
                  "bg-red-500 rounded-full flex items-center justify-center h-10 w-10 text-lg hover:scale-110 transition p-2 text-white",
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
            className={`w-full max-w-md mx-auto ${
              darkMode ? "bg-[#232526cc] text-white" : "bg-white/90 text-black"
            } p-6 rounded-lg shadow-lg relative top-[5em] z-50 backdrop-blur`}
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
            color="text-black"
            className={`w-full max-w-md mx-auto ${
              darkMode ? "bg-[#232526cc] text-white" : "bg-white/90 text-black"
            } p-6 rounded-lg shadow-lg relative top-[5em] z-50 backdrop-blur`}
            button={[
              {
                text: "Start Tagging",
                onClick: () => setTagOpen(false),
                className: "bg-red-700 text-white rounded-md px-4 py-2",
                
              },
            ]}
          />
        </section>

        {/* Task List */}
        <div
          className={`${taskListBg} w-full max-w-lg mb-8 rounded-lg p-4 shadow-lg backdrop-blur border`}
        >
          <h2 className="text-2xl font-semibold mb-4">Task List</h2>

          {/* Responsive container with horizontal scroll for small devices */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm md:text-base">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="py-2 px-3 whitespace-nowrap">ID</th>
                  <th className="py-2 px-3 whitespace-nowrap">Priority</th>
                  <th className="py-2 px-3 whitespace-nowrap">Status</th>
                  <th className="py-2 px-3 whitespace-nowrap max-w-[150px]">Name</th>
                  <th className="py-2 px-3 whitespace-nowrap">End By</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) =>
                  schedule.tasks.map(({ id, priority, status, name, endBy }) => {
                    const formattedDate = new Date(endBy).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                  
                    return (
                      <tr
                        key={id}
                        className="border-b border-gray-700  transition-colors cursor-pointer"
                      >
                        <td className="py-2 px-3 font-mono whitespace-nowrap">{id}</td>
                        <td
                          className={`py-2 px-3 capitalize font-semibold flex items-center gap-2 whitespace-nowrap ${
                            priority === "high"
                              ? "text-red-500"
                              : priority === "medium"
                              ? "text-yellow-400"
                              : "text-green-400"
                          }`}
                        >
                          {priority === "high" && (
                            <MdOutlineKeyboardDoubleArrowUp className="text-xl" />
                          )}
                          {priority === "medium" && (
                            <MdOutlineKeyboardArrowUp className="text-lg" />
                          )}
                          {priority === "low" && (
                            <MdOutlineKeyboardDoubleArrowDown className="text-xl" />
                          )}
                          <span>{priority}</span>
                        </td>
                        <td
                          className={`py-2 px-3 capitalize whitespace-nowrap font-medium ${
                            status === "completed"
                              ? "text-green-400"
                              : status === "pending"
                              ? "text-yellow-400"
                              : "text-red-500"
                          }`}
                        >
                          {status}
                        </td>
                        <td
                          className="py-2 px-3 max-w-[150px] truncate text-wrap"
                          title={name}
                        >
                          {name}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">{formattedDate}</td>
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
