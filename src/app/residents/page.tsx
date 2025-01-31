import { fetchAllResidents, fetchResidents } from "@/api";

import { ResidentList } from "./resident-list";

export default async function Residents(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const residents = searchParams.search
    ? await fetchResidents({ searchQuery: searchParams.search })
    : await fetchAllResidents();

  return (
    <main className="md:px-8">
      <ResidentList initResidents={residents} />
    </main>
  );
}
