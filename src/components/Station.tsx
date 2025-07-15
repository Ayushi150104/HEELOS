import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import React from 'react';

type StationProps = {
  baseDate: Date;
  offset: number;
  direction: 1 | -1;
  onArrowUp: () => void;
  onArrowDown: () => void;
};

// Utility to get just day number
const formatDate = (baseDate: Date, offset: number) => {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + offset);
  return date.getDate();
};

const Station: React.FC<StationProps> = ({
  baseDate,
  offset,
  direction,
  onArrowUp,
  onArrowDown,
}) => {
  return (
    <div
      className="relative mx-auto flex flex-col items-center justify-center gap-8"
      style={{ zIndex: '80' }}
    >
      {/* Top Row: Station */}
      <div className="flex items-center justify-center gap-5">
        {/* Station Column */}
        <div
          className="bg-black/90 rounded-[4em] p-6"
          style={{
            boxShadow: 'rgb(246 246 246 / 50%) 0px 10px 4px 3px',
          }}
        >
          <div className="w-[100px] h-[400px] mx-auto flex flex-col gap-5 justify-center items-center overflow-hidden">
            {/* Top Circle */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`top-${offset}`}
                initial={{ y: direction === 1 ? 50 : -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction === 1 ? -50 : 50, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="h-[40px] w-[40px] bg-white text-black font-bold rounded-full flex items-center justify-center box-shadow-glow"
              >
                {formatDate(baseDate, offset)}
              </motion.div>
            </AnimatePresence>

            {/* Timeline dots (light up dynamically) */}
            {[1, 2, 3].map((idx) => (
              <React.Fragment key={idx}>
                <div
                  className={`h-3 w-3 rounded-full ${
                    direction === 1 ? 'bg-amber-400' : 'bg-white/40'
                  } transition-all duration-200`}
                />
                {idx % 2 === 0 && (
                  <div className="h-4 w-4 rounded-full border-4 border-white" />
                )}
                <div className="h-1 w-1 rounded-full bg-white relative left-[-0.05em]" />
              </React.Fragment>
            ))}

            {/* Bottom Circle */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`bottom-${offset + 1}`}
                initial={{ y: direction === 1 ? 50 : -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction === 1 ? -50 : 50, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="h-[40px] w-[40px] bg-white text-black font-bold rounded-full flex items-center justify-center"
              >
                {formatDate(baseDate, offset + 1)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Arrow Controls */}
        <div className="flex flex-col gap-16">
          <div
            className="bg-white/90 text-black p-3 rounded-full cursor-pointer hover:scale-110 transition-transform"
            style={{ boxShadow: '0px -2px 3px 2px black' }}
            onClick={onArrowUp}
          >
            <FaArrowUp />
          </div>
          <div
            className="bg-white/90 text-black p-3 rounded-full cursor-pointer hover:scale-110 transition-transform"
            style={{ boxShadow: '0px 2px 3px 2px black' }}
            onClick={onArrowDown}
          >
            <FaArrowDown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Station;
