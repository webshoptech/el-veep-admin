"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverPanel,
  TransitionChild,
} from "@headlessui/react";
import { ChevronUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import NavMenu from "@/app/components/NavMenu";
import Link from "next/link";
import { useState } from "react";
import { bottomNavigation } from "@/app/setting";
import { Bars3Icon } from "@heroicons/react/24/solid";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* ✅ Mobile Sidebar */}
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/50 transition-opacity duration-300" />
        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16  rounded-r-4xl border-orange-200 flex w-full max-w-xs flex-1 transform transition duration-700 ease-in data-closed:translate-x-full sm:duration-700 bg-white"
          >
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center  pt-5">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </TransitionChild>
            <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
          </DialogPanel>
        </div>
      </Dialog>
      <div className="sticky top-0 z-40 flex h-16 items-center px-4 sm:px-6 lg:px-8 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-orange-500 hover:text-orange-900 lg:hidden"
        >
          <Bars3Icon className="size-6 mr-2" />
        </button>
      </div>

      {/* ✅ Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-white px-6 pb-4 border-r rounded-r-4xl border-orange-200">
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
    </>
  );
};

const SidebarContent = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) => (
  <div className="flex grow flex-col overflow-y-auto pt-4">
    <div className="flex items-center justify-center mb-8">
      <Image
        src="/logo.png"
        alt="African Market Hub"
        width={150}
        height={40}
        className="h-10 w-30"
        priority={true}
      />
    </div>
    <nav className="flex flex-1 flex-col justify-between">
      <NavMenu />
      <BottomMenu collapsed={collapsed} setCollapsed={setCollapsed} />
    </nav>
  </div>
);

function BottomMenu({
  collapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  return (
    <Popover className="relative w-1/2">
      <div className="fixed bottom-0 z-50 bg-hub-primary-400 text-white rounded-xl shadow-inner px-4 py-3 flex items-center justify-between mb-2">
        {/* Profile */}
        <div className="flex items-center gap-x-3">
          <Image
            className="size-10 rounded-full object-cover"
            src="https://catalyst-demo.tailwindui.com/users/erica.jpg"
            alt="Profile"
            width={40}
            height={40}
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">David Market</span>
            <span className="max-w-[120px] truncate text-xs text-white">
              david@africanhubmarket.com
            </span>
          </div>
        </div>

        {/* Toggle Button */}
        <PopoverButton
          className="text-white hover:text-white transition"
          aria-label="Toggle menu"
        >
          {({ open }) => (
            <ChevronUpIcon
              className={`h-5 w-5 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          )}
        </PopoverButton>
      </div>

      {/* Menu Panel */}
      <PopoverPanel
        transition
        className="fixed bottom-[60px] z-40 px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
      >
        <div className="rounded-t-xl bg-hub-primary-400 text-white shadow-lg ring-1 ring-white/10 p-3 space-y-1">
          {bottomNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
               className={`flex items-center cursor-pointer  gap-x-3 rounded-md px-4 py-2 text-sm font-medium hover:bg-white/10 ${
                item.isLogout
                  ? "text-orange-500 font-bold bg-white border hover:bg-white hover:text-white"
                  : ""
              } ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon
                className={`size-4   ${
                  item.isLogout
                    ? "text-red-500 hover:text-white font-bold"
                    : "text-white"
                }`}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export default Sidebar;
