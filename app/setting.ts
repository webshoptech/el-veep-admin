import {
    HomeIcon,
    UsersIcon,
    FolderIcon,
    CalendarIcon,
    DocumentDuplicateIcon,
    ChartPieIcon,
  } from "@heroicons/react/24/outline";
  
  export const navigation = [
    { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
    { name: "Vendors", href: "/vendors", icon: UsersIcon, current: false },
    { name: "Customers", href: "/customers", icon: FolderIcon, current: false },
    { name: "Products", href: "/products", icon: CalendarIcon, current: false },
    { name: "Shops", href: "/shops", icon: DocumentDuplicateIcon, current: false },
    { name: "Order", href: "/orders", icon: ChartPieIcon, current: false },
    { name: "Withdraws", href: "/withdraws", icon: ChartPieIcon, current: false },
  ];

  export const userNavigation = [
    { name: 'Your profile', href: '#' },
    { name: 'Sign out', href: '#' },
  ]

  export const APP_NAME = "African Hub Marketplace";
  export const APP_DESCRIPTION = "Your go to marketplace for African products";