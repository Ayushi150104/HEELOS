import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Input from '../components/Input';
import Button from '../components/Button';
import Dialog from '../components/dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../api/axiosInstance';

type AuthComponentProps = {
  darkMode: boolean;
};

const AuthComponent: React.FC<AuthComponentProps> = ({ darkMode }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log(open ? "Dialog open" : "Dialog closed");
  }, [open]);

  const loginUser = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      navigate('/User');
    } catch (err) {
      // handled by interceptor
    }
  };

  const registerUser = async () => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      toast.success("Registration successful!");
      setOpen(false);
      navigate('/User');
    } catch (err) {
      // handled by interceptor
    }
  };

  const validateForm = () => {
    if (showSignUp && !name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (!password.trim()) {
      toast.error("Please enter your password");
      return false;
    }
    return true;
  };

  const handleAuth = () => {
    if (!validateForm()) return;

    if (showSignUp) {
      setOpen(true); // opens dialog before final confirm
    } else {
      loginUser();
    }
  };

  const goToLogin = () => {
    setOpen(false);
    toast.info("Check your info and try again.");
  };

  const goToUser = () => {
    registerUser(); // completes signup on confirm
  };

  const toggleMode = () => {
    setShowSignUp(prev => !prev);
    setOpen(false);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div
      className={clsx(
        "relative z-50 top-[6em] grid grid-cols-1 md:grid-cols-2 gap-5 p-4 w-[90vw] h-[42rem] rounded-2xl mt-10 max-w-6xl mx-auto shadow-2xl transition-all duration-500 overflow-hidden",
        darkMode
          ? "bg-gradient-to-br from-[#1b1b1b] to-[#27292c]"
          : "bg-gradient-to-br from-[#f7f7ff] to-[#e4e6fb]"
      )}
    >
      {/* Left Banner */}
      <div
        className={clsx(
          "hidden md:flex flex-col justify-center items-center px-12 py-10 transition-transform duration-500 relative z-50",
          showSignUp ? "bg-indigo-800 text-white rounded-r-3xl" : "bg-purple-900 text-white rounded-l-3xl translate-x-[36em]"
        )}
      >
        <h2 className="text-4xl font-bold tracking-widest mb-6">
          {showSignUp ? "Welcome to HEELOS" : "Welcome Back"}
        </h2>
        <p className="text-center text-sm leading-6 max-w-md">
          Discover personalized tools for better managing your tasks. Track progress. Connect better with yourself.
        </p>
        <Button
          className="bg-white text-indigo-900 hover:bg-indigo-100 mt-10 px-6 py-3 rounded-lg shadow-md tracking-widest"
          text={showSignUp ? "SIGN IN" : "SIGN UP"}
          onClick={toggleMode}
        />
      </div>

      {/* Right Form */}
      <div
        className={clsx(
          "rounded-2xl p-8 shadow-lg flex flex-col justify-center transition-all duration-500 relative z-40",
          showSignUp ? "-translate-x-[0em]" : "md:-translate-x-[35em]",
          darkMode ? "bg-transparent text-gray-100" : "bg-white/10 text-gray-800"
        )}
      >
        <h2 className="text-3xl font-bold text-center tracking-widest mb-6">
          {showSignUp ? "SIGN UP" : "SIGN IN"}
        </h2>

        <div className="flex flex-col gap-5">
          {showSignUp && (
            <Input
              type="text"
              placeHolder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className={clsx("rounded-md text-black", darkMode ? "bg-gray-800" : "bg-gray-100")}
            />
          )}
          <Input
            type="text"
            placeHolder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={clsx("rounded-md text-black", darkMode ? "bg-gray-800" : "bg-gray-100")}
          />
          <Input
            type="password"
            placeHolder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={clsx("rounded-md text-black", darkMode ? "bg-gray-800 " : "bg-gray-100 ")}
          />

          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white mt-4 px-6 py-3 rounded-lg font-semibold tracking-wider shadow-md"
            text={showSignUp ? "SIGN UP" : "SIGN IN"}
            onClick={handleAuth}
          />
        </div>

        <div className={clsx("text-center text-sm mt-6 md:hidden", darkMode ? "text-gray-300" : "text-gray-700")}>
          {showSignUp ? "Already have an account?" : "Don't have an account?"}
          <span
            className="text-indigo-400 font-semibold cursor-pointer ml-2"
            onClick={toggleMode}
          >
            {showSignUp ? "Sign In" : "Sign Up"}
          </span>
        </div>

        {/* Dialog Confirmation */}
        <Dialog
          isOpen={open}
          setIsOpen={setOpen}
          Header="Confirm Your Info"
          Body="Please ensure all fields are correct. Accurate data helps us personalize your experience."
          className={clsx(
            "w-full max-w-md mx-auto p-6 rounded-lg shadow-lg z-50",
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          )}
          button={[
            {
              text: "Verify",
              onClick: goToLogin,
              className: clsx("px-4 py-2", darkMode ? "bg-gray-300 text-black rounded-md" : "bg-gray-200 text-black rounded-md"),
            },
            {
              text: "Go On",
              onClick: goToUser,
              className: "bg-red-500 text-white px-4 py-2 rounded-md",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default AuthComponent;
