import { ButtonHTMLAttributes, ReactNode } from "react";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    btnName?: string;
    children?: ReactNode;
}

export function Btn({
    className = "",
    btnName = "Button Name",
    type = "button",
    disabled = false,
    children,
    onClick,
    ...props
}: BtnProps) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${className} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
            {...props}
        >
            {children || btnName}
        </button>
    );
}