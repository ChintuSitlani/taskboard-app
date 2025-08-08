import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    res.setHeader("Set-Cookie", serialize("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0, // Immediately expires the cookie
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    }));

    res.status(200).json({ message: "Logged out successfully" });
}