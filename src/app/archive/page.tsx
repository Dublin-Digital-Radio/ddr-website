import { fetchMixes } from "@/api";

export default async function Archive() {
  const mixes = await fetchMixes();
  return (
    <main>
      <ul>
        {mixes.map((mix) => (
          <li key={mix.attributes.name}>{mix.attributes.name}</li>
        ))}
      </ul>
    </main>
  );
}
