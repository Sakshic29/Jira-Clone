import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import { useTasks } from "../context/TaskContext";
import { STATUSES } from "../data/mockData";

const COLUMNS = [
  {
    id: STATUSES.NOT_STARTED,
    label: "Not Started",
    color: "bg-gray-400",
    lightBg: "bg-gray-50",
    borderColor: "border-gray-200",
    countBg: "bg-gray-100 text-gray-600",
  },
  {
    id: STATUSES.IN_PROGRESS,
    label: "In Progress",
    color: "bg-blue-500",
    lightBg: "bg-blue-50",
    borderColor: "border-blue-100",
    countBg: "bg-blue-100 text-blue-700",
  },
  {
    id: STATUSES.COMPLETED,
    label: "Completed",
    color: "bg-emerald-500",
    lightBg: "bg-emerald-50",
    borderColor: "border-emerald-100",
    countBg: "bg-emerald-100 text-emerald-700",
  },
];

export default function KanbanBoard({ onEditTask }) {
  const { tasks, moveTask, reorderTask, getTasksByStatus } = useTasks();
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  function handleDragStart(event) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // dropped onto a column directly
    const isOverColumn = COLUMNS.some((col) => col.id === overId);

    if (isOverColumn) {
      if (activeTask.status !== overId) {
        moveTask(activeId, overId, null);
      }
      return;
    }

    // dropped onto another task
    const overTask = tasks.find((t) => t.id === overId);
    if (!overTask) return;

    if (activeTask.status === overTask.status) {
      // same column — reorder
      reorderTask(activeId, overId);
    } else {
      // different column — move + insert before overTask
      moveTask(activeId, overTask.status, overId);
    }
  }

  function handleDragCancel() {
    setActiveTask(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* board summary bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Sprint Board</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {tasks.length} tasks across {COLUMNS.length} stages
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
            Not started
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            In progress
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Completed
          </span>
        </div>
      </div>

      {/* columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={getTasksByStatus(col.id)}
            onEditTask={onEditTask}
          />
        ))}
      </div>

      {/* drag overlay — ghost card while dragging */}
      <DragOverlay dropAnimation={{
        duration: 200,
        easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
      }}>
        {activeTask ? (
          <div className="rotate-2 opacity-95 scale-105">
            <TaskCard task={activeTask} onEditTask={() => {}} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}