import clsx from 'clsx';
import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { HiTable, HiTrash } from 'react-icons/hi';
import { toast } from 'sonner';
import api from '../../api/axiosInstance';

type ImpCardsProps = {
  title: string;
  scheduleId: string;
  className: string;
  des: string;
  icon: React.ReactNode;
  darkMode: boolean;
  padding?: string | "py-10 px-8 p-4";
  color: string;
  subtasks: {
    name: string,
    des: string;
    color: string;
    date: string;
    completion: number;
  }[];
  onClick?: () => void;  // Added onClick prop
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
};

const ImpCards: React.FC<ImpCardsProps> = ({
  title,
  des,
  icon,
  subtasks,
  scheduleId,
  color,
  padding,
  className,
  onClick,
  
}) => {
  const deleteSchedule = async() => {
    // Implement delete functionality here
    try {
      const res = await api.delete(
        `/tasks/my/${scheduleId}/delete`,
      )

      const updated  = res.data;
      console.log(updated)
      
      toast.success("Deleted schedule successfully please refresh teh page to see updates this problem will be solved shortly ");
    } catch (error) {
      toast.error("Error deleting schedule:");
    }
  };
  return (
    <div
      onClick={onClick} // attach onClick handler here
      className={clsx(
        "grid grid-rows-3 gap-4 rounded-lg text-white cursor-pointer", // added cursor-pointer
        padding,
        className
      )}
      style={{ background: color}}
    >
      {/* Title */}
      <div className="order-1 text-left font-extrabold text-2xl w-[90%] flex-wrap">{title}</div>

      {/* Description */}
      <div className="order-2 text-left">{des}</div>

      {/* Icon and Subtasks */}
      <div className="order-3 flex items-center gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap w-[8em]">
          {subtasks.map((task, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center w-8 h-8 rounded-full text-black text-sm bg-white"
              title={task.name}
            >
              {getInitials(task.name)}
            </div>
          ))}
        </div>
        <div className="text-2xl h-auto w-auto p-3 bg-black/20 rounded-lg ml-auto">{icon}</div>
        <div onClick={deleteSchedule}><HiTrash /></div>
      </div>
    </div>
  );
};

export default ImpCards;
