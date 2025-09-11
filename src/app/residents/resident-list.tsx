"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { fetchAllResidents, fetchResidents, Residents } from "@/api";
import { SearchForm } from "@/components/search-form";
import { getCloudinaryOptimizedImageUrl } from "@/utils";

export function ResidentList({ initResidents }: { initResidents: Residents }) {
  const [loading, setLoading] = useState(false);
  const [residents, setResidents] = useState(initResidents);

  const handleSubmit = useCallback(async (searchQuery: string | undefined) => {
    if (searchQuery) {
      await fetchResidents({
        searchQuery,
      }).then((residents) => setResidents(residents));
    } else {
      setLoading(true);
      await fetchAllResidents().then((residents) => {
        setResidents(residents);
        setLoading(false);
      });
    }
  }, []);

  return (
    <>
      <div className="mb-4">
        <SearchForm
          placeholderText="Search ddr. residents"
          onSubmit={handleSubmit}
        />
      </div>
      {loading ? (
        <div className="px-4">Loading...</div>
      ) : (
        <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {residents
            ?.filter((resident) =>
              Boolean(resident.attributes.image.data?.attributes.url),
            )
            .map((resident) => (
              <div key={resident.attributes.name}>
                <Link className="hover:underline" href={`/resident/${resident.attributes.slug}`}>
                  <div className="aspect-square opacity-85 hover:opacity-100 transition duration-200 ease-out">
                    <img
                      src={getCloudinaryOptimizedImageUrl(
                        resident.attributes.image.data?.attributes.url!,
                        {
                          width: 800,
                          height: 800,
                        },
                      )}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="py-2 md:text-2xl md:py-4">
                    {resident.attributes.name}
                  </div>
                </Link>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
