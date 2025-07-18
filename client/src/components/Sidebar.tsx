import { useState } from 'react';
import { BsReverseLayoutSidebarReverse } from 'react-icons/bs';
import { FiHome, FiList, FiEdit, FiUser, FiMoon, FiSun } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const sidebarItems = [
  { label: 'Dashboard', icon: <FiHome />, link: '/DashBoard' },
  { label: 'All Tasks', icon: <FiList />, link: '/Tasks' },
  { label: 'Manage Tasks', icon: <FiEdit />, link: '/ManageTasks' },
  { label: 'Profile', icon: <FiUser />, link: '/Profile' },
];

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ darkMode, setDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const darkBg = 'bg-gradient-to-b from-[#1b1b1b] to-[#27292c] backdrop-blur bg-opacity-70';
  const lightBg = 'bg-gradient-to-b from-[#f7f7ff] to-[#e4e6fb]';
  const darkText = 'text-[#f4faff]';
  const lightText = 'text-[#232946]';

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        aria-expanded={isOpen}
        aria-label="Toggle sidebar menu"
        className={`fixed top-4 left-4 p-2 rounded-md shadow-lg md:hidden z-[80]
          ${darkMode ? 'bg-[#393e6c] text-[#eebbc3]' : 'bg-[#eebbc3] text-[#232946]'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <BsReverseLayoutSidebarReverse size={22} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 md:w-80
          flex flex-col justify-between py-6 px-4 shadow-2xl
          transition-transform transition-opacity duration-300 ease-in-out z-[53]
          ${darkMode ? darkBg : lightBg}
          ${darkMode ? darkText : lightText}
          ${
            isOpen
              ? 'translate-x-0 opacity-100 pointer-events-auto'
              : '-translate-x-full opacity-0 pointer-events-none'
          }
          md:translate-x-0 md:opacity-100 md:pointer-events-auto
          overflow-y-auto`}
      >
        <div>
          {/* Brand */}
          <div className="font-extrabold text-3xl mb-12 text-center tracking-wide select-none">
            HEELOS
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-3">
              {sidebarItems.map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer font-medium text-base md:text-lg transition-colors duration-200 ${
                        isActive
                          ? `${darkMode ? 'bg-[#2c5282] text-[#eebbc3] shadow-md' : 'bg-[#bee3f8] text-[#232946] shadow-md'}`
                          : `${darkMode ? 'hover:bg-[#393e6c] hover:text-[#eebbc3]' : 'hover:bg-[#eebbc3] hover:text-[#232946]'}`
                      }`
                    }
                  >
                    <span className="text-xl md:text-2xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Dark Mode Toggle */}
        <div
          className={`md:mt-6 mb-auto mt-[75vh] md:mb-[1em] flex items-center justify-between px-4 py-3 rounded-lg ${
            darkMode ? 'bg-[#2a2a2a]/60' : 'bg-[#ffffffcb]'
          }`}
        >
          <span className="font-medium text-base">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          <button
            aria-label="Toggle dark mode"
            onClick={() => setDarkMode(!darkMode)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 ${
              darkMode ? 'bg-white text-black border-gray-800/50' : 'bg-zinc-800 text-white border-gray-400/50'
            }`}
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>
      </aside>

      {/* Background Overlay for Mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
    </>
  );
};

export default Sidebar;
