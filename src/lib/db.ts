import { User } from "@/types/user";
import { Task } from "@/types/task";
import { Board } from "@/types/board";

export const db = {
    users: [] as User[],
    tasks: [] as Task[],
    boards: [] as Board[]
};