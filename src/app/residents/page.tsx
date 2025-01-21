import Link from "next/link";

import { fetchAllResidents } from "@/api";

export default async function Residents() {
  const residents = await fetchAllResidents();

  return (
    <main>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {residents
          ?.filter((resident) =>
            Boolean(resident.attributes.image.data?.attributes.url)
          )
          .map((resident) => (
            <div key={resident.attributes.name}>
              <Link href={`/resident/${resident.attributes.slug}`}>
                <img src={resident.attributes.image.data?.attributes.url} />
                {resident.attributes.name}
              </Link>
            </div>
          ))}
      </div>
    </main>
  );
}
