import Link from "next/link";

async function fetchResidents() {
  return await fetch(
    "https://ddr-cms.fly.dev/api/shows?pagination[page]=1&pagination[pageSize]=20&filters[active][$eq]=true&sort=name&populate=*"
  )
    .then((response) => response.json())
    .then(({ data }) => {
      return data.map((node: { attributes: any }) => node.attributes);
    });
}

export default async function Residents() {
  const residents = await fetchResidents();
  return (
    <main>
      <ul>
        {residents?.map((resident: any) => (
          <li key={resident.name}>
            <Link href={`/resident/${resident.slug}`}>{resident.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
