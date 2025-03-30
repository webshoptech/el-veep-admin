'use client';

import { Bars3Icon, BellIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Image from 'next/image';
import { userNavigation } from "@/app/setting";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  return (
    <div className="sticky top-0 z-40 flex h-16 items-center border-b  px-4 shadow-sm sm:px-6 lg:px-8">
      {/* Sidebar Toggle Button (Mobile) - Ensure Only One Instance */}
      <button 
        type="button" 
        onClick={() => setSidebarOpen(true)} 
        className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-600 lg:hidden"
      >
        <Bars3Icon className="size-6 mr-2" />
      </button>

      {/* Search Bar */}
      <div className="relative flex flex-1 items-center">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
        <input
          type="search"
          placeholder="Search..."
          className="w-1/2 rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Right Side */}
      <div className="ml-4 flex items-center space-x-4">
        {/* Notification Bell */}
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <BellIcon className="size-6" />
        </button>

        {/* Profile Dropdown */}
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center space-x-2">
            <Image alt="profile" width={12} height={12} priority src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" className="size-8 rounded-full" />
            <ChevronDownIcon className="size-5 text-gray-400 hover:text-gray-600" />
          </MenuButton>
          
          <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {userNavigation.map((item) => (
              <MenuItem key={item.name}>
                {({ active }) => (
                  <a
                    href={item.href}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 ${active ? "bg-gray-200" : ""}`}
                  >
                    {item.name}
                  </a>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

export default Header;
