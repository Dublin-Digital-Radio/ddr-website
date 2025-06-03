"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CollapsibleNav } from "./collapsible-nav";
import logo from "./logo.png";

export interface NavItem {
  href: string;
  text: string;
  target?: string;
  activePathnameMatchFunction?: (pathname: string) => boolean;
}

const navItems: NavItem[] = [
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
    activePathnameMatchFunction: (pathname) => {
      return pathname === "/residents" || pathname.startsWith("/resident/");
    },
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

export function Nav() {
  const pathname = usePathname();

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
            {navItems.map(
              ({ href, text, target, activePathnameMatchFunction }) => (
                <li key={href}>
                  <Link
                    className={`me-8 hover:underline ${
                      activePathnameMatchFunction?.(pathname) ||
                      pathname === href ||
                      pathname.startsWith(href)
                        ? "underline"
                        : ""
                    }`}
                    href={href}
                    target={target}
                  >
                    {text}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
