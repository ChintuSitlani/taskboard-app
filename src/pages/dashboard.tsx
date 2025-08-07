import { GetServerSideProps } from "next";
import { getUserFromRequest } from "@/lib/auth";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const user = getUserFromRequest(req);
    if (!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return {
        props: {
            user,
        },
    };
};

export default function DashboardPage({ user }: { user: any }) {
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Welcome, {user?.email}</h1>
        </div>
    );
}