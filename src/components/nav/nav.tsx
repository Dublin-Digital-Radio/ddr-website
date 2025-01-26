import Image from "next/image";
import Link from "next/link";

import { CollapsibleNav } from "./collapsible-nav";
import logo from "./logo.png";

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
      href: "/archive",
      text: "Archive",
    },
    {
      href: "/residents",
      text: "Residents",
    },
    {
      href: "/chat-box",
      text: "Chat Box",
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
      <div className="hidden md:flex flex-row">
        <div className="w-40 p-4 mr-10">
          <Link href="/">
            <Image src={logo} alt="ddr logo" />
          </Link>
        </div>
        <div className="flex-1 flex justify-end pt-8">
          <ul className="flex">
            {navItems.map(({ href, text }) => (
              <li key={href}>
                <Link className="me-4 font-bold text-2xl uppercase" href={href}>
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
