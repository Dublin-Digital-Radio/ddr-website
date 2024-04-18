import Link from "next/link";

export function Nav() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/residents">Residents</Link>
        </li>
      </ul>
    </div>
  );
}
