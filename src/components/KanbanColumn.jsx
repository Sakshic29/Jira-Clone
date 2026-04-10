import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard";

export default function KanbanColumn({ column, tasks, onEditTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col min-h-[calc(100vh-180px)]">

      {/* column header */}
      <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl mb-3 border ${column.lightBg} ${column.borderColor}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
          <span className="text-sm font-semibold text-gray-700">
            {column.label}
          </span>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${column.countBg}`}>
          {tasks.length}
        </span>
      </div>

      {/* droppable + sortable area */}
      <motion.div
        ref={setNodeRef}
        animate={{
  backgroundColor: isOver ? "rgba(99,102,241,0.06)" : "rgba(0,0,0,0)",
  borderColor: isOver ? "rgba(99,102,241,0.35)" : "rgba(0,0,0,0)",
  borderWidth: isOver ? 2 : 0,
}}
style={{ borderStyle: "dashed" }}
        transition={{ duration: 0.15 }}
        className="flex-1 rounded-xl p-2 transition-colors"
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEditTask={onEditTask}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>

        {/* empty state */}
        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className={`w-10 h-10 rounded-full ${column.lightBg} border ${column.borderColor} flex items-center justify-center mb-3`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 font-medium">No tasks yet</p>
            <p className="text-xs text-gray-300 mt-0.5">Drop a task here</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}