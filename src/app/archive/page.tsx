import { fetchMixes } from "@/api";

import { MixList } from "./mix-list";

export default async function Archive({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const mixes = await fetchMixes({
    searchQuery: searchParams.search
  });
  return (
    <main>
      <MixList initMixes={mixes} />
    </main>
  );
}
