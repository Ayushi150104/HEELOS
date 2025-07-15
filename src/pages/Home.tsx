import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowCircleUp, FaArrowDown, FaArrowUp, FaCheckCircle, FaClock, FaExclamationCircle, FaInstagram, FaMinusCircle, FaPinterest, FaTwitter } from 'react-icons/fa';
import Station from '../components/Station';
import { tasks, tasksDemo } from '../assets/Data';
import TaskCard from '../components/taskCard';
import { motion } from 'framer-motion';

type HomeProps = {
  darkMode: boolean;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Home: React.FC<HomeProps> = ({ darkMode }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'hard':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-400';
      case 'easy':
        return 'bg-green-400';
      default:
        return 'bg-gray-400';
    }
  };
  const baseDate = new Date();
  const [offset, setOffset] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const selectedDate = new Date(baseDate);
  selectedDate.setDate(baseDate.getDate() + offset);

  const formatDateKey = (date: Date) => date.toISOString().split('T')[0]; // yyyy-mm-dd
  const dateKey = formatDateKey(selectedDate);

  // Filter tasks for the selected date

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`The dialog is now ${open ? "open" : "closed"}.`);
  }, [open]);

  const goToLogIn = () => {
    navigate('/login');
    setOpen(false);
  };

  return (
    <div
      className={`min-h-screen text-white font-sans relative px-6 md:px-10 py-6 top-11 ${
        darkMode ? "text-white" : "text-black"
      }`}
      style={{
        background: darkMode
          ? "#828BC1"
          : "radial-gradient(circle at center, #ffffff, #93c5fd, #3b82f6)"
      }}
    >
      {/* Navbar */}

      {/* Main Hero Section */}
      <main className="grid md:grid-cols-3 gap-10 mt-12 items-center">
        {/* Text Section */}
        <div className="max-w-md space-y-4">
          <h1 className="text-4xl font-bold">Organize your life with TaskFlow</h1>
          <p className="text-white/70">
            TaskFlow helps individuals and teams stay on top of tasks with smart features and beautiful UI.
          </p>
          <p className="text-2xl font-semibold">Boost your productivity today.</p>
          <button className="bg-white text-black px-6 py-2 rounded-full font-medium relative z-[70]" onClick={goToLogIn}>
            Try Free
          </button>
        </div>

        {/* Central station */}
        <Station
          baseDate={baseDate}
          offset={offset}
          direction={direction}
          onArrowUp={() => {
            setDirection(-1);
            setOffset((prev) => prev - 1);
          }}
          onArrowDown={() => {
            setDirection(1);
            setOffset((prev) => prev + 1);
          }}
        />

        {/* Feature Cards */}
        <div className="flex flex-col gap-4">
          {[
            {
              title: "Smart Scheduling",
              description: "Automate daily plans and stay aligned with AI-powered insights.",
              icon: "📅"
            },
            {
              title: "Collaboration Tools",
              description: "Assign, tag, comment, and manage shared tasks in real-time.",
              icon: "🤝"
            },
            {
              title: "Dark Mode Ready",
              description: "A soothing interface designed for night owls and early risers alike.",
              icon: "🌙"
            },
          ].map((feature, idx) => (
            <div key={idx} className="flex items-start gap-4 bg-white/20 p-4 rounded-xl">
              <div className="text-2xl">{feature.icon}</div>
              <div>
                <p className="text-md font-semibold">{feature.title}</p>
                <p className="text-sm text-white/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Animated Task List */}
<div className="mt-8 text-center w-full">
  {offset > 0 && tasks.length > 0 ? (
    <motion.ul
      className="text-white/60 space-y-1 text-left flex flex-wrap w-[100%]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {tasksDemo.slice(0, offset).map((card, idx) => (
        <motion.li
          key={idx}
          variants={itemVariants}
          className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4"
        >
          <div
                      key={idx}
                      className={`w-full p-5 rounded-lg shadow-md border ${
                        darkMode
                          ? 'bg-zinc-800 border-gray-700 text-white'
                          : 'bg-white border-gray-200 text-black'
                      } transition-transform hover:scale-[1.02]`}
                    >
                      {/* Header */}
                      <div className="flex items-center gap-5 mb-2">
                        <div
                          className={`h-4 w-4 rounded-full ${getDifficultyColor(
                            card.difficulty
                          )}`}
                        />
                        <h3 className="font-semibold text-lg text-left">{card.name}</h3>
                      </div>
          
                      {/* Description */}
                      <p
                        className={`text-sm text-left mb-3 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        } line-clamp-2`}
                      >
                        {card.description}
                      </p>
          
                      {/* Deadline / Priority / Status */}
          <div
            className={`text-sm mb-4 flex items-center gap-7 border-y py-4 ${
              darkMode ? 'text-gray-300 border-gray-700/40' : 'text-gray-600 border-gray-200'
            }`}
          >
            {/* Deadline */}
            <div className="flex items-center gap-2">
              <span className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>Deadline:</span>
              <span>{new Date(card.endBy).toLocaleDateString()}</span>
            </div>
          
            {/* Priority */}
            <div className="flex items-center gap-2">
              {card.priority === 'high' && (
                <span className="text-red-500 flex items-center gap-1">
                  <FaArrowCircleUp className="text-base" />
                </span>
              )}
              {card.priority === 'medium' && (
                <span className="text-yellow-500 flex items-center gap-1">
                  <FaMinusCircle className="text-base" />
                </span>
              )}
              {card.priority === 'low' && (
                <span className="text-green-500 flex items-center gap-1">
                  <FaArrowDown className="text-base" />
                </span>
              )}
            </div>
          
            {/* Status */}
            <div className="flex items-center gap-2">
              {card.status === 'completed' && (
                <span className="text-green-500 flex items-center gap-1">
                  <FaCheckCircle className="text-base" />
                </span>
              )}
              {card.status === 'overdue' && (
                <span className="text-red-500 flex items-center gap-1">
                  <FaExclamationCircle className="text-base" />
                </span>
              )}
              {card.status === 'pending' && (
                <span className="text-yellow-500 flex items-center gap-1">
                  <FaClock className="text-base" />
                </span>
              )}
            </div>
          </div>
          
          
          
                      {/* Subtasks if present */}
                      {'subtasks' in card &&
                        Array.isArray(card.subtasks) &&
                        card.subtasks.length > 0 && (
                          <div className="mt-4">
                            <div className="flex flex-col gap-3">
                              {card.subtasks.map((st, idx) => (
                                <div
                                  key={idx}
                                  className={`p-2 rounded-md ${
                                    darkMode ? 'bg-zinc-700' : 'bg-gray-100'
                                  }`}
                                >
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium">{st.name}</span>
                                    <span className="text-xs text-gray-400">
                                      {st.completion}%
                                    </span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-300 rounded">
                                    <div
                                      className="h-full rounded"
                                      style={{
                                        width: `${st.completion}%`,
                                        backgroundColor: st.color,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
        </motion.li>
      ))}
    </motion.ul>
  ) : offset > 0 ? (
    <p className="text-white/50 text-sm">No tasks scheduled yet.</p>
  ) : (
    <p className="text-white/50 text-sm">No tasks scheduled yet.</p>
  )}
</div>


      {/* Footer Socials */}
      <footer className="absolute bottom-6 left-6 flex items-center gap-4 text-sm">
        <span>Follow Us</span>
        <FaTwitter />
        <FaInstagram />
        <FaPinterest />
      </footer>

      {/* Footer CTA */}
      <div className="absolute bottom-6 right-6 text-sm text-white/80 text-right">
        <p className="font-semibold">Built for productivity.</p>
        <p>TaskFlow gives your workflow wings 🚀</p>
        <a href="#" className="underline text-white">Explore Features →</a>
      </div>
    </div>
  );
};

export default Home;
