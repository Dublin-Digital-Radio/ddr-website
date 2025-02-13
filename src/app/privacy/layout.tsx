import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <main className="pt-4 max-w-prose md:px-8">{children}</main>;
}
