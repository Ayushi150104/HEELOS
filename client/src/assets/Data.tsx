import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaLocationArrow } from "react-icons/fa";
import { GiPerpendicularRings } from "react-icons/gi";
import { SiJetpackcompose } from "react-icons/si";




const tasksDemo = [
  {
    id: 1,
    name: "Finish React project",
    difficulty: "hard",
    endBy: "2025-07-15T23:59:00Z",
    priority: "high",
    status: "pending",
    tags: ["react", "frontend", "deadline"],
    description: "Complete the final UI and integrate API for React dashboard",
    createdAt: "2025-07-01T10:00:00Z",
    reminder: "2025-07-14T18:00:00Z",subtasks: [
      {
        name: "Tasks UI",
        des: "Complete frontend bug fixes",
        color: "#FF5733",
        date: "2024-07-07",
        completion: 50,
      },
      {
        name: "Website",
        des: "API integration task",
        color: "#3375FF",
        date: "2024-07-08",
        completion: 75,
      },
    ],
  },
  {
    id: 2,
    name: "Write blog post on JavaScript",
    difficulty: "medium",
    endBy: "2025-07-10T17:00:00Z",
    priority: "medium",
    status: "completed",
    tags: ["javascript", "writing"],
    description: "Research and write a 1500-word article about ES2025 features",
    createdAt: "2025-07-02T08:30:00Z",subtasks: [
      {
        name: "Tasks UI",
        des: "Complete frontend bug fixes",
        color: "#FF5733",
        date: "2024-07-07",
        completion: 50,
      },
      {
        name: "Website",
        des: "API integration task",
        color: "#3375FF",
        date: "2024-07-08",
        completion: 75,
      },
    ],
  },
  {
    id: 3,
    name: "Update resume",
    difficulty: "easy",
    endBy: "2025-07-05T12:00:00Z",
    priority: "low",
    status: "pending",
    tags: ["career", "personal"],
    description: "Add recent projects and skills to resume",
    createdAt: "2025-07-01T12:00:00Z",subtasks: [
      {
        name: "Tasks UI",
        des: "Complete frontend bug fixes",
        color: "#FF5733",
        date: "2024-07-07",
        completion: 50,
      },
      {
        name: "Website",
        des: "API integration task",
        color: "#3375FF",
        date: "2024-07-08",
        completion: 75,
      },
    ],
  },
  {
    id: 4,
    name: "Prepare for interview",
    difficulty: "hard",
    endBy: "2025-07-20T09:00:00Z",
    priority: "high",
    status: "pending",
    tags: ["interview", "preparation"],
    description: "Practice algorithms and system design questions",
    createdAt: "2025-07-03T15:00:00Z",
    reminder: "2025-07-19T20:00:00Z",subtasks: [
      {
        name: "Tasks UI",
        des: "Complete frontend bug fixes",
        color: "#FF5733",
        date: "2024-07-07",
        completion: 50,
      },
      {
        name: "Website",
        des: "API integration task",
        color: "#3375FF",
        date: "2024-07-08",
        completion: 75,
      },
    ],
  },
  {
    id: 5,
    name: "Team meeting",
    difficulty: "easy",
    endBy: "2025-07-08T10:00:00Z",
    priority: "medium",
    status: "completed",
    tags: ["work", "meeting"],
    description: "Discuss project milestones and blockers",
    createdAt: "2025-07-04T09:00:00Z",subtasks: [
      {
        name: "Tasks UI",
        des: "Complete frontend bug fixes",
        color: "#FF5733",
        date: "2024-07-07",
        completion: 50,
      },
      {
        name: "Website",
        des: "API integration task",
        color: "#3375FF",
        date: "2024-07-08",
        completion: 75,
      },
    ],
  },
  {
    id: 6,
    name: "Design new logo",
    difficulty: "medium",
    endBy: "2025-07-18T23:59:00Z",
    priority: "medium",
    status: "pending",
    tags: ["design", "branding"],
    description: "Create multiple logo drafts for the new product",
    createdAt: "2025-07-06T11:00:00Z",subtasks: [
      {
        name: "Tasks UI",
        des: "Complete frontend bug fixes",
        color: "#FF5733",
        date: "2024-07-07",
        completion: 50,
      },
      {
        name: "Website",
        des: "API integration task",
        color: "#3375FF",
        date: "2024-07-08",
        completion: 75,
      },
    ],
  },
  {
    id: 7,
    name: "Fix login bug",
    difficulty: "hard",
    endBy: "2025-07-07T18:00:00Z",
    priority: "high",
    status: "overdue",
    tags: ["bug", "frontend"],
    description: "Resolve issue causing login failure on mobile devices",
    createdAt: "2025-06-30T14:00:00Z",subtasks: [
      {
        name: "Tasks UI",
        des: "Complete frontend bug fixes",
        color: "#FF5733",
        date: "2024-07-07",
        completion: 50,
      },
      {
        name: "Website",
        des: "API integration task",
        color: "#3375FF",
        date: "2024-07-08",
        completion: 75,
      },
    ],
  },
];

