import { db, saveDB } from "@/lib/db";
import { Task } from "@/types/task";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const taskSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  boardId: z.string().min(1, "Board ID is required").optional(),
  userId: z.string().min(1, "User ID is required").optional(),
  dueDate: z.string().optional(),
  createdAt: z.string().optional(),
  completed: z.boolean().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const taskIndex = db.tasks.findIndex((t) => t.id === id);

  switch (req.method) {
    case "GET": {
      const task = db.tasks.find((t: Task) => t.id === id);
      if (!task) return res.status(404).json({ message: "Task not found" });
      return res.status(200).json(task);
    }

    case "PUT": {
      if (taskIndex === -1) return res.status(404).json({ message: "Task not found" });

      try {
        const validated = taskSchema.parse(req.body);

        const updatedTask: Task = {
          ...db.tasks[taskIndex], // keep existing values
          ...validated, // override with validated input
        };

        db.tasks[taskIndex] = updatedTask;
        await saveDB();

        return res.status(200).json({
          message: "Task updated successfully",
          task: updatedTask,
        });
      } catch (error) {
        return res.status(400).json({
          message: "Invalid data",
          error: error instanceof z.ZodError ? error.flatten() : error,
        });
      }
    }

    case "DELETE": {
      if (taskIndex === -1) return res.status(404).json({ message: "Task not found" });

      db.tasks.splice(taskIndex, 1);
      await saveDB();

      return res.status(200).json({ message: "Task deleted successfully" });
    }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
