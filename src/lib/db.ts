import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import { User } from "@/types/user";
import { Task } from "@/types/task";
import { Board } from "@/types/board";

const DB_FILE = path.resolve(process.cwd(), "db.json");

type DBType = {
    users: User[];
    tasks: Task[];
    boards: Board[];
};

let db: DBType = {
    users: [],
    tasks: [],
    boards: [],
};

async function loadDB() {
    try {
        const data = await fs.readFile(DB_FILE, "utf-8");
        db = JSON.parse(data);
    } catch (err) {
        console.log("No DB file found. Creating a new one with default user.");
        // default user
        const hashedPassword = await bcrypt.hash("123456", 10);
        db.users.push({
            id: Date.now().toString(),
            name: "John Doe",
            email: "johndoe@gmail.com",
            password: hashedPassword,
        });
        await saveDB(); // save default
    }
}

async function saveDB() {
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
}

// Call loadDB once on import
await loadDB();

export { db, saveDB };
