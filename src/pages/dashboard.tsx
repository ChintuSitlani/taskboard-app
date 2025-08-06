import { GetServerSideProps } from "next";
import { getUserFromRequest } from "@/lib/auth";
import React from "react";

interface DashboardProps {
    user: { id: string; email: string };
}

const Dashboard = ({ user }: DashboardProps) => {
    return (
        <div>
            <h1>Welcome, {user.email}</h1>
        </div>
    );
};

export default Dashboard;

//Protect this page with getServerSideProps
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