"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { cmsUrl, DDR_CMS_ACCESS_TOKEN_KEY } from "@/api";

function Content() {
  // This route corresponds to the CMS auth provider config at https://ddr-cms.fly.dev/admin/settings/users-permissions/providers.
  // This route is where the ddr. CMS calls back to after authenticating with Patreon.
  // The CMS calls back this route with ?access_token.
  // We want to save the access_token to be used in the authorization header in future requests against the CMS.

  const searchParams = useSearchParams();

  const [success, setSuccess] = useState<boolean>();

  useEffect(() => {
    // Call https://ddr-cms.fly.dev/api/auth/patreon/callback here first with the access token to get JWT

    const accessToken = searchParams.get("access_token");
    fetch(`${cmsUrl}/auth/patreon/callback?access_token=${accessToken}`)
      .then((response) => response.json())
      .then((response) => {
        localStorage.setItem(DDR_CMS_ACCESS_TOKEN_KEY, response.jwt);
        setSuccess(true);
        setTimeout(() => {
          location.href = "/resident/home";
        }, 2000);
      });
  }, [searchParams]);

  if (!success) {
    return <div>Loading...</div>;
  } else {
    return <div>Redirecting...</div>;
  }
}

export default function PatreonRedirect() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
