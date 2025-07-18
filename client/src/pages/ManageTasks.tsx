import React, { useState } from 'react';
import Tooltip from '../components/toolTip';
import Tabletip from '../components/TableTip';
import { IoShapesOutline } from 'react-icons/io5';
import { FaNoteSticky } from 'react-icons/fa6';
import { GrTasks } from 'react-icons/gr';
import {  schedules } from '../assets/Data';
import FreeDragBoard from '../components/FreeDragBoard';

type BaseItem = {
  key: string;
  position: { x: number; y: number };
  color: string;
};

type Task = BaseItem & {
  type: 'task';
  name: string;
  scheduleName: string;
};

type EditableCard = BaseItem & {
  type: 'editable';
  text: string;
};

type DraggableItem = Task | EditableCard;

type ManageTasksProps = {
  darkMode: boolean;
};

const ManageTasks: React.FC<ManageTasksProps> = ({ darkMode }) => {
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const handleSelect = (
    card: { name: string; color: string },
    scheduleName: string
  ) => {
    setItems((prev) => {
      if (
        prev.some(
          (item) => item.type === 'task' && item.name === card.name
        )
      )
        return prev;

      const newKey = Date.now().toString();
      const newTask: Task = {
        key: newKey,
        type: 'task',
        name: card.name,
        color: card.color,
        scheduleName,
        position: { x: 0, y: 0 },
      };
      return [...prev, newTask];
    });
  };

  const addEditableCard = (text: string, color: string) => {
    setItems((prev) => {
      const newKey = Date.now().toString();
      const newCard: EditableCard = {
        key: newKey,
        type: 'editable',
        text,
        color,
        position: { x: 20 * prev.length, y: 20 * prev.length },
      };
      return [...prev, newCard];
    });
  };

  return (
    <div
      className="flex h-[91.5vh] mt-12 w-[81.5vw] overflow-hidden z-[50] relative"
      style={{
        backgroundColor: darkMode ? '#1f2123' : '#f0f0f0',
        backgroundImage: darkMode
          ? 'radial-gradient(circle, #ffffffb5 0.5px, transparent 1px)'
          : 'radial-gradient(circle, black 0.5px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      {/* Sidebar */}
      <div
        className={`fixed rounded-xl h-max p-5 z-[90] shadow-xl flex flex-col gap-6 w-max left-[23em] top-[2.5em] items-center mt-15 ${
          darkMode
            ? 'bg-gradient-to-br from-[#151515] to-[#1f2123] text-white'
            : 'bg-gradient-to-br from-[#f5f5fb] to-[#e9eafb] text-[#232946]'
        }`}
      >
        <div className="flex flex-col gap-4 text-2xl w-full">
          {[
            {
              Icon: IoShapesOutline,
              text: 'Categories',
              arr: [{ name: 'Purple' }, { name: 'orange' }, { name: 'Red' }, { name: 'Green' }],
            },
            {
              Icon: FaNoteSticky,
              text: 'Notes',
              arr: [{ name: 'Purple' }, { name: 'orange' }, { name: 'Red' }, { name: 'Green' }],
            },
            {
              Icon: GrTasks,
              text: 'Tasks',
              arr: [{ name: 'Purple' }, { name: 'orange' }, { name: 'Red' }, { name: 'Green' }],
            },
          ].map((cards, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl w-full flex justify-center cursor-pointer  ${
                darkMode ? 'bg-white/5' : 'bg-black/5'
              }`}
              onClick={() => {
                if (cards.text === 'Notes') {
                  addEditableCard('Hello', 'bg-purple-600 h-[201px] w-[207px] rounded-[0px 0px 39px/34% 0px]');
                } else if (cards.text === 'Tasks') {
                  addEditableCard('Card 2', 'bg-green-600 h-[201px] w-[207px] rounded-[0px 0px 39px/34% 0px]');
                }
              }}
            >
              <cards.Icon size={30} />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 mt-2">
          {schedules.map((sc, idx) => (
            <div
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                toggleOpen(idx);
              }}
            >
              <Tooltip
                darkMode={darkMode}
                text={sc.scheduleName}
                className={`${
                  darkMode ? 'bg-white/5' : 'bg-black/5'
                } rounded-xl flex justify-center p-2 cursor-pointer`}
              >
                <Tabletip
                  darkMode={darkMode}
                  tasks={sc.tasks}
                  title={sc.scheduleName}
                  open={openIndex === idx}
                  selected={(card) => handleSelect(card, sc.scheduleName)}
                  className={`${
                    darkMode ? 'bg-white/5' : 'bg-black/5'
                  } rounded-xl flex justify-center p-2 cursor-pointer`}
                />
                <div
                  className={`h-6 w-6 rounded-full`}
                  style={
                    {
                      background: sc.color
                    }
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOpen(idx);
                  }}
                />
              </Tooltip>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div
        className="p-6 h-full pl-[7em] overflow-auto fixed -left-2"
        style={{ marginLeft: '23em', minWidth: 'calc(100% - 23em)' }}
      >
        <h1
          className={`${
            darkMode ? 'text-white' : 'text-gray-800'
          } text-2xl font-bold mb-4`}
        >
          Manage Tasks
        </h1>

        <FreeDragBoard
          items={items}
          darkMode={darkMode}
          setItems={setItems}
          className="min-h-[400px] rounded-lg shadow-inner"
          width="100%"
          height="600px"
          initialConnectors={[]}
        >
          {(item) => (
            <Tooltip text={item.type === 'task' ? 'Schedule: ' + item.scheduleName : undefined}>
              <div
                className={`rounded p-4 shadow-md text-white select-none ${
                  item.color
                }`}
                style={{ minHeight: 60, minWidth: 150, userSelect: 'none' }}
              >
                {'name' in item ? item.name : item.text}
              </div>
            </Tooltip>
          )}
        </FreeDragBoard>
      </div>
    </div>
  );
};

export default ManageTasks;
