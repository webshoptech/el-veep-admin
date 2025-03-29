// components/Header.tsx
"use client";

import { Dialog, DialogPanel, TransitionChild } from "@headlessui/react";
import {
  Cog6ToothIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  ChartPieIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Team", href: "#", icon: UsersIcon, current: false },
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
  { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];

const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile Sidebar */}
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <div className="fixed inset-0 bg-gray-900/80" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900 px-6 pb-4">
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-2"
                >
                  <XMarkIcon className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>
            <div className="flex h-16 items-center">
              <Image
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <nav className="mt-5 flex flex-1 flex-col">
              <ul className="flex-1 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white",
                        "group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold"
                      )}
                    >
                      <item.icon className="size-6" />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="text-xs font-semibold text-gray-400 mt-5">
                Your teams
              </div>
              <ul className="mt-2 space-y-1">
                {teams.map((team) => (
                  <li key={team.name}>
                    <a
                      href={team.href}
                      className="flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
                    >
                      <span className="size-6 flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-xs font-medium">
                        {team.initial}
                      </span>
                      {team.name}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="mt-auto flex items-center gap-x-3 p-2 text-sm font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <Cog6ToothIcon className="size-6" />
                Settings
              </a>
            </nav>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-gray-900 px-6 pb-4">
        <div className="flex h-16 items-center">
          <Image
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
        </div>
        <nav className="mt-5 flex flex-1 flex-col">
          <ul className="flex-1 space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white",
                    "group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold"
                  )}
                >
                  <item.icon className="size-6" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="text-xs font-semibold text-gray-400 mt-5">
            Your teams
          </div>
          <ul className="mt-2 space-y-1">
            {teams.map((team) => (
              <li key={team.name}>
                <a
                  href={team.href}
                  className="flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <span className="size-6 flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-xs font-medium">
                    {team.initial}
                  </span>
                  {team.name}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="mt-auto flex items-center gap-x-3 p-2 text-sm font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <Cog6ToothIcon className="size-6" />
            Settings
          </a>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
