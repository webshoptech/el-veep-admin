export const APP_NAME = "African Hub Marketplace";
export const APP_DESCRIPTION = "Your go to marketplace for African products";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
import {
    HomeIcon,
    ShoppingBagIcon,
    CreditCardIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    UserCircleIcon,
    WrenchIcon,
    ShieldCheckIcon,
    BriefcaseIcon,
    BellAlertIcon,
    ArrowRightStartOnRectangleIcon,
    CurrencyDollarIcon,
    MegaphoneIcon,
    BuildingStorefrontIcon,
    Squares2X2Icon,
    CubeIcon,
} from "@heroicons/react/24/outline";

export const NAVIGATION = [
    {
        name: "Dashboard",
        href: "/",
        icon: HomeIcon,
        children: [{ name: "Home", href: "/" }],
    },
    {
        name: "Customer Management",
        href: "/customers",
        icon: UserCircleIcon,
        children: [
            { name: "Customer List", href: "/customers" },
            { name: "Customer Activity", href: "/customers/activities" },
        ],
    },
    {
        name: "Vendor Management",
        href: "/vendors",
        icon: ShoppingBagIcon,
        children: [
            { name: "Vendor List", href: "/vendors" },
            { name: "Vendor Performance", href: "/vendors/activities" },
        ],
    },
    {
        name: "Items Management",
        href: "/products",
        icon: CubeIcon,
        children: [
            { name: "All items", href: "/products" },
            { name: "Pending Approvals", href: "/products/pending" },
            { name: "Item Analytics", href: "/products/analytics" },
        ],
    },
    {
        name: "Category Management",
        href: "/categories",
        icon: Squares2X2Icon,
        children: [
            { name: "All categories", href: "/categories" },
            { name: "Sub-categories", href: "/categories/sub" },
            { name: "Category Banners", href: "/categories/banners" },
            { name: "Category Analytics", href: "/categories/analytics" },
        ],
    },
    {
        name: "Shop Management",
        href: "/shops",
        icon: BuildingStorefrontIcon,
        children: [
            { name: "Shop List", href: "/shops" },
            { name: "Shop Performance", href: "/shops/performance" },
        ],
    },
    {
        name: "Order Management",
        href: "/orders",
        icon: CreditCardIcon,
        children: [
            { name: "All Orders", href: "/orders" },
            { name: "Processing orders", href: "/orders/processing" },
            { name: "Ongoing orders", href: "/orders/ongoing" },
            { name: "Delivered orders", href: "/orders/delivered" },
            { name: "Cancelled orders", href: "/orders/cancelled" },
            { name: "Returns & Refunds orders", href: "/orders/returned" },
        ],
    },
    {
        name: "Financial Management",
        href: "/finance",
        icon: CurrencyDollarIcon,
        children: [
            { name: "Revenue Overview", href: "/finance" },
            { name: "Payout Requests", href: "/finance/payouts" }, 
            { name: "Transactions", href: "/finance/transactions" },
            { name: "Commission Revenues", href: "/finance/revenues" }, 
            { name: "Commission Rates", href: "/finance/commissions" }, 
            { name: "Settlment Accounts", href: "/finance/settlement-accounts" }, 
        ],
    }, 
    {
        name: "Support Tickets",
        href: "/reports",
        icon: MegaphoneIcon,
        children: [
            { name: "Tickets", href: "/tickets" },
            { name: "Notifications", href: "/notifications" },
        ],
    },
    {
        name: "App Settings",
        href: "/settings",
        icon: Cog6ToothIcon,
        children: [
            { name: "General Settings", href: "/settings/general" },
            { name: "Clik2Pay Configuration", href: "/settings/clik2pay" },
            { name: "EasyPost Configuration", href: "/settings/easypost" },
            { name: "SMS Configuration", href: "/settings/sms" },
            { name: "Email Configuration", href: "/settings/email" },
            { name: "Payment methods", href: "/settings/payments" },
        ],
    },
    {
        name: "Security & Compliance",
        href: "/security",
        icon: QuestionMarkCircleIcon,
        children: [
            { name: "Privacy & Compliance", href: "/settings/policies" },
        ],
    },
];

export const receiverOptions = [
  { label: "All notifications", value: "" },
  { label: "All users", value: "all" },
  { label: "All customers", value: "customer" },
  { label: "All vendor", value: "vendor" },
];

export const typeOptions = [
  { label: "SMS", value: "sms" },
  { label: "Email", value: "email" },
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
        name: "Tickets",
        href: "/settings/tickets",
        icon: BellAlertIcon,
    },
    {
        name: "Sign out",
        href: "#",
        icon: ArrowRightStartOnRectangleIcon,
        isLogout: true,
    },
];
