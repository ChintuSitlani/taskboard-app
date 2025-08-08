import Link from "next/link";
import { useRouter } from "next/router";

interface NavbarProps {
    user: {
        name: string;
        email: string;
        id: string;
    };
}

export default function Navbar({ user }: NavbarProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });
            if (response.ok) {
                router.push("/login");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard" className="text-xl font-bold">
                        TaskBoards
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-300">Hi, {user.name}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}