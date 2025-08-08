import { db, saveDB } from "@/lib/db";
import { Board } from "@/types/board";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { v4 as uuid } from "uuid";

const boardSchema = z.object({
    name: z.string().min(1, "Name is required"),
    userId: z.string().min(1, "User Id is required"),
});

const boardSchemaForGet = z.object({
    userId: z.string().min(1, "User Id is required"),
});

export default async function handleBoards(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "POST": {
            const parsed = boardSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    error: "Validation failed",
                    issues: parsed.error.issues,
                });
            }

            const { name, userId } = parsed.data;

            const board: Board = {
                id: uuid(),
                name,
                userId,
            };

            db.boards.push(board);
            await saveDB();

            return res.status(200).json({
                message: "Board successfully created.",
                board,
            });
        }

        case "GET": {
            console.log('GET');
            const parsed = boardSchemaForGet.safeParse(req.query);

            if (!parsed.success) {
                return res.status(400).json({
                    error: "Validation failed",
                    issues: parsed.error.issues,
                });
            }

            const { userId } = parsed.data;
            const boards = db.boards.filter((b) => b.userId === userId);

            return res.status(200).json({ boards });
        }

        default: {
            return res.status(405).json({ message: "Method Not Allowed" });
        }
    }
}
