'use client'

import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { fetchMixes, Mixes } from "@/api"

import { Mix } from "./mix"

export function MixList({
  initMixes
}: {
  initMixes: Mixes
}) {
  const searchParams = useSearchParams()
  const [mixes, setMixes] = useState(initMixes)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search'))

  return (
    <div>
      <form onSubmit={async (event) => {
        event.preventDefault()
        const mixes = await fetchMixes({
          searchQuery: searchQuery ?? undefined
        });
        setMixes(mixes)
        window.history.pushState(null, '', `?search=${searchQuery}`)
      }}>
      <input type="text" value={searchQuery ?? ''} onChange={event => setSearchQuery(event.target.value)} />
    </form>
    <ul>
        {mixes.map((mix) => (
          <li key={mix.attributes.name}>
            <Mix name={mix.attributes.name} url={mix.attributes.url} />
          </li>
        ))}
      </ul>
      </div>
  )
}
