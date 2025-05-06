import { fetchAllResidents, fetchResidents } from "@/api";
import { PageContainer } from "@/components/page-container";

import { ResidentList } from "./resident-list";

export default async function Residents(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const residents = searchParams.search
    ? await fetchResidents({ searchQuery: searchParams.search })
    : await fetchAllResidents();

  return (
    <PageContainer>
      <ResidentList initResidents={residents} />
    </PageContainer>
  );
}
