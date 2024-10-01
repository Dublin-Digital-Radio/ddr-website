import Link from "next/link";

import { CollapsibleNav } from "./collapsible-nav";

export interface NavItem {
  href: string;
  text: string;
}

async function fetchNavItems(): Promise<NavItem[]> {
  return [
    {
      href: "/",
      text: "Home",
    },
    {
      href: "/schedule",
      text: "Schedule",
    },
    {
      href: "/residents",
      text: "Residents",
    },
  ];
}

export async function Nav() {
  const navItems = await fetchNavItems();
  return (
    <div>
      <div className="md:hidden">
        <CollapsibleNav navItems={navItems} />
      </div>
      <div className="hidden md:block">
        <ul className="flex flex-wrap">
          {navItems.map(({ href, text }) => (
            <li key={href}>
              <Link className="me-4" href={href}>
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
