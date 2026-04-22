"use client";
import { usePathname } from "next/navigation";

export default function NavLink({ href, icon, text }: { href: string; icon: string; text: string }) {
    const pathname = usePathname();

    // Check if the current route matches the link's href
    const isActive = pathname === href;

    return (
        <a href={href} className={isActive ? "active" : ""}>
            <span className="material-symbols-outlined">
                {icon}
            </span>
            <span className="nav-title">
                {text}
            </span>

        </a>
    );
}