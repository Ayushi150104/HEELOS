
import React from "react";

interface InfoCardProps {
  icon: React.ReactNode;
  label?: string;
  value?: string;
  darkMode?: boolean;
  colorClass?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value, darkMode, colorClass }) => {
  return (
    <div
      className={`rounded-lg flex items-center justify-between gap-6 px-4 py-3 border transition-all duration-200 transform
        ${darkMode ? "bg-zinc-900 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-800"}
        hover:shadow-lg hover:scale-[1.02]`}
    >
      <div className="hidden">{colorClass}</div>
      <div className="text-2xl text-indigo-500">{icon}</div>
      <div className="flex flex-col items-end">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default InfoCard;
