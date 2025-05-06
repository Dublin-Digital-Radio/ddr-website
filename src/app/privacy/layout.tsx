import React from "react";

import { PageContainer } from "@/components/page-container";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer>
      <div className="max-w-prose">{children}</div>
    </PageContainer>
  );
}