const cardData = [
  {
    title: "Important Task",
    des: "High-priority subtasks to handle",
    icon: <SiJetpackcompose />,
    color: "bg-indigo-800",
    className: "py-10 px-8",
    subtasks: [
      {
        name: "Tasks UI",
        des: "Complete frontend bug fixes",
        color: "#FF5733",
        date: "2024-07-07",
        completion: 50,
      },
      {
        name: "Website",
        des: "API integration task",
        color: "#3375FF",
        date: "2024-07-08",
        completion: 75,
      },
    ],
  },
  {
    title: "Important Task",
    des: "High-priority subtasks to handle",
    icon: <SiJetpackcompose />,
    color: "bg-indigo-800",
    className: "py-10 px-8",
    subtasks: [
      {
        name: "Tasks UI",
        des: "Complete frontend bug fixes",
        color: "#FF5733",
        date: "2024-07-07",
        completion: 50,
      },
      {
        name: "Website",
        des: "API integration task",
        color: "#3375FF",
        date: "2024-07-08",
        completion: 75,
      },
    ],
  },
  {
    title: "Important Task",
    des: "High-priority subtasks to handle",
    icon: <SiJetpackcompose />,
    color: "bg-indigo-800",
    className: "py-10 px-8",
    subtasks: [
      {
        name: "Tasks UI",
        des: "Complete frontend bug fixes",
        color: "#FF5733",
        date: "2024-07-07",
        completion: 50,
      },
      {
        name: "Website",
        des: "API integration task",
        color: "#3375FF",
        date: "2024-07-08",
        completion: 75,
      },
    ],
  },
  {
    title: "Important Task",
    des: "High-priority subtasks to handle",
    icon: <SiJetpackcompose />,
    color: "bg-indigo-800",
    className: "py-10 px-8",
    subtasks: [
      {
        name: "Tasks UI",
        des: "Complete frontend bug fixes",
        color: "#FF5733",
        date: "2024-07-07",
        completion: 50,
      },
      {
        name: "Website",
        des: "API integration task",
        color: "#3375FF",
        date: "2024-07-08",
        completion: 75,
      },
    ],
  },
  {
    title: "Important Task",
    des: "High-priority subtasks to handle",
    icon: <SiJetpackcompose />,
    color: "bg-indigo-800",
    className: "py-10 px-8",
    subtasks: [
      {
        name: "Tasks UI",
        des: "Complete frontend bug fixes",
        color: "#FF5733",
        date: "2024-07-07",
        completion: 50,
      },
      {
        name: "Website",
        des: "API integration task",
        color: "#3375FF",
        date: "2024-07-08",
        completion: 75,
      },
    ],
  },
];

const scheduleData = [
  {
    title: "Important Task",
    des: "High-priority subtasks to handle",
    icon: <SiJetpackcompose />,
    color: "bg-purple-700",
    className: "py-4 px-5 scale-95",
    subtasks: [
      {
        name: "Tasks UI",
        des: "Complete frontend bug fixes",
        color: "#FF5733",
        date: "2024-07-07",
        completion: 50,
      },
      {
        name: "Website",
        des: "API integration task",
        color: "#3375FF",
        date: "2024-07-08",
        completion: 75,
      },
    ],
  },
];

