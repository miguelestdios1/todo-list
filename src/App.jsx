import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import AuthForm from "./components/AuthForm";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const API_URL = "http://localhost:4000/tasks";

function App() {
  const { token, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  // Cargar tareas del backend
  useEffect(() => {
    if (!token) return;
    const fetchTasks = async () => {
      const res = await fetch(API_URL, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) {
        setError(data.error || "Error al cargar tareas");
        setTasks([]);
        return;
      }
      setTasks(data);
      setError("");
    };
    fetchTasks();
  }, [token]);

  // Añadir tarea
  const addTask = async (text) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ text }),
    });
    const newTask = await res.json();
    if (res.ok && newTask && newTask._id) {
      setTasks([...tasks, newTask]);
      setError("");
    } else {
      setError(newTask.error || "Error al crear tarea");
    }
  };

  // Eliminar tarea
  const deleteTask = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
    if (res.ok) {
      setTasks(tasks.filter((t) => t._id !== id));
      setError("");
    } else {
      const data = await res.json();
      setError(data.error || "Error al eliminar tarea");
    }
  };

  // Marcar tarea como completada
  const toggleTask = async (id) => {
    const task = tasks.find((t) => t._id === id);
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ completed: !task.completed }),
    });
    const updatedTask = await res.json();
    if (res.ok && updatedTask && updatedTask._id) {
      setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
      setError("");
    } else {
      setError(updatedTask.error || "Error al actualizar tarea");
    }
  };

  // Filtrar tareas solo si tasks es un array
  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((t) => {
        if (filter === "completed") return t.completed;
        if (filter === "pending") return !t.completed;
        return true;
      })
    : [];

  if (!token) {
    return <AuthForm />;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-white shadow rounded-lg">
      <button onClick={logout}>Cerrar sesión</button>
      <h1 className="text-2xl font-bold mb-4 text-center">To-Do List</h1>
      <TaskForm addTask={addTask} />

      {/* Filtros */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-lg ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded-lg ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Completadas
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1 rounded-lg ${filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Pendientes
        </button>
      </div>

      {Array.isArray(tasks) ? (
        <TaskList tasks={filteredTasks} onDelete={deleteTask} onToggle={toggleTask} />
      ) : (
        <div>No hay tareas o hubo un error.</div>
      )}

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default App;
