import { useState } from "react";
import Header from "./components/Header";
import KanbanBoard from "./components/KanbanBoard";
import TaskModal from "./components/TaskModal";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="cursor-grab-preload" />
      <Header onCreateTask={openCreateModal} />
      <main className="flex-1 px-6 py-6">
        <KanbanBoard onEditTask={openEditModal} />
      </main>
      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={closeModal}
        />
      )}
    </div>
  );
}