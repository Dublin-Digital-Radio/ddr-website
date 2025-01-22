import { fetchAllResidents, fetchResidents } from "@/api";

import { ResidentList } from "./resident-list";

export default async function Residents({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const residents = searchParams.search
    ? await fetchResidents({ searchQuery: searchParams.search })
    : await fetchAllResidents();

  return (
    <main>
      <ResidentList initResidents={residents} />
    </main>
  );
}
