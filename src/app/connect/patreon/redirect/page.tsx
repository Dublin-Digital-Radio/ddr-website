"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Content() {
  // This route corresponds to the CMS auth provider config at https://ddr-cms.fly.dev/admin/settings/users-permissions/providers.
  // This route is where the ddr. CMS calls back to after authenticating with Patreon.
  // The CMS calls back this route with ?access_token.
  // We want to save the access_token to be used in the authorization header in future requests against the CMS.

  const searchParams = useSearchParams();
  const accessToken = searchParams.get("access_token");

  // Call https://ddr-cms.fly.dev/api/auth/patreon/callback here first with the access token to get JWT

  fetch(
    `https://ddr-cms.fly.dev/api/auth/patreon/callback?access_token=${accessToken}`,
  )
    .then((response) => response.json())
    .then((response) => console.log("PatreonRedirect", response));

  return <div>wat</div>;
}

export default function PatreonRedirect() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
