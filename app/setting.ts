import {
    HomeIcon, 
    ShoppingBagIcon,
    CreditCardIcon,
    ChatBubbleLeftRightIcon,
    TruckIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    UserCircleIcon,
  } from "@heroicons/react/24/outline";
  
 export const navigation = [
   {
     name: "Dashboard",
     href: "/",
     icon: HomeIcon,
   },
   {
     name: "Product Management",
     href: "/products",
     icon: ShoppingBagIcon,
     children: [
       { name: "Add Product", href: "/product/add" },
       { name: "All Products", href: "/product/all" },
     ],
   },
   {
     name: "Order Management",
     href: "/orders",
     icon: CreditCardIcon,
     children: [
       { name: "All Orders", href: "/orders/all" },
       { name: "Pending Orders", href: "/orders/pending" },
     ],
   },
   {
     name: "Customer Feedback",
     href: "/feedback",
     icon: ChatBubbleLeftRightIcon,
     children: [
       { name: "Customer Message", href: "/feedback/messages" },
       { name: "Ratings & Review", href: "/feedback/ratings" },
     ],
   },
   {
     name: "Finance & Payment",
     href: "/finance",
     icon: CreditCardIcon,
     children: [
       { name: "Transaction History", href: "/finance/transactions" },
       { name: "Payouts", href: "/finance/payouts" },
     ],
   },
   {
     name: "Shipping & Logistics",
     href: "/shipping",
     icon: TruckIcon,
   },
   {
     name: "Analytics & Report",
     href: "/analytics",
     icon: ChartBarIcon,
   },
   {
     name: "Accounts & Settings",
     href: "/settings",
     icon: Cog6ToothIcon,
   },
   {
     name: "Vendor Support",
     href: "/support",
     icon: QuestionMarkCircleIcon,
   },
   {
     name: "Shop Management",
     href: "/shops",
     icon: UserCircleIcon,
   },
 ];
  export const userNavigation = [
    { name: 'Your profile', href: '#' },
    { name: 'Sign out', href: '#' },
  ]

  export const APP_NAME = "African Hub Marketplace";
  export const APP_DESCRIPTION = "Your go to marketplace for African products";