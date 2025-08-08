import { NextApiRequest, NextApiResponse } from "next";
import { db, saveDB } from "@/lib/db";
import { User } from "@/types/user";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { z } from "zod";

const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const parsed = userSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                error: "Validation failed",
                issues: parsed.error.issues,
            });
        }

        const { name, email, password } = parsed.data;
        const existing = db.users.find((u) => u.email === email);
        if (existing) return res.status(400).json({ error: "User already exists." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user: User = {
            id: uuid(),
            name,
            email,
            password: hashedPassword,
        };

        db.users.push(user);
        await saveDB();

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET || "secret-key",
            { expiresIn: "7d" }
        );

        res.setHeader("Set-Cookie", serialize("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        }));

        res.status(200).json({
            message: "Registered successfully",
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
}
