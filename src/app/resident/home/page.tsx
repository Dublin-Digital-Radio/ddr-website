"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CurrentResident,
  fetchCurrentResident,
  getCmsAccessToken,
} from "@/api";

export default function ResidentHome() {
  const [resident, setResident] = useState<CurrentResident>();

  useEffect(() => {
    if (!getCmsAccessToken()) {
      // If no JWT, redirect to CMS to authenticate with Patreon and redirect back to /connect/patreon/redirect?access_token=<token>
      redirect("https://ddr-cms.fly.dev/api/connect/patreon");
    } else {
      fetchCurrentResident()
        .then((data) => setResident(data))
        .catch(() => {
          redirect("https://ddr-cms.fly.dev/api/connect/patreon");
        });
    }
  }, []);

  if (!resident) {
    return null;
  }

  return (
    <main>
      <div>{resident.username}</div>
    </main>
  );
}
