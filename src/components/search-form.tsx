import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function SearchForm({
  placeholderText,
  onSubmit,
}: {
  placeholderText: string;
  onSubmit: (searchQuery: string | undefined) => void;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search"));

  const handlePopstate = useCallback(
    async (event: PopStateEvent) => {
      setSearchQuery(event.state.searchQuery);
      onSubmit(event.state.searchQuery ?? undefined);
    },
    [onSubmit]
  );

  useEffect(() => {
    window.addEventListener("popstate", handlePopstate);

    return () => window.removeEventListener("popstate", handlePopstate);
  }, [handlePopstate, onSubmit]);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        onSubmit(searchQuery ?? undefined);
        window.history.pushState({ searchQuery }, "", `?search=${searchQuery}`);
      }}
    >
      <div className="px-4 mb-2 md:w-1/3 md:pl-0">
        <input
          type="text"
          value={searchQuery ?? ""}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="w-full border-black border-2 text-3xl text-black"
          placeholder={placeholderText}
        />
      </div>
      <div className="flex px-4 md:w-1/3 md:pl-0">
        <div className="flex-1 pr-1">
          <button
            type="button"
            className="w-full py-2.5 px-5 text-md rounded-sm border"
            onClick={async () => {
              setSearchQuery(null);
              onSubmit(undefined);
              window.history.pushState({ searchQuery: null }, "", pathname);
            }}
          >
            Clear
          </button>
        </div>
        <div className="flex-1 pl-1">
          <button className="w-full py-2.5 px-5 text-md rounded-sm border bg-white text-black">
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
