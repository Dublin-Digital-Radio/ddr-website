import { fetchMixes } from "@/api";
import { PageContainer } from "@/components/page-container";

import { MixList } from "./mix-list";

export default async function Archive(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const mixes = await fetchMixes({
    searchQuery: searchParams.search,
  });
  return (
    <PageContainer>
      <MixList initMixes={mixes} />
    </PageContainer>
  );
}
