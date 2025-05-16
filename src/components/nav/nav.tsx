"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { CollapsibleNav } from "./collapsible-nav";
import logo from "./logo.png";

export interface NavItem {
  href: string;
  text: string;
  target?: string;
}

async function fetchNavItems(): Promise<NavItem[]> {
  return [
    {
      href: "/schedule",
      text: "Schedule",
    },
    {
      href: "/news-events",
      text: "News + Events",
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
      href: "/about",
      text: "About",
    },
    {
      href: "/chat-box",
      text: "Chat Box",
    },
  ];
}

export function Nav() {
  const router = useRouter();
  const pathname = usePathname(); 
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    async function loadNavItems() {
      const items = await fetchNavItems();
      setNavItems(items);
    }
    loadNavItems();
  }, []);

  return (
    <>
      <div className="md:hidden">
        <CollapsibleNav navItems={navItems} />
      </div>
      <div className="hidden md:flex flex-row md:px-8">
        <div className="w-40 py-4 mr-10">
          <Link href="/">
            <Image className="h-8 w-auto" src={logo} alt="ddr logo" />
          </Link>
        </div>
        <div className="flex-1 flex justify-end py-4">
          <ul className="flex">
{navItems.map(({ href, text, target }) => (
              <li key={href}>
                <Link
                  className={`me-8 hover:underline ${
                    pathname === href ? "underline" : ""
                  }`}
                  href={href}
                  target={target}
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
