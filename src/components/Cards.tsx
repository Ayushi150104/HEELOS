import clsx from 'clsx';
import React from 'react';

type CardProps = {
  icon?: React.ReactNode;
  title?: string;
  className?: string;
  iconContainerClassName?: string;
  titleClassName?: string;
  body?: React.ReactNode;
  bodyClassName?: string;
  darkMode?: boolean;
};

const CardIcon: React.FC<{
  icon: React.ReactNode;
  darkMode: boolean;
  className?: string;
}> = ({ icon, darkMode, className }) => (
  <div
    className={clsx(
      'flex items-center justify-center rounded-full w-12 h-12 text-xl',
      darkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-white',
      className
    )}
  >
    {icon}
  </div>
);

const CardTitle: React.FC<{
  title: string;
  darkMode: boolean;
  className?: string;
}> = ({ title, darkMode, className }) => (
  <div
    className={clsx(
      'font-semibold',
      darkMode ? 'text-white' : 'text-black',
      className
    )}
  >
    {title}
  </div>
);

const CardBody: React.FC<{
  body: React.ReactNode;
  darkMode: boolean;
  className?: string;
}> = ({ body, darkMode, className }) => (
  <div
    className={clsx(
      'text-sm mt-1 w-[13em]',
      darkMode ? 'text-gray-300' : 'text-gray-700',
      className
    )}
  >
    {body}
  </div>
);

const Card: React.FC<CardProps> = ({
  icon,
  title,
  className,
  iconContainerClassName,
  titleClassName,
  body,
  bodyClassName,
  darkMode = false,
}) => {
  return (
    <div
      className={clsx(
        'flex items-center gap-4 rounded-2xl shadow p-4 backdrop-blur',
        darkMode ? ' text-white' : 'bg-white/70 text-black',
        className
      )}
    >
      {icon && (
        <CardIcon icon={icon} darkMode={darkMode} className={iconContainerClassName} />
      )}
      <div className="flex flex-col text-left flex-1">
        {title && (
          <CardTitle title={title} darkMode={darkMode} className={titleClassName} />
        )}
        {body && (
          <CardBody body={body} darkMode={darkMode} className={bodyClassName} />
        )}
      </div>
    </div>
  );
};

export default Card;
