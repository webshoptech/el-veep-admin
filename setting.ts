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
export const DIMENSION_OPTIONS = [
    { label: "pound", value: "lbs" },
    { label: "ounce", value: "oz" },
    { label: "kilogram", value: "kg" },
    { label: "gram", value: "g" },
];

export const SIZE_UNIT_OPTIONS = [
    { label: "inch", value: "in" },
    { label: "centimeter", value: "cm" },
];

export const PRICING_MODEL_OPTIONS = [
    { value: "fixed", label: "Fixed" },
    { value: "negotiable", label: "Negotiable" },
];

export const DELIVERY_METHOD_OPTIONS = [
    { value: "remote", label: "Remote" },
    { value: "onsite", label: "Onsite" },
    { value: "hybrid", label: "Hybrid" },
];

export const MAX_IMAGES = 4;
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export const VALID_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
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
        name: "Items Management",
        href: "/items",
        icon: CubeIcon,
        children: [
            { name: "All items", href: "/items" },
            { name: "Item Analytics", href: "/items/analytics" },
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
        children: [{ name: "FAQs", href: "/faqs" }],
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
        children: [{ name: "Team members", href: "/teams" }],
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


export const TYPES = [
    { label: "Physical Product", value: "products" },
    { label: "Service / Digital", value: "services" },
];