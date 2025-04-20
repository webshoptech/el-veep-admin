export const APP_NAME = "African Hub Marketplace";
export const APP_DESCRIPTION = "Your go to marketplace for African products";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

import {
  HomeIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  TruckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
  WrenchIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  BellAlertIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

export const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "Users & Customers",
    href: "/customers",
    icon: UserCircleIcon,
    children: [
      { name: "Customer List", href: "/customers/list" },
      { name: "Customer Activity", href: "/customers/activity" },
      { name: "Customer Support", href: "/customers/support" },
    ],
  },
  {
    name: "Vendor Management",
    href: "/vendors",
    icon: ShoppingBagIcon,
    children: [
      { name: "Vendor List", href: "/vendors/list" },
      { name: "Vendor Performance", href: "/vendors/performance" },
      { name: "Vendor Compliance", href: "/vendors/compliance" },
    ],
  },
  {
    name: "Product Management",
    href: "/products",
    icon: TruckIcon,
    children: [
      { name: "All Products", href: "/products/all" },
      { name: "Pending Approvals", href: "/products/pending" },
      { name: "Flagged Products", href: "/products/flagged" },
      { name: "Product Analytics", href: "/products/analytics" },
    ],
  },
  {
    name: "Order Management",
    href: "/orders",
    icon: CreditCardIcon,
    children: [
      { name: "All Orders", href: "/orders/all" },
      { name: "Returns & Refunds", href: "/orders/returns" },
      { name: "Disputes", href: "/orders/disputes" },
    ],
  },
  {
    name: "Financial Management",
    href: "/finance",
    icon: ChartBarIcon,
    children: [
      { name: "Revenue Overview", href: "/finance/overview" },
      { name: "Vendor Commissions", href: "/finance/commissions" },
      { name: "Taxes & Fees", href: "/finance/taxes" },
      { name: "Payout Schedule", href: "/finance/payouts" },
    ],
  },
  {
    name: "Platform Settings",
    href: "/settings",
    icon: Cog6ToothIcon,
    children: [
      { name: "General Settings", href: "/settings/general" },
      { name: "Shipping Configuration", href: "/settings/shipping" },
      { name: "Notifications", href: "/settings/notifications" },
    ],
  },
  {
    name: "Reports & Analytics",
    href: "/reports",
    icon: ChartBarIcon,
    children: [
      { name: "Sales Reports", href: "/reports/sales" },
      { name: "Platform Health", href: "/reports/platform" },
      { name: "Vendor Reports", href: "/reports/vendors" },
    ],
  },
  {
    name: "Security & Compliance",
    href: "/security",
    icon: QuestionMarkCircleIcon,
    children: [
      { name: "User Access Control", href: "/security/access" },
      { name: "Audit Logs", href: "/security/logs" },
      { name: "Privacy & Compliance", href: "/security/privacy" },
    ],
  },
];

export const bottomNavigation = [
  {
    name: "App Settings",
    href: "/settings/app",
    icon: WrenchIcon,
  },
  {
    name: "Policies Settings",
    href: "/settings/policies",
    icon: ShieldCheckIcon,
  },
  {
    name: "Profile Settings",
    href: "#",
    icon: BriefcaseIcon,
  },
  {
    name: "Notifications",
    href: "#",
    icon: BellAlertIcon,
  },
  {
    name: "Sign out",
    href: "#",
    icon: ArrowRightStartOnRectangleIcon,
    isLogout: true,
  },
];