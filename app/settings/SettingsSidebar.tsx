'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SettingsNavigation } from '../setting';
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SettingsSidebar() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (name: string) => {
    setOpenGroup((prev) => (prev === name ? null : name));
  };

  return (
    <aside className="py-2 lg:col-span-3">
      <nav className="space-y-1">
        {SettingsNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <div key={item.name} className="space-y-1">
              <button
                type="button"
                onClick={() => item.children ? toggleGroup(item.name) : null}
                className={classNames(
                  isActive
                    ? 'bg-teal-50 border-teal-500 text-teal-700'
                    : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                  'group w-full border-l-4 px-3 py-2 flex items-center justify-between text-sm font-medium focus:outline-none'
                )}
              >
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-5 w-5 text-teal-500" />}
                  <span>{item.name}</span>
                </div>
                {item.children && (
                  openGroup === item.name ? (
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  )
                )}
              </button>

              {/* Children */}
              {item.children && openGroup === item.name && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={classNames(
                          isChildActive
                            ? 'text-teal-600 font-medium'
                            : 'text-gray-600 hover:text-gray-900',
                          'block text-sm px-2 py-1 rounded hover:bg-gray-100'
                        )}
                      >
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
