import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Navbar from "./components/Navbar.tsx";
import Login from "./pages/AuthComponent.tsx";
import User from "./pages/User.tsx";
import Sidebar from "./components/Sidebar.tsx";
import Profile from "./pages/Profile.tsx";
import Tasks from "./pages/Tasks.tsx";
import ManageTasks from "./pages/ManageTasks.tsx";

function AppContent() {
  const location = useLocation();
  const hideSidebarPaths = ["/", "/about", "/contact", "/login"];
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

  // Dark mode state lifted here
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) return saved === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Effect to add/remove 'dark' class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    // Wrapper div for background & text colors using Tailwind dark classes
    <div className={`min-h-max ${darkMode ? " text-white" : " text-gray-900"} transition-colors duration-500`}>

      {shouldShowSidebar && <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      {/* Main routes */}
      <Routes>
        <Route path="/login" element={<Login darkMode={darkMode} />}/>
        <Route path="/user" element={<User darkMode={darkMode} />} />
        <Route path="/" element={<Home darkMode={darkMode} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/DashBoard" element={<User darkMode={darkMode} />} />
        <Route path="/Profile" element={<Profile darkMode={darkMode} />} />
        <Route path="/Tasks" element={<Tasks darkMode={darkMode} />} />
        <Route path="/manageTasks" element={<ManageTasks darkMode={darkMode} />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
