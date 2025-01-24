"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchMixes, Mixes } from "@/api";

import { Mix } from "./mix";

export function MixList({ initMixes }: { initMixes: Mixes }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [mixes, setMixes] = useState(initMixes);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search"));

  useEffect(() => {
    window.addEventListener("popstate", async (event) => {
      setSearchQuery(event.state.searchQuery);
      const mixes = await fetchMixes({
        searchQuery: event.state.searchQuery ?? undefined,
      });
      setMixes(mixes);
    });
  }, []);

  return (
    <div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const mixes = await fetchMixes({
            searchQuery: searchQuery ?? undefined,
          });
          setMixes(mixes);
          window.history.pushState(
            { searchQuery },
            "",
            `?search=${searchQuery}`
          );
        }}
      >
        <div className="px-4">
          <input
            type="text"
            value={searchQuery ?? ""}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full md:w-6/12 border-black border-2 text-4xl"
            placeholder="Search ddr archive"
          />
        </div>
        <div className="flex px-4">
          <div className="flex-1">
            <button
              type="button"
              className="w-full"
              onClick={async () => {
                setSearchQuery(null);
                const mixes = await fetchMixes({
                  searchQuery: undefined,
                });
                setMixes(mixes);
                window.history.pushState({ searchQuery: null }, "", pathname);
              }}
            >
              Clear
            </button>
          </div>
          <div className="flex-1">
            <button className="w-full">Search</button>
          </div>
        </div>
      </form>
      <ul>
        {mixes.map((mix) => (
          <li key={mix.attributes.name}>
            <Mix name={mix.attributes.name} url={mix.attributes.url} />
          </li>
        ))}
      </ul>
    </div>
  );
}
