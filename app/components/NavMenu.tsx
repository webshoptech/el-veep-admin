"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION } from "@/app/setting";
import clsx from "clsx";
import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const NavMenu = () => {
    const pathname = usePathname();
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    const toggleSection = (name: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    return (
        <ul className="space-y-2">
            {NAVIGATION.map((item) => {
                const isActiveParent = pathname.startsWith(item.href);
                const isOpen = openSections[item.name] || isActiveParent;

                return (
                    <li key={item.name}>
                        <button
                            onClick={() => toggleSection(item.name)}
                            className={clsx(
                                "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-semibold",
                                isActiveParent
                                    ? "text-orange-500"
                                    : "text-gray-700 hover:text-orange-500"
                            )}
                        >
                            <span className="flex items-center gap-x-3">
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </span>
                            {item.children &&
                                (isOpen ? (
                                    <ChevronDownIcon className="h-4 w-4" />
                                ) : (
                                    <ChevronRightIcon className="h-4 w-4" />
                                ))}
                        </button>

                        {item.children && isOpen && (
                            <ul className="ml-8 mt-1 space-y-2">
                                {item.children.map((subItem) => {
                                    const isActiveSub = pathname === subItem.href;
                                    return (
                                        <li key={subItem.name}>
                                            <Link
                                                href={subItem.href}
                                                className={clsx(
                                                    "block px-3 py-1.5 text-sm rounded-md",
                                                    isActiveSub
                                                        ? "bg-orange-50 text-orange-600"
                                                        : "text-gray-500 hover:text-orange-500 hover:bg-orange-50"
                                                )}
                                            >
                                                {subItem.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default NavMenu;
