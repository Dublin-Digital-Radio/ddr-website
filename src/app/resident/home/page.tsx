"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import {
  cmsUrl,
  CurrentResident,
  fetchCurrentResident,
  getCmsAccessToken,
} from "@/api";
import { PageContainer } from "@/components/page-container";

export default function ResidentHome() {
  const [resident, setResident] = useState<CurrentResident>();

  useEffect(() => {
    if (!getCmsAccessToken()) {
      // If no JWT, redirect to CMS to authenticate with Patreon and redirect back to /connect/patreon/redirect?access_token=<token>
      redirect(`${cmsUrl}/connect/patreon`);
    } else {
      fetchCurrentResident()
        .then(({ user, shows }) => {
          setResident({
            user,
            shows,
          });
        })
        .catch((error) => {
          console.log(error);
          redirect(`${cmsUrl}/connect/patreon`);
        });
    }
  }, []);

  if (!resident) {
    return null;
  }

  return (
    <PageContainer>
      <form>
        <div>{resident.user.username}</div>
        <ul>
          {resident.shows.map((show) => (
            <li key={show.attributes.name}>{show.attributes.name}</li>
          ))}
        </ul>
      </form>
    </PageContainer>
  );
}
