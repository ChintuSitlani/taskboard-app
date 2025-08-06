export interface Task {
    id: string;
    boardId: string;
    userId: string;
    title: string;
    description?: string;
    dueDate?: string;
    createdAt: string;
    completed: boolean;
}