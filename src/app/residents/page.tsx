import Link from "next/link";

import { fetchResidents } from "@/api";

export default async function Residents() {
  const residents = await fetchResidents();

  return (
    <main>
      <ul>
        {residents?.map((resident) => (
          <li key={resident.attributes.name}>
            <Link href={`/resident/${resident.attributes.slug}`}>
              {resident.attributes.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
