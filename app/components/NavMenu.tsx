"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/app/setting";
import clsx from "clsx";

const NavMenu = () => {
  const pathname = usePathname();

  return (
    <ul className="-mx-2 space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href;

        return (
          <li key={item.name}>
            <Link
              href={item.href}
              className={clsx(
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-500 hover:text-white",
                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold"
              )}
            >
              <item.icon className="size-6 shrink-0" />
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavMenu;
