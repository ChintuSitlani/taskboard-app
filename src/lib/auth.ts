import { parse } from "cookie";
import { verify } from "jsonwebtoken";
import { IncomingMessage } from "http";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

export function getUserFromRequest(req: IncomingMessage): any | null {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies.token;

    if (!token) return null;

    try {
        const user = verify(token, JWT_SECRET);
        return user;
    } catch (err) {
        return null;
    }
}