const cardsData = [
  {
    text: "Total Tasks",
    body: "Total number of tasks today",
    icon: <SiJetpackcompose />,
    className: "min-w-[220px] max-w-xs rounded-xl p-5 backdrop-blur shadow-lg transition-colors duration-300",
    classButton: "text-[1.5em] rounded-full bg-blue-500 text-white p-3 flex items-center justify-center transition-colors duration-300 hover:bg-blue-600",
  },
  {
    text: "Pending Tasks",
    body: "Total number of pending tasks today",
    icon: <FaLocationArrow />,
    className: "min-w-[220px] max-w-xs rounded-xl p-5 backdrop-blur shadow-lg transition-colors duration-300",
    classButton: "text-[1.2em] rounded-full bg-red-500 text-white p-3 flex items-center justify-center transition-colors duration-300 hover:bg-red-600",
  },
  {
    text: "Due Tasks",
    body: "Total number of due tasks today",
    icon: <AiOutlineCloudUpload />,
    className: "min-w-[220px] max-w-xs rounded-xl p-5 backdrop-blur shadow-lg transition-colors duration-300",
    classButton: "text-[1.7em] rounded-full bg-yellow-400 text-black p-3 flex items-center justify-center transition-colors duration-300 hover:bg-yellow-500",
  },
  {
    text: "Completed Tasks",
    body: "Total number of completed tasks today",
    icon: <GiPerpendicularRings />,
    className: "min-w-[220px] max-w-xs rounded-xl p-5 backdrop-blur shadow-lg transition-colors duration-300",
    classButton: "text-[1.7em] font-semibold rounded-full bg-green-600 text-white p-3 flex items-center justify-center transition-colors duration-300 hover:bg-green-700",
  },
];



