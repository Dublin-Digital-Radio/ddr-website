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
    <div className="pt-4">
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
                <div className="aspect-square">
                  <img
                    src={resident.attributes.image.data?.attributes.url}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="underline py-2 md:text-2xl md:py-4">
                  {resident.attributes.name}
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
