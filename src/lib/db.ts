import { User } from "@/types/user";
import { Task } from "@/types/task";
import { Board } from "@/types/board";
import bcrypt from "bcrypt";

export const db = {
    users: [
        {//default user for login testing
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            id: Date.now().toString(),
            password: await bcrypt.hash('123456', 10),//default pass 123456
        }
    ] as User[],
    tasks: [] as Task[],
    boards: [] as Board[]
};