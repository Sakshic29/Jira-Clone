import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../context/TaskContext";
import { STATUSES } from "../data/mockData";
import UserAvatar from "./UserAvatar";

const STATUS_OPTIONS = [
  { value: STATUSES.NOT_STARTED, label: "Not Started" },
  { value: STATUSES.IN_PROGRESS, label: "In Progress" },
  { value: STATUSES.COMPLETED,   label: "Completed"   },
];

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

const inputClass = `
  w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800
  placeholder-gray-300 bg-white
  focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
  transition-all duration-150
`;

export default function TaskModal({ task, onClose }) {
  const { users, addTask, updateTask } = useTasks();
  const isEditing = Boolean(task);

  const [form, setForm] = useState({
    title:      "",
    description:"",
    assigneeId: "",
    deadline:   "",
    status:     STATUSES.NOT_STARTED,
  });

  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  // populate form when editing
  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title       ?? "",
        description: task.description ?? "",
        assigneeId:  task.assigneeId  ?? "",
        deadline:    task.deadline    ?? "",
        status:      task.status      ?? STATUSES.NOT_STARTED,
      });
    }
  }, [task]);

  function validate(values) {
    const e = {};
    if (!values.title.trim())      e.title      = "Title is required.";
    if (values.title.length > 80)  e.title      = "Title must be under 80 characters.";
    if (!values.assigneeId)        e.assigneeId = "Please assign this task to someone.";
    if (!values.deadline)          e.deadline   = "Deadline is required.";
    return e;
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const errs = validate({ ...form, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: errs[field] }));
    }
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(form);
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const allTouched = { title: true, assigneeId: true, deadline: true };
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (isEditing) {
      updateTask({ ...task, ...form });
    } else {
      addTask(form);
    }
    onClose();
  }

  // close on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const selectedAssignee = users.find((u) => u.id === form.assigneeId);

  return (
    <AnimatePresence>
      {/* backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-40 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        onClick={onClose}
      >
        {/* modal panel */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{   opacity: 0, y: 16, scale: 0.97  }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {isEditing ? "Edit Task" : "Create New Task"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {isEditing
                  ? "Update the details below"
                  : "Fill in the details to add a new task"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          {/* form body — scrollable */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
          >
            {/* title */}
            <div>
              <FieldLabel required>Title</FieldLabel>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                onBlur={() => handleBlur("title")}
                placeholder="e.g. Build login page"
                className={`${inputClass} ${errors.title ? "border-red-300 ring-1 ring-red-200" : ""}`}
              />
              {errors.title && (
                <p className="text-xs text-red-400 mt-1">{errors.title}</p>
              )}
              <p className="text-xs text-gray-300 mt-1 text-right">
                {form.title.length}/80
              </p>
            </div>

            {/* description */}
            <div>
              <FieldLabel>Description</FieldLabel>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Add more context about this task..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* assignee */}
            <div>
              <FieldLabel required>Assignee</FieldLabel>

              {/* custom avatar selector */}
              <div className="flex flex-wrap gap-2">
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleChange("assigneeId", user.id)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-xl border text-sm
                      transition-all duration-150
                      ${form.assigneeId === user.id
                        ? "border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: user.color, fontSize: "9px", fontWeight: 600 }}
                    >
                      {user.initials}
                    </div>
                    <span className="text-xs font-medium">
                      {user.name.split(" ")[0]}
                    </span>
                    {form.assigneeId === user.id && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {errors.assigneeId && (
                <p className="text-xs text-red-400 mt-1.5">{errors.assigneeId}</p>
              )}
            </div>

            {/* deadline + status side by side */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Deadline</FieldLabel>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                  onBlur={() => handleBlur("deadline")}
                  className={`${inputClass} ${errors.deadline ? "border-red-300 ring-1 ring-red-200" : ""}`}
                />
                {errors.deadline && (
                  <p className="text-xs text-red-400 mt-1">{errors.deadline}</p>
                )}
              </div>

              <div>
                <FieldLabel>Status</FieldLabel>
                <select
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className={inputClass}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* summary preview when editing */}
            {isEditing && selectedAssignee && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1 font-medium">Assigned to</p>
                <UserAvatar user={selectedAssignee} size="sm" showName={true} />
              </div>
            )}
          </form>

          {/* modal footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white active:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              {isEditing ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}