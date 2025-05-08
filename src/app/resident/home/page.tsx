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
import { ShowEditor } from "@/components/show-editor";

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
      <div className="px-4">
        <h1 className="text-3xl font-bold mb-4">Your Patreon Account</h1>
        <div className="mb-4">
          <p>{resident.user.username}</p>
          <p>{resident.user.email}</p>
        </div>
        <h1 className="text-3xl font-bold mb-4">Your Shows</h1>
        {resident.shows.map((show) => (
          <ShowEditor key={show.attributes.name} show={show} />
        ))}
      </div>
    </PageContainer>
  );
}
