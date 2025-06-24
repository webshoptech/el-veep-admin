"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "App Settings", href: "/settings/app" },
  { name: "User Management", href: "/settings/users" },
  { name: "Billing", href: "/settings/billing" },
  { name: "Integrations", href: "/settings/integrations" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="py-6 lg:col-span-3">
      <nav className="space-y-1">
        {navigation.map((item) => (
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