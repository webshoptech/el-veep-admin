import {
    HomeIcon,
    UsersIcon,
    FolderIcon,
    CalendarIcon,
    DocumentDuplicateIcon,
    ChartPieIcon,
  } from "@heroicons/react/24/outline";
  
  export const navigation = [
    { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
    { name: "Team", href: "#", icon: UsersIcon, current: false },
    { name: "Projects", href: "#", icon: FolderIcon, current: false },
    { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
    { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
    { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
  ];

  export const userNavigation = [
    { name: 'Your profile', href: '#' },
    { name: 'Sign out', href: '#' },
  ]

  export const APP_NAME = "African Hub Marketplace";
  export const APP_DESCRIPTION = "Your go to marketplace for African products";