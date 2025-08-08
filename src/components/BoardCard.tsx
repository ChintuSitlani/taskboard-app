import Link from "next/link";
import { Board } from "@/types/board";

interface BoardCardProps {
    board: Board;
    onDelete: (id: string) => void;
}

export default function BoardCard({ board, onDelete }: BoardCardProps) {
    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="flex justify-between items-start">
                <Link href={`/board/${board.id}`} className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{board.name}</h3>
                </Link>
                <button
                    onClick={() => onDelete(board.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Delete board"
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
        </div>
    );
}