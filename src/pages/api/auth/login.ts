import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { email, password } = req.body;
    const user = await db.users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: "Invalid email Id user does not exist!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password!" });

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name
        },
        process.env.JWT_SECRET || "secret-key",
        { expiresIn: '7d' }
    );
    res.setHeader("Set-Cookie", serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    }));

    res.status(200).json({
        message: 'Logged In',
        user: {
            id: user.id,
            email: user.email
        }
    });
}