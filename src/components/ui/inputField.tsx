import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FieldError, FieldValues, RegisterOptions, UseFormRegister, Path } from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
    labelText: string;
    inputFieldName: Path<T>;
    type?: string;
    placeholder?: string;
    register: UseFormRegister<T>;
    error?: FieldError;
    validationRules?: RegisterOptions<T, Path<T>>;
    className?: string;
}

export function InputField<T extends FieldValues>({
    labelText,
    inputFieldName,
    type = "text",
    placeholder = "",
    register,
    error,
    validationRules = {},
    className = "",
}: InputFieldProps<T>) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const togglePassword = () => setShowPassword((prev) => !prev);

    return (
        <div className={`w-full ${className}`}>
            <label
                htmlFor={String(inputFieldName)}
                className="block mb-2 text-sm font-medium text-gray-700"
            >
                {labelText}
            </label>

            <div className="relative">
                <input
                    id={String(inputFieldName)}
                    type={isPassword && showPassword ? "text" : type}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 text-sm text-gray-900 bg-white border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${error
                        ? "border-red-400 focus:ring-red-300 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-300 focus:border-blue-500 hover:border-gray-400"
                        } placeholder-gray-400`}
                    {...register(inputFieldName, validationRules)}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff size={18} className="stroke-[1.5]" />
                        ) : (
                            <Eye size={18} className="stroke-[1.5]" />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{error.message}</p>
            )}
        </div>
    );
}