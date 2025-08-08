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
        <nav className="bg-gray-800 text-white">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link href="/dashboard" className="text-xl font-bold">
                    TaskBoards
                </Link>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className="text-sm sm:text-base text-gray-300">
                        Hi, {user.name}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm sm:text-base rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}