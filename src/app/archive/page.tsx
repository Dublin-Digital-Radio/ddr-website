import { fetchMixes } from "@/api";

import { MixList } from "./mix-list";

export default async function Archive(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const mixes = await fetchMixes({
    searchQuery: searchParams.search,
  });
  return (
    <main className="md:px-8">
      <MixList initMixes={mixes} />
    </main>
  );
}
