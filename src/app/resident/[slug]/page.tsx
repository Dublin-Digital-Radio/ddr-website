async function fetchResident(slug: string) {
  return await fetch(
    `https://ddr-cms.fly.dev/api/shows?populate=*&filters[slug][$eq]=${slug}`
  )
    .then((response) => response.json())
    .then(({ data }) => data[0].attributes);
}

export default async function Resident({
  params,
}: {
  params: { slug: string };
}) {
  const resident = await fetchResident(params.slug);
  return (
    <main>
      <h2>{resident.name}</h2>
      <img width="200" src={resident.image.data.attributes.url} />
    </main>
  );
}
