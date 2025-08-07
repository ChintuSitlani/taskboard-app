'use client';

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputField } from "@/components/ui/inputField";
import { Btn } from "@/components/ui/button";
import AuthLink from "@/components/ui/authLink";

type LoginForm = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function LoginPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {

        setServerError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password
                })
            });

            if (res.ok) {
                router.push('/dashboard');
            } else {
                const resData = await res.json();
                setServerError(resData.error || 'Registration failed!');
            }
        } catch (err) {
            setServerError("An error occurred. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-6"
            >
                <h2 className="text-3xl font-bold text-center text-grey-700">Login</h2>

                <InputField
                    labelText="Email"
                    inputFieldName="email"
                    type="email"
                    placeholder="Enter your email"
                    register={register}
                    validationRules={{
                        required: "Email is required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                        },
                    }}
                    error={errors.email}
                />

                <InputField
                    labelText="Password"
                    inputFieldName="password"
                    type="password"
                    placeholder="Enter your password"
                    register={register}
                    validationRules={{
                        required: "Password is required",
                        minLength: { value: 6, message: "Minimum 6 characters" },
                    }}
                    error={errors.password}
                />

                {serverError && (
                    <p className="text-sm text-red-600 text-center">{serverError}</p>
                )}

                <Btn
                    type="submit"
                    disabled={isLoading}
                    btnName={isLoading ? "Logining..." : "Login"}
                    className="w-full"
                />
                <AuthLink
                    text="Do'nt have an account?"
                    linkText="Sign up"
                    href="/register"
                />
            </form>
        </div>
    );
}