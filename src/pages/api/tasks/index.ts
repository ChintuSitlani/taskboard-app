import { db, saveDB } from "@/lib/db";
import { Task } from "@/types/task";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { v4 as uuid } from "uuid";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    boardId: z.string().min(1, "Board Id is required"),
    userId: z.string().min(1, "User Id is required"),
    description: z.string().optional(),
    dueDate: z.string().optional(),
});

const taskSchemaForGet = z.object({
    userId: z.string().min(1, "User Id is required"),
    boardId: z.string().min(1, "Board Id is required"),
});

export default async function handleTasks(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "POST": {
            const parsed = taskSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    error: "Validation failed",
                    issues: parsed.error.issues,
                });
            }

            const { title, boardId, userId, description, dueDate } = parsed.data;

            const task: Task = {
                id: uuid(),
                title,
                boardId,
                userId,
                description,
                dueDate,
                createdAt: new Date().toISOString(),
                completed: false,
            };

            db.tasks.push(task);
            await saveDB();

            return res.status(200).json({
                message: "Task successfully created.",
                task,
            });
        }

        case "GET": {
            const parsed = taskSchemaForGet.safeParse(req.query);
            if (!parsed.success) {
                return res.status(400).json({
                    error: "Validation failed",
                    issues: parsed.error.issues,
                });
            }

            const { userId, boardId } = parsed.data;
            const tasks = db.tasks.filter(
                (task) => task.userId === userId && task.boardId === boardId
            );

            return res.status(200).json({ tasks });
        }

        default: {
            return res.status(405).json({ message: "Method Not Allowed" });
        }
    }
}
