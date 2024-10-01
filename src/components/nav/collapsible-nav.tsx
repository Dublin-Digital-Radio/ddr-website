"use client";

import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";

import { NavItem } from "./nav";

export function CollapsibleNav({ navItems }: { navItems: NavItem[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div>
      <button onClick={toggleDrawer}>
        <Bars3Icon className="size-8" />
      </button>
      {drawerOpen ? (
        <ul>
          {navItems.map(({ href, text }) => (
            <li key={href}>
              <Link href={href}>{text}</Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
