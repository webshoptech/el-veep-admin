export const APP_NAME = "El Veep Superstore and Event Center";
export const APP_DESCRIPTION = "Groceries to Gathering - We Make It Happen";

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
    CreditCardIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    UserCircleIcon,
    ArrowRightStartOnRectangleIcon, 
    Squares2X2Icon,
    CubeIcon,
    AdjustmentsHorizontalIcon,
    FlagIcon,
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
        name: "Reviews Management",
        href: "/reviews",
        icon: CreditCardIcon,
        children: [
            { name: "All Reviews", href: "/reviews" },
            { name: "Un-Reviews orders", href: "/reviews/un-reviews" },
        ],
    },
    {
        name: "Category Management",
        href: "/categories",
        icon: Squares2X2Icon,
        children: [
            { name: "All categories", href: "/categories" },
            { name: "Sub-categories", href: "/categories/sub" },
            { name: "Category Analytics", href: "/categories/analytics" },
        ],
    },
    {
        name: "Products Management",
        href: "/products",
        icon: CubeIcon,
        children: [
            { name: "Published products", href: "/products" },
            { name: "Draft products", href: "/products/pending" },
            { name: "Item Analytics", href: "/products/analytics" },
        ],
    },
    {
        name: "Variation Management",
        href: "/variations",
        icon: AdjustmentsHorizontalIcon,
        children: [
            { name: "Product colors", href: "/variations/colors" },
            { name: "Product sizes", href: "/variations/sizes" },
        ],
    },
    {
        name: "Banner Management",
        href: "/banners",
        icon: FlagIcon,
        children: [
            { name: "Banner types", href: "/banners/types" },
            { name: "Banners", href: "/banners" },
        ],
    },
    {
        name: "FAQs Management",
        href: "/faqs",
        icon: QuestionMarkCircleIcon,
        children: [
            { name: "FAQs", href: "/faqs" },
        ],
    },
    {
        name: "Security & Compliance",
        href: "/security",
        icon: Cog6ToothIcon,
        children: [
            { name: "Privacy & Compliance", href: "/settings/policies" },
        ],
    },
    {
        name: "Platform Settings",
        href: "/settings/app",
        icon: AdjustmentsHorizontalIcon,
        children: [
            { name: "Settings", href: "/settings/app" },
            { name: "Team members", href: "/teams" },
        ],
    },
];

export const PrivacyPages = [
    { name: "Privacy Policy", type: "privacy" },
    { name: "Terms and Conditions", type: "terms" },
    { name: "Delivery Policy", type: "delivery" },
    { name: "Refund Policy", type: "refund" },
    { name: "Return Policy", type: "return" },
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
        name: "Sign out",
        href: "#",
        icon: ArrowRightStartOnRectangleIcon,
        isLogout: true,
    },
];
