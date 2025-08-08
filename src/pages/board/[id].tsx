import { GetServerSideProps } from "next";
import { getUserFromRequest } from "@/lib/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";
import { Board } from "@/types/board";
import { Task } from "@/types/task";

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const user = getUserFromRequest(req);
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  var boardId = params?.id as string;

  var board: Board | null = {
    id: boardId,
    name: "Sample Board",
    userId: user.id,
  };

  if (!board || board.userId !== user.id) {
    return { notFound: true };
  }


  //dynamically creating api base route 
  //because this code runs on the server during SSR (Server Side Rendering) 
  //Unlike the browser Node.js does not know what /api/boards means because that is a relative path.
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  // Fetch tasks and board from the new API
  const response = await fetch(`${baseUrl}/api/boards/${boardId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  board = await response.json();
  const tasksRes = await fetch(`${baseUrl}/api/tasks?userId=${user.id}&boardId=${boardId}`);
  const tasksData = await tasksRes.json();

  return {
    props: {
      user,
      board,
      initialTasks: tasksData.tasks || [],
    },
  };
};

export default function BoardPage({
  user,
  board,
  initialTasks,
}: {
  user: any;
  board: Board;
  initialTasks: Task[];
}) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle.trim(),
          description: newTaskDescription.trim(),
          dueDate: newTaskDueDate || undefined,
          userId: user.id,
          boardId: board.id,
        }),
      });

      if (response.ok) {
        const { task } = await response.json();
        setTasks((prev) => [...prev, task]);
        setNewTaskTitle("");
        setNewTaskDescription("");
        setNewTaskDueDate("");
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(`/api/tasks/${updatedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const { task } = await response.json();
        setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} />
      <main className="container mx-auto p-4">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{board.name}</h1>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-blue-500 hover:text-blue-700"
            >
              Back to all boards
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-medium mb-3">Add New Task</h2>
            <div className="space-y-3">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title"
                className="w-full p-2 border rounded"
                onKeyPress={(e) => e.key === "Enter" && handleCreateTask()}
              />
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full p-2 border rounded"
                rows={2}
              />
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Due date:</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="p-1 border rounded"
                />
              </div>
              <button
                onClick={handleCreateTask}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks yet. Add one to get started!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
