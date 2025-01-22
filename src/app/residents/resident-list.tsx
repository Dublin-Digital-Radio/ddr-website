"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { fetchResidents, Residents } from "@/api";

export function ResidentList({ initResidents }: { initResidents: Residents }) {
  const searchParams = useSearchParams();
  const [residents, setResidents] = useState(initResidents);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search"));

  return (
    <div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const residents = await fetchResidents({
            searchQuery: searchQuery ?? undefined,
          });
          setResidents(residents);
          window.history.pushState(null, "", `?search=${searchQuery}`);
        }}
      >
        <input
          type="text"
          value={searchQuery ?? ""}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </form>
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
    </div>
  );
}
