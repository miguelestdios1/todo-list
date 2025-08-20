import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function TaskForm({ addTask }) {
  const [text, setText] = useState("");
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTask(text.trim());
    setText("");

    await fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2 justify-center">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nueva tarea"
        className="border rounded px-2 py-1"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Agregar
      </button>
    </form>
  );
}

export default TaskForm;