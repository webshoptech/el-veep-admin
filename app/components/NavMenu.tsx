// components/NavMenu.tsx
import { navigation } from "@/app/setting";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const NavMenu = () => {
  return (
    <ul className="-mx-2 space-y-1">
      {navigation.map((item) => (
        <li key={item.name}>
          <a
            href={item.href}
            className={classNames(
              item.current
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white",
              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
            )}
          >
            <item.icon className="size-6 shrink-0" />
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default NavMenu;
