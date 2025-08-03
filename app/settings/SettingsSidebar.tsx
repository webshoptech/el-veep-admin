"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SettingsNavigation } from "../setting";



function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="py-6 lg:col-span-3">
      <nav className="space-y-1">
        {SettingsNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={classNames(
              pathname === item.href
                ? "bg-teal-50 border-teal-500 text-teal-700 hover:bg-teal-50 hover:text-teal-700"
                : "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900",
              "group border-l-4 px-3 py-2 flex items-center text-sm font-medium"
            )}
            aria-current={pathname === item.href ? "page" : undefined}
          >
            <span className="truncate">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}