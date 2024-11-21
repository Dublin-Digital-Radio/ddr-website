import { fetchShowInfo } from "@/api";

export default async function Resident({
  params,
}: {
  params: { slug: string };
}) {
  const resident = await fetchShowInfo({ slug: params.slug });
  if (!resident) {
    return null;
  }

  return (
    <main>
      <h2>{resident.name}</h2>
      <img width="200" src={resident.image.data?.attributes.url} />
    </main>
  );
}
