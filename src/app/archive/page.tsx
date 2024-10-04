import { fetchMixes } from "@/api";

import { Mix } from "./mix";

export default async function Archive() {
  const mixes = await fetchMixes();
  return (
    <main>
      <ul>
        {mixes.map((mix) => (
          <li key={mix.attributes.name}>
            <Mix name={mix.attributes.name} url={mix.attributes.url} />
          </li>
        ))}
      </ul>
    </main>
  );
}
