import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { User } from "@/types/user";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { email, password } = req.body;
    const existing = await db.users.find(u => u.email === email);
    if (existing) return res.status(400).json({ error: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = {
        id: uuid(),
        email,
        password: hashedPassword
    };
    db.users.push(user);

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "secret-key",
        { expiresIn: '7d' }
    );


    res.setHeader("Set-Cookie", serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    }));

    res.status(200).json({ message: "Registered successfully", user: { id: user.id, email: user.email } });
}