import { GetServerSideProps } from "next";
import { getUserFromRequest } from "@/lib/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import BoardCard from "@/components/BoardCard";
import { Board } from "@/types/board";


interface Props {
    user: { userId: string };
    initialBoards: Board[];
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
    const user = getUserFromRequest(req);

    if (!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
    //dynamically creating api base route 
    //because this code runs on the server during SSR (Server Side Rendering) 
    //Unlike the browser Node.js does not know what /api/boards means because that is a relative path.
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    try {
        const response = await fetch(`${baseUrl}/api/boards?userId=${user.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const { boards } = await response.json();

        return {
            props: { user, initialBoards: boards || [] },
        };
    } catch (error) {
        console.error("Failed to fetch boards:", error);
        return {
            props: { user, initialBoards: [] },
        };
    }
};

export default function DashboardPage({
    user,
    initialBoards,
}: {
    user: any;
    initialBoards: Board[];
}) {
    const router = useRouter();
    const [boards, setBoards] = useState<Board[]>(initialBoards);
    const [newBoardName, setNewBoardName] = useState("");

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user]);

    const handleCreateBoard = async () => {
        if (!newBoardName.trim()) return;

        try {
            const response = await fetch("/api/boards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newBoardName.trim(),
                    userId: user.id,
                }),
            });

            if (response.ok) {
                const newBoard = await response.json();
                console.log(newBoard);

                setBoards([...boards, newBoard.board]);
                setNewBoardName("");
            }
        } catch (error) {
            console.error("Failed to create board:", error);
        }
    };

    const handleDeleteBoard = async (boardId: string) => {
        try {
            const confirmed = window.confirm("Are you sure you want to delete this board?");
            if (!confirmed) return;

            const response = await fetch(`/api/boards/${boardId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setBoards(boards.filter((board) => board.id !== boardId));
            }
        } catch (error) {
            alert("Failed to delete board:" + error);
            console.error("Failed to delete board:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar user={user} />
            <main className="container mx-auto p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-4">My Task Boards</h1>
                    <div className="flex space-x-2 mb-4">
                        <input
                            type="text"
                            value={newBoardName}
                            onChange={(e) => setNewBoardName(e.target.value)}
                            placeholder="New board name"
                            className="flex-1 p-2 border rounded"
                            onKeyPress={(e) => e.key === "Enter" && handleCreateBoard()}
                        />
                        <button
                            onClick={handleCreateBoard}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Create Board
                        </button>
                    </div>
                </div>

                {boards.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">You don't have any boards yet. Create one to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {boards.map((board) => (
                            <BoardCard
                                key={board.id}
                                board={board}
                                onDelete={handleDeleteBoard}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}