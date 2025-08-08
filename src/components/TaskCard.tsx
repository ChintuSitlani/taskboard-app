import { Task } from "@/types/task";
import { useState } from "react";

interface TaskCardProps {
    task: Task;
    onUpdate: (updatedTask: Task) => void;
    onDelete: (id: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description || "");

    const handleToggleComplete = () => {
        onUpdate({
            ...task,
            completed: !task.completed,
        });
    };

    const handleSave = () => {
        onUpdate({
            ...task,
            title: editedTitle,
            description: editedDescription,
        });
        setIsEditing(false);
    };

    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const daysUntilDue = dueDate
        ? Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <div className={`border rounded-lg p-4 mb-2 ${task.completed ? "bg-gray-50" : "bg-white"}`}>
            <div className="flex items-start">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={handleToggleComplete}
                    className="mt-1 mr-2"
                />
                <div className="flex-1">
                    {isEditing ? (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="w-full p-1 border rounded"
                            />
                            <textarea
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                className="w-full p-1 border rounded"
                                rows={3}
                            />
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-200 px-2 py-1 rounded text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                                    {task.title}
                                </h3>

                                {task.completed && (
                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                        Completed
                                    </span>
                                )}
                            </div>

                            {task.description && (
                                <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                            )}

                            <div className="mt-2 text-xs text-gray-500">
                                {dueDate && (
                                    <span className={`mr-2 ${daysUntilDue && daysUntilDue < 0 ? "text-red-500" : ""}`}>
                                        Due: {dueDate.toISOString().split("T")[0]}
                                        {daysUntilDue !== null && (
                                            <span>
                                                ({daysUntilDue > 0 ? `${daysUntilDue} days left` : `${Math.abs(daysUntilDue)} days overdue`})
                                            </span>
                                        )}
                                    </span>
                                )}

                                <span>Created: {new Date(task.createdAt).toISOString().split("T")[0]}</span>
                            </div>
                        </div>

                    )}
                </div>
                {!isEditing && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-600 hover:text-blue-800"
                            aria-label="Edit task"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(task.id)}
                            className="text-red-600 hover:text-red-800"
                            aria-label="Delete task"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}