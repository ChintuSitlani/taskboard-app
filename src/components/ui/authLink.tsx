import Link from 'next/link';

interface AuthLinkProps {
    text: string;
    linkText: string;
    href: string;
}

export default function AuthLink({ text, linkText, href }: AuthLinkProps) {
    return (
        <div className="mt-6 text-center text-sm text-gray-500">
            {text}{' '}
            <Link
                href={href}
                className="font-medium text-blue-600 hover:text-blue-500"
            >
                {linkText}
            </Link>
        </div>
    );
}