const schedules = [
  {
    scheduleName: "Frontend Sprint",
    createdBy: "Ayushi",
    color: "#6C5CE7",
    type: "t",
    tasks: [
      {
        id: 1,
        name: "Finish React project",
        color: "#A29BFE",
        difficulty: "hard",
        endBy: "2025-07-15T23:59:00Z",
        priority: "high",
        status: "pending",
        tags: ["react", "frontend", "deadline"],
        description: "Complete the final UI and integrate API for React dashboard",
        createdAt: "2025-07-01T10:00:00Z",
        activityLog: [
          { type: "created", time: "2025-06-30T14:00:00Z" },
          { type: "code", time: "2025-06-30T16:30:00Z" },
          { type: "completed", time: "2025-07-07T19:00:00Z" },
        ],
        subtasks: [
          {
            name: "Tasks UI",
            des: "Complete frontend bug fixes",
            color: "#FF5733",
            date: "2025-07-07",
            completion: 50,
          },
          {
            name: "Website",
            des: "API integration task",
            color: "#3375FF",
            date: "2025-07-08",
            completion: 75,
          },
        ],
      },
      {
        id: 2,
        name: "Fix login bug",
        color: "#FD79A8",
        difficulty: "hard",
        endBy: "2025-07-07T18:00:00Z",
        priority: "high",
        status: "overdue",
        tags: ["bug", "frontend"],
        description: "Resolve issue causing login failure on mobile devices",
        createdAt: "2025-06-30T14:00:00Z",
        activityLog: [
          { type: "created", time: "2025-06-30T14:00:00Z" },
          { type: "bug", time: "2025-06-30T16:30:00Z" },
          { type: "code", time: "2025-06-30T16:30:00Z" },
          { type: "completed", time: "2025-07-07T19:00:00Z" },

        ],
        subtasks: [
          {
            name: "Bug Fixing",
            des: "Fix async login issue",
            color: "#FF3333",
            date: "2025-07-06",
            completion: 100,
          },
          {
            name: "Testing",
            des: "Test login flow on different devices",
            color: "#33FFAA",
            date: "2025-07-07",
            completion: 80,
          },
        ],
      },
    ],
  },
  {
    scheduleName: "Content Creation",
    createdBy: "Ayushi",
    color: "#00CEC9",
    type: "t",
    tasks: [
      {
        id: 3,
        name: "Write blog post on JavaScript",
        color: "#55EFC4",
        difficulty: "medium",
        endBy: "2025-07-10T17:00:00Z",
        priority: "medium",
        status: "completed",
        tags: ["javascript", "writing"],
        description: "Research and write a 1500-word article about ES2025 features",
        createdAt: "2025-07-02T08:30:00Z",
        activityLog: [
          { type: "created", time: "2025-07-02T08:30:00Z" },
          { type: "completed", time: "2025-07-09T21:00:00Z" }
        ],
        subtasks: [
          {
            name: "Draft",
            des: "Outline major ES2025 features",
            color: "#FFC312",
            date: "2025-07-05",
            completion: 100,
          },
          {
            name: "Editing",
            des: "Polish and optimize for SEO",
            color: "#C4E538",
            date: "2025-07-06",
            completion: 100,
          },
        ],
      },
      {
        id: 4,
        name: "Update resume",
        color: "#81ECEC",
        difficulty: "easy",
        endBy: "2025-07-05T12:00:00Z",
        priority: "low",
        status: "pending",
        tags: ["career", "personal"],
        description: "Add recent projects and skills to resume",
        createdAt: "2025-07-01T12:00:00Z",
        activityLog: [
          { type: "created", time: "2025-07-01T12:00:00Z" }
        ],
        subtasks: [
          {
            name: "Projects",
            des: "Include React & design system tasks",
            color: "#00A8FF",
            date: "2025-07-04",
            completion: 90,
          },
          {
            name: "Design",
            des: "Apply clean layout and export to PDF",
            color: "#F79F1F",
            date: "2025-07-05",
            completion: 70,
          },
        ],
      },
    ],
  },
  {
    scheduleName: "Interview Prep",
    createdBy: "Ayushi",
    color: "#E84393",
    type: "t",
    tasks: [
      {
        id: 5,
        name: "Prepare for interview",
        color: "#F8A5C2",
        difficulty: "hard",
        endBy: "2025-07-20T09:00:00Z",
        priority: "high",
        status: "pending",
        tags: ["interview", "preparation"],
        description: "Practice algorithms and system design questions",
        createdAt: "2025-07-03T15:00:00Z",
        activityLog: [
          { type: "created", time: "2025-07-03T15:00:00Z" },
          { type: "updated", time: "2025-07-10T18:00:00Z" }
        ],
        subtasks: [
          {
            name: "DSA",
            des: "Solve 10 leetcode hard problems",
            color: "#8E44AD",
            date: "2025-07-10",
            completion: 40,
          },
          {
            name: "System Design",
            des: "Review scalable architectures",
            color: "#0097E6",
            date: "2025-07-15",
            completion: 30,
          },
        ],
      },
    ],
  },
  {
    scheduleName: "Team & Branding",
    createdBy: "Ayushi",
    color: "#FDCB6E",
    type: "t",
    tasks: [
      {
        id: 6,
        name: "Team meeting",
        color: "#FAB1A0",
        difficulty: "easy",
        endBy: "2025-07-08T10:00:00Z",
        priority: "medium",
        status: "completed",
        tags: ["work", "meeting"],
        description: "Discuss project milestones and blockers",
        createdAt: "2025-07-04T09:00:00Z",
        activityLog: [
          { type: "created", time: "2025-07-04T09:00:00Z" },
          { type: "completed", time: "2025-07-08T10:30:00Z" }
        ],
        subtasks: [
          {
            name: "Agenda",
            des: "Prepare points for discussion",
            color: "#E17055",
            date: "2025-07-07",
            completion: 100,
          },
        ],
      },
      {
        id: 7,
        name: "Design new logo",
        color: "#FFEAA7",
        difficulty: "medium",
        endBy: "2025-07-18T23:59:00Z",
        priority: "medium",
        status: "pending",
        tags: ["design", "branding"],
        description: "Create multiple logo drafts for the new product",
        createdAt: "2025-07-06T11:00:00Z",
        activityLog: [
          { type: "created", time: "2025-07-06T11:00:00Z" }
        ],
        subtasks: [
          {
            name: "Sketching",
            des: "Brainstorm visual concepts",
            color: "#D980FA",
            date: "2025-07-11",
            completion: 60,
          },
          {
            name: "Review",
            des: "Get feedback from team",
            color: "#00B894",
            date: "2025-07-13",
            completion: 20,
          },
        ],
      },
    ],
  },
];




export { cardData, scheduleData, cardsData, tasksDemo, schedules } 