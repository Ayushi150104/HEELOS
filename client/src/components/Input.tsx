import clsx from 'clsx'
import React from 'react'

type InputProp = {
  type: string;
  placeHolder: string;
  className?: string;
  darkMode?: boolean;
}

const Input: React.FC<InputProp> = ({ type, placeHolder, className, darkMode = false }) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeHolder}
        className={clsx(
          'h-auto w-full p-4 rounded-2xl border transition-colors duration-300',
          darkMode
            ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500'
            : 'bg-white text-black border-gray-300 placeholder-gray-500 focus:border-blue-600',
          className
        )}
      />
    </div>
  )
}

export default Input
