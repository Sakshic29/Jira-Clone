import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../context/TaskContext";
import DeleteDialog from "./DeleteDialog";
import { STATUSES } from "../data/mockData";
import UserAvatar from "./UserAvatar";

const STATUS_CONFIG = {
  [STATUSES.NOT_STARTED]: {
    label: "Not Started",
    className: "bg-gray-100 text-gray-500",
  },
  [STATUSES.IN_PROGRESS]: {
    label: "In Progress",
    className: "bg-blue-50 text-blue-600",
  },
  [STATUSES.COMPLETED]: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-600",
  },
};

function CalendarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M1 5h10" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M8 4l2 2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.8 7.5h6.4L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DragHandle() {
  return (
    <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
      <circle cx="4" cy="3" r="1" fill="currentColor" />
      <circle cx="8" cy="3" r="1" fill="currentColor" />
      <circle cx="4" cy="6" r="1" fill="currentColor" />
      <circle cx="8" cy="6" r="1" fill="currentColor" />
      <circle cx="4" cy="9" r="1" fill="currentColor" />
      <circle cx="8" cy="9" r="1" fill="currentColor" />
    </svg>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TaskCard({ task, onEditTask, isOverlay = false }) {
  const { getUserById, isOverdue, deleteTask } = useTasks();
  const [showDelete, setShowDelete] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const assignee = getUserById(task.assigneeId);
  const overdue = isOverdue(task.deadline);
  const statusCfg = STATUS_CONFIG[task.status];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
  transform: CSS.Transform.toString(transform),
  transition,
};

  function handleEditClick(e) {
    e.stopPropagation();
    onEditTask(task);
  }

  function handleDeleteClick(e) {
    e.stopPropagation();
    setShowDelete(true);
  }

  function handleConfirmDelete() {
    deleteTask(task.id);
    setShowDelete(false);
  }

  return (
    <>
      <motion.div
        ref={isOverlay ? undefined : setNodeRef}
        style={isOverlay ? {} : style}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isDragging ? 0.3 : 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
        whileHover={{}}
        whileTap={{}}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`
          group relative bg-white rounded-xl border border-gray-100
          shadow-sm hover:shadow-md hover:border-indigo-100
          hover:scale-[1.015] active:scale-[0.985]
          transition-all duration-200 overflow-hidden
          ${isDragging ? "ring-2 ring-indigo-300 shadow-lg" : ""}
          ${isOverlay ? "rotate-1 shadow-xl ring-2 ring-indigo-200" : ""}
        `}
      >
        {/* left accent bar — color by status */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
            task.status === STATUSES.COMPLETED
              ? "bg-emerald-400"
              : task.status === STATUSES.IN_PROGRESS
                ? "bg-blue-400"
                : "bg-gray-300"
          }`}
        />

        <div className="pl-4 pr-3 pt-3 pb-3">
          {/* top row — drag handle + action buttons */}
          <div className="flex items-start justify-between mb-2">
            <div
              {...(isOverlay ? {} : { ...attributes, ...listeners })}
              className="text-gray-500 hover:text-gray-600 cursor-grab active:cursor-grabbing mt-0.5 transition-colors"
              onClick={(e) => e.stopPropagation()}
              data-drag-handle=""
              style={{ touchAction: "none", willChange: "transform" }}
            >
              <DragHandle />
            </div>

            {/* action buttons — visible on hover */}
            <AnimatePresence>
              {(isHovered || isOverlay) && !isDragging && (
                <motion.div
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handleEditClick}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Edit task"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete task"
                  >
                    <TrashIcon />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* title */}
          <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-1.5 pr-1 line-clamp-2">
            {task.title}
          </h3>

          {/* description */}
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">
            {task.description}
          </p>

          {/* status badge */}
          <div className="mb-3">
            <span
              className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${statusCfg.className}`}
            >
              {statusCfg.label}
            </span>
          </div>

          {/* bottom row — assignee + deadline */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            {/* assignee */}
            <UserAvatar user={assignee} size="sm" showName={true} />

            {/* deadline */}
            {task.deadline && (
              <div
                className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                  overdue
                    ? "bg-red-50 text-red-500"
                    : task.status === STATUSES.COMPLETED
                      ? "bg-emerald-50 text-emerald-500"
                      : "bg-gray-50 text-gray-400"
                }`}
              >
                <CalendarIcon />
                <span>{formatDate(task.deadline)}</span>
              </div>
            )}
          </div>
        </div>

        {/* overdue warning strip */}
        {overdue && task.status !== STATUSES.COMPLETED && (
          <div className="bg-red-50 border-t border-red-100 px-4 py-1.5">
            <p className="text-xs text-red-400 font-medium">Past deadline</p>
          </div>
        )}
      </motion.div>

      {/* delete confirmation */}
      <AnimatePresence>
        {showDelete && (
          <DeleteDialog
            taskTitle={task.title}
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDelete(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}