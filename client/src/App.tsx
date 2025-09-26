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
import { Toaster } from 'sonner'

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

// const beforePositionClass = (darkMode: boolean) => {
//   const bgClass = darkMode ? "before:bg-zinc-800" : "before:bg-white";

//   switch (location.pathname) {
//     case "/":
//     case "/about":
//     case "/contact":
//       return `
//         before:content-['']
        
//       `
//     case "/login":
//       return `
//         before:content-[''] 
//         before:absolute 
//         before:inset-0 
//         before:-z-50 
//         before:md:w-screen before:w-[153%] 
//         before:md:h-[105.5%] before:h-[105.5%]
//         before:md:left-[-24em] before:left-0 before:top-0 
//         before:transition-colors before:duration-500
//         ${bgClass}
//       `;
//     case "/Tasks":
//       return `
//         before:content-[''] 
//         before:absolute 
//         before:inset-0 
//         before:-z-50 
//         before:w-[0%]
//         before:md:w-screen 
//         before:md:h-[105.5%] before:h-[15.5%]
//         before:md:left-[-2em] before:left-0 before:top-[-1em]
//         before:transition-colors before:duration-500
//         ${bgClass}
//       `;
//     case "/ManageTasks":
//       return `
//         before:content-[''] 
//         before:absolute 
//         before:inset-0 
//         before:-z-50 
//         before:md:w-screen before:w-[177.9%] 
//         before:md:h-[105.5%] before:h-[104%]
//         before:left-[-15em] before:top-0
//         before:transition-colors before:duration-500
//         ${bgClass}
//       `;
//     case "/Profile":
//       return `
//         before:content-[''] 
//         before:absolute 
//         before:inset-0 
//         before:-z-50 
//         before:w-screen
//         before:h-[105.5%]
//         before:md:left-[-4rem] ]before:left-[-4rem] before:top-[-2rem]
//         before:transition-colors before:duration-500
//         ${bgClass}
//       `;
    
//     default:
//       return `
//         before:content-[''] 
//         before:absolute 
//         before:inset-0 
//         before:-z-50 
//         before:w-screen 
//         before:h-screen 
//         before:top-0
//         before:transition-colors before:duration-500
//         ${bgClass}
//       `;
//   }
// };

  return (
    // Wrapper div for background & text colors
    //  using Tailwind dark classes
    <>
    <Toaster position="bottom-right" richColors />
    <div
  className={`relative transition-colors max-w-fit duration-500 shadow-none
    before:content-[''] 
  ${darkMode ? "before:bg-zinc-800" : "before:bg-white"}`}
>

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
    </>
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
