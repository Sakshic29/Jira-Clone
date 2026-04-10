import { createContext, useContext, useReducer, useCallback } from "react";
import { INITIAL_TASKS, USERS } from "../data/mockData";

const TaskContext = createContext(null);

// ─── helpers ────────────────────────────────────────────────────────────────

function generateId() {
  return "t" + Date.now() + Math.random().toString(36).slice(2, 7);
}

// ─── reducer ────────────────────────────────────────────────────────────────

function taskReducer(state, action) {
  switch (action.type) {

    case "ADD_TASK": {
      const newTask = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      return { ...state, tasks: [...state.tasks, newTask] };
    }

    case "UPDATE_TASK": {
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
    }

    case "DELETE_TASK": {
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload.id),
      };
    }

    // move task to a different column (status change via drag-and-drop)
    case "MOVE_TASK": {
      const { taskId, newStatus, overTaskId } = action.payload;

      const tasks = state.tasks.filter((t) => t.id !== taskId);
      const movedTask = state.tasks.find((t) => t.id === taskId);

      if (!movedTask) return state;

      const updated = { ...movedTask, status: newStatus };

      if (overTaskId) {
        // insert before the task we dropped onto
        const overIndex = tasks.findIndex((t) => t.id === overTaskId);
        tasks.splice(overIndex, 0, updated);
      } else {
        // dropped onto an empty column — append
        tasks.push(updated);
      }

      return { ...state, tasks };
    }

    // reorder within the same column
    case "REORDER_TASK": {
      const { taskId, overTaskId } = action.payload;
      if (taskId === overTaskId) return state;

      const from = state.tasks.findIndex((t) => t.id === taskId);
      const to   = state.tasks.findIndex((t) => t.id === overTaskId);
      if (from === -1 || to === -1) return state;

      const tasks = [...state.tasks];
      const [removed] = tasks.splice(from, 1);
      tasks.splice(to, 0, removed);

      return { ...state, tasks };
    }

    default:
      return state;
  }
}

// ─── initial state ───────────────────────────────────────────────────────────

const initialState = {
  tasks: INITIAL_TASKS,
  users: USERS,
};

// ─── provider ────────────────────────────────────────────────────────────────

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const addTask = useCallback((taskData) => {
    dispatch({ type: "ADD_TASK", payload: taskData });
  }, []);

  const updateTask = useCallback((taskData) => {
    dispatch({ type: "UPDATE_TASK", payload: taskData });
  }, []);

  const deleteTask = useCallback((taskId) => {
    dispatch({ type: "DELETE_TASK", payload: { id: taskId } });
  }, []);

  const moveTask = useCallback((taskId, newStatus, overTaskId = null) => {
    dispatch({ type: "MOVE_TASK", payload: { taskId, newStatus, overTaskId } });
  }, []);

  const reorderTask = useCallback((taskId, overTaskId) => {
    dispatch({ type: "REORDER_TASK", payload: { taskId, overTaskId } });
  }, []);

  // derived helpers
  const getTasksByStatus = useCallback(
    (status) => state.tasks.filter((t) => t.status === status),
    [state.tasks]
  );

  const getUserById = useCallback(
    (id) => state.users.find((u) => u.id === id) ?? null,
    [state.users]
  );

  const isOverdue = useCallback((deadline) => {
  if (!deadline) return false;
  const [year, month, day] = deadline.split("-").map(Number);
  const deadlineDate = new Date(year, month - 1, day); // local midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0); // local midnight
  return deadlineDate < today;
}, []);

  const value = {
    tasks:          state.tasks,
    users:          state.users,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTask,
    getTasksByStatus,
    getUserById,
    isOverdue,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// ─── hook ────────────────────────────────────────────────────────────────────

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used inside <TaskProvider>");
  return ctx;
}