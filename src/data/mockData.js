export const USERS = [
  { id: "u1", name: "Arjun Mehta",    initials: "AM", color: "#4F46E5" },
  { id: "u2", name: "Priya Sharma",   initials: "PS", color: "#0891B2" },
  { id: "u3", name: "Rahul Verma",    initials: "RV", color: "#059669" },
  { id: "u4", name: "Sneha Patil",    initials: "SP", color: "#D97706" },
  { id: "u5", name: "Karan Desai",    initials: "KD", color: "#DC2626" },
];

export const STATUSES = {
  NOT_STARTED: "not_started",
  IN_PROGRESS:  "in_progress",
  COMPLETED:    "completed",
};

export const INITIAL_TASKS = [
  {
    id: "t1",
    title: "Design system setup",
    description: "Set up Tailwind config, typography scale, color tokens, and reusable component base styles for the entire project.",
    assigneeId: "u1",
    deadline: "2026-04-05",   // past — should show overdue
    status: STATUSES.COMPLETED,
    createdAt: "2026-03-28",
  },
  {
    id: "t2",
    title: "Build authentication flow",
    description: "Implement login, registration, and password reset screens. Include form validation and error handling states.",
    assigneeId: "u2",
    deadline: "2026-04-18",   // future
    status: STATUSES.IN_PROGRESS,
    createdAt: "2026-03-30",
  },
  {
    id: "t3",
    title: "REST API integration",
    description: "Connect frontend to backend endpoints. Set up Axios instance with interceptors for auth token injection and error handling.",
    assigneeId: "u3",
    deadline: "2026-04-20",   // future
    status: STATUSES.IN_PROGRESS,
    createdAt: "2026-04-01",
  },
  {
    id: "t4",
    title: "Dashboard analytics charts",
    description: "Integrate Recharts to display weekly task completion trends, user activity, and burndown data on the main dashboard.",
    assigneeId: "u4",
    deadline: "2026-04-25",   // future
    status: STATUSES.NOT_STARTED,
    createdAt: "2026-04-02",
  },
  {
    id: "t5",
    title: "Write unit tests",
    description: "Add Jest and React Testing Library tests for TaskCard, TaskModal, and KanbanColumn components. Target 80% coverage.",
    assigneeId: "u5",
    deadline: "2026-04-28",   // future
    status: STATUSES.NOT_STARTED,
    createdAt: "2026-04-02",
  },
  {
    id: "t6",
    title: "Mobile responsive layout",
    description: "Audit all screens on 320px–768px viewports. Fix Kanban board overflow and ensure modal is usable on mobile.",
    assigneeId: "u1",
    deadline: "2026-04-08",   // past — should show overdue
    status: STATUSES.IN_PROGRESS,
    createdAt: "2026-04-03",
  },
  {
    id: "t7",
    title: "Notification system",
    description: "Build in-app toast notifications for task creation, updates, assignment changes, and approaching deadlines.",
    assigneeId: "u2",
    deadline: "2026-04-07",   // past — should show overdue
    status: STATUSES.NOT_STARTED,
    createdAt: "2026-04-03",
  },
  {
    id: "t8",
    title: "Drag and drop implementation",
    description: "Integrate dnd-kit for cross-column task movement and within-column reordering. Add visual drag overlay and drop indicators.",
    assigneeId: "u3",
    deadline: "2026-04-06",   // past — completed so no red strip
    status: STATUSES.COMPLETED,
    createdAt: "2026-04-01",
  },
  {
    id: "t9",
    title: "Performance audit",
    description: "Run Lighthouse audit, lazy-load heavy components, memoize expensive renders with useMemo and React.memo where needed.",
    assigneeId: "u4",
    deadline: "2026-05-02",   // future
    status: STATUSES.NOT_STARTED,
    createdAt: "2026-04-04",
  },
  {
    id: "t10",
    title: "Deploy to production",
    description: "Set up Vercel project, configure environment variables, link GitHub repo for CI/CD, and verify production build.",
    assigneeId: "u5",
    deadline: "2026-04-15",   // future
    status: STATUSES.IN_PROGRESS,
    createdAt: "2026-04-05",
  },
];