"use client";

import { useCallback, useState } from "react";

import { fetchMixes, Mixes } from "@/api";
import { SearchForm } from "@/components/search-form";

import { Mix } from "./mix";

export function MixList({ initMixes }: { initMixes: Mixes }) {
  const [mixes, setMixes] = useState(initMixes);

  const handleSubmit = useCallback(async (searchQuery: string | undefined) => {
    const mixes = await fetchMixes({
      searchQuery,
    });
    setMixes(mixes);
  }, []);

  return (
    <div className="pt-4">
      <SearchForm
        placeholderText="Search the ddr. archive"
        onSubmit={handleSubmit}
      />
      <ul>
        {mixes.map((mix) => (
          <li key={mix.id}>
            <Mix mix={mix} />
          </li>
        ))}
      </ul>
    </div>
  );
}
