import React, { useState } from "react";
import { FiMoon, FiSun, FiSearch, FiHeart, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const links = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Contact", link: "/contact" },
];

const hideLogoutOnPaths = ["/login", "/", "/about", "/contact"];

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    toast.success("Logged out successfully")
    navigate("/login"); // Redirect to login page
  };

  const showLogout = !hideLogoutOnPaths.includes(location.pathname);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-60 bg-transparent ${
        darkMode ? "text-white" : "text-[#232946]"
      }`}
    >
      <div
        className={`backdrop-blur-md bg-white/30 ${
          darkMode
            ? "bg-gradient-to-b from-[#1b1b1b] to-[#27292c] bg-opacity-70"
            : "bg-gradient-to-b from-[#f7f7ff] to-[#e4e6fb]"
        } flex justify-between items-center px-6 sm:px-8 py-4 rounded-b-xl shadow-md`}
      >
        {/* Logo */}
        <div className="text-2xl font-bold tracking-widest">HEELOS</div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-4 bg-black/10 rounded-full px-3 py-1">
          {links.map(({ name, link }) => (
            <NavLink
              to={link}
              key={name}
              className={({ isActive }) =>
                `relative px-4 py-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-white text-black font-semibold shadow"
                    : darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-black"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="pill-tab"
                      className="absolute inset-0 bg-white rounded-full z-[-1]"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{name}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* Logout Button - show only if not on excluded pages */}
          {showLogout && (
            <button
              onClick={handleLogout}
              className="ml-4 flex items-center space-x-1 px-4 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
              aria-label="Logout"
              type="button"
            >
              <FiLogOut />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </nav>

        {/* Icons & Hamburger */}
        <div className="flex items-center space-x-4 text-lg">
          <button
            className="hover:text-blue-500 transition-colors"
            aria-label="Search"
            type="button"
          >
            <FiSearch />
          </button>
          <button
            className="hover:text-blue-500 transition-colors"
            aria-label="Favorites"
            type="button"
          >
            <FiHeart />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`ml-2 p-2 rounded-full border transition-colors ${
              darkMode
                ? "border-white/30 bg-white text-black"
                : "border-gray-300 bg-zinc-800 text-white"
            }`}
            aria-label="Toggle Dark Mode"
            type="button"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          {/* Logout Button Mobile - show only if not on excluded pages */}
          {showLogout && (
            <button
              onClick={handleLogout}
              className="ml-2 p-2 rounded-full border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors md:hidden"
              aria-label="Logout"
              type="button"
            >
              <FiLogOut size={20} />
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden ml-2 p-2 rounded-full border border-gray-400 text-current"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            type="button"
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.nav
              id="mobile-menu"
              className={`fixed inset-x-4 top-[5.5rem] rounded-2xl shadow-2xl z-40 p-6
                bg-gradient-to-b ${
                  darkMode
                    ? "from-[#1b1b1b] to-[#27292c] bg-opacity-70 text-[#f4faff]"
                    : "from-[#f7f7ff] to-[#e4e6fb] text-[#232946]"
                }`}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              role="menu"
              aria-label="Mobile navigation menu"
            >
              <ul className="flex flex-col space-y-6 text-lg tracking-widest">
                {links.map(({ name, link }) => (
                  <li key={name}>
                    <NavLink
                      to={link}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `block w-full text-left px-4 py-2 rounded-lg transition-all duration-200 select-none ${
                          isActive
                            ? "bg-white text-black font-semibold shadow"
                            : darkMode
                            ? "hover:bg-[#2c5282] hover:text-[#eebbc3] text-[#f4faff]"
                            : "hover:bg-[#bee3f8] hover:text-[#232946] text-[#232946]"
                        }`
                      }
                      aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                      aria-label={`Navigate to ${name}`}
                    >
                      {name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.nav>

            <motion.button
              type="button"
              className="fixed inset-0 bg-black bg-opacity-40 z-30"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close mobile menu"
              tabIndex={-1}
            />
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
