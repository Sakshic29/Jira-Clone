import { useTasks } from "../context/TaskContext";
import UserAvatar from "./UserAvatar";

export default function Header({ onCreateTask }) {
  const { users, filterUserId, setFilterUserId } = useTasks();

  function handleAvatarClick(userId) {
    setFilterUserId((prev) => (prev === userId ? null : userId));
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-0 flex items-center justify-between h-16 shrink-0">

      {/* left — logo + project name */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" />
            <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.6" />
            <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.6" />
            <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.3" />
          </svg>
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-900 leading-none">
            JMD Solutions
          </span>
          <p className="text-xs text-gray-400 leading-none mt-0.5">Sprint Board</p>
        </div>
        <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1" />
        <span className="hidden sm:block text-sm text-gray-500 font-medium">
          Project Alpha
        </span>
      </div>

      {/* right — avatars + create button */}
      <div className="flex items-center gap-4">

        {/* team avatars */}
        <div className="hidden sm:flex items-center">
          <span className="text-xs text-gray-400 mr-2">Team</span>
          <div className="flex -space-x-2">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleAvatarClick(user.id)}
                title={user.name}
                className={`border-2 border-white rounded-full cursor-pointer transition-all duration-200
                  ${filterUserId === user.id
                    ? "ring-2 ring-indigo-500 ring-offset-1 scale-110 z-10"
                    : "opacity-70 hover:opacity-100 hover:scale-105"
                  }`}
              >
                <UserAvatar user={user} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* create task button */}
        <button
          onClick={onCreateTask}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Create Task</span>
        </button>
      </div>
    </header>
  );
}