import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function TaskList({ tasks, onDelete, onToggle }) {
  const { token } = useContext(AuthContext);

  const handleDelete = (id) => {
    fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(() => onDelete(id));
  };

  const handleToggle = (id) => {
    fetch(`/api/tasks/${id}/toggle`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(() => onToggle(id));
  };

  return (
    <ul className="space-y-2">
      {tasks.map((t) => (
        <li
          key={t._id}
          className="flex justify-between items-center bg-gray-50 border rounded-lg px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={t.completed || false}
              onChange={() => handleToggle(t._id)}
            />
            <span className={t.completed ? "line-through text-gray-400" : ""}>
              {t.text}
            </span>
          </div>
          <button
            onClick={() => handleDelete(t._id)}
            className="text-red-500 hover:text-red-700"
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
