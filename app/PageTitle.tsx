"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";
import { APP_NAME } from "./setting";

const PageTitle = () => {
  const pathname = usePathname();
 const appName = APP_NAME
  const titles: Record<string, string> = {
    "/": "Home - " + appName,
    "/vendors": "Vendors -" + appName,
    "/customers": "Customers -" + appName,
    "/products": "Products -" + appName,
    "/orders": "Orders -" + appName,
    "/withdraws": "Withdraws -" + appName,
    "/shops": "Shops -" + appName,
  };

  const title = titles[pathname] || + appName;  

  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
};

export default PageTitle;
