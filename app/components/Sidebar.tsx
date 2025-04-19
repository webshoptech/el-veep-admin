"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import NavMenu from "@/app/components/NavMenu";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
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
          <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-100 bg-white">
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
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
            <SidebarContent />
          </DialogPanel>
        </div>
      </Dialog>

      {/* ✅ Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-white px-6 pb-4 border-r border-gray-200">
        <SidebarContent />
      </div>
    </>
  );
};

const SidebarContent = () => (
  <div className="flex grow flex-col overflow-y-auto pt-4">
    <div className="flex items-center justify-center mb-8">
      <Image
        src="/logo.png" // Replace with your actual logo path
        alt="African Market Hub"
        width={150}
        height={40}
        className="h-auto w-auto"
        priority={true}
      />
    </div>
    <nav className="flex flex-1 flex-col justify-between">
      <NavMenu />
      <div className="mt-10">
        <a
          href="#"
          className="flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7"
            />
          </svg>
          Log out
        </a>
      </div>
    </nav>
  </div>
);

export default Sidebar;
