"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { fetchAllResidents, fetchResidents, Residents } from "@/api";
import { SearchForm } from "@/components/search-form";

export function ResidentList({ initResidents }: { initResidents: Residents }) {
  const [residents, setResidents] = useState(initResidents);

  const handleSubmit = useCallback(async (searchQuery: string | undefined) => {
    const residents = searchQuery
      ? await fetchResidents({
          searchQuery,
        })
      : await fetchAllResidents();
    setResidents(residents);
  }, []);

  return (
    <div>
      <div className="mb-4">
        <SearchForm
          placeholderText="Search ddr. residents"
          onSubmit={handleSubmit}
        />
      </div>
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
