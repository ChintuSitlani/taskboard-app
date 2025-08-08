import { db, saveDB } from "@/lib/db";
import { Board } from "@/types/board";
import { Task } from "@/types/task";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const boardSchema = z.object({
    id: z.string().min(1, "id is required"),
    name: z.string().min(1, "Name is required").optional(),
    userId: z.string().min(1, "User Id is required").optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== "string") {
        return res.status(400).json({ message: "Invalid board ID" });
    }

    const boardIndex = db.boards.findIndex((b) => b.id === id);

    switch (req.method) {
        case "GET": {
            const board = db.boards.find((b: Board) => b.id === id);
            if (!board) return res.status(404).json({ message: "Board not found" });
            return res.status(200).json(board);
        }

        case "PUT": {
            if (boardIndex === -1) return res.status(404).json({ message: "Board not found" });

            try {
                const validated = boardSchema.parse(req.body);
                const updatedBoard: Board = {
                    ...db.boards[boardIndex],
                    ...validated,
                };

                db.boards[boardIndex] = updatedBoard;
                await saveDB();

                return res.status(200).json({
                    message: "Board updated successfully",
                    board: updatedBoard,
                });
            } catch (error) {
                return res.status(400).json({ message: "Invalid data", error });
            }
        }

        case "DELETE": {
            if (boardIndex === -1) {
                return res.status(404).json({ message: "Board not found" });
            }

            const board: Board = db.boards[boardIndex];
            db.boards.splice(boardIndex, 1);//deleteing board
            db.tasks = db.tasks.filter((t: Task) => t.boardId !== board.id); //deleteing board's task 

            await saveDB();

            return res.status(200).json({ message: "Board and its tasks deleted successfully" });
        }

        default:
            return res.status(405).json({ message: "Method Not Allowed" });
    }
}
