"use client";

import { Bars3Icon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import logo from "./logo.png";
import { NavItem } from "./nav";

export function CollapsibleNav({ navItems }: { navItems: NavItem[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="flex h-10">
      <div className="flex-1">
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
      <div className="flex flex-1 justify-center p-2">
        <Image src={logo} alt="ddr logo" height={24} />
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
