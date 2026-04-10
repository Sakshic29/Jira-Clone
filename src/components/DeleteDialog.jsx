import { motion } from "framer-motion";

function WarningIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M9.26 3.6L1.73 16.5A2 2 0 003.47 19.5h15.06a2 2 0 001.74-3L12.74 3.6a2 2 0 00-3.48 0z"
        stroke="#EF4444"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M11 9v4" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="11" cy="15.5" r="0.75" fill="#EF4444" />
    </svg>
  );
}

export default function DeleteDialog({ taskTitle, onConfirm, onCancel }) {
  return (
    /* backdrop */
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={onCancel}
    >
      {/* dialog box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
      >
        {/* icon + heading */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
            <WarningIcon />
          </div>
          <h2 className="text-base font-semibold text-gray-900">Delete task?</h2>
          <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
            <span className="font-medium text-gray-600">"{taskTitle}"</span>
            {" "}will be permanently removed. This cannot be undone.
          </p>
        </div>

        {/* actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}