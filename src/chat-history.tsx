import { useId, type RefObject } from "react";

export function History({ entries, selectedIdx, onChangeSearchTerm, inputRef }: { entries: string[], selectedIdx: number | null, onChangeSearchTerm: (term: string) => void, inputRef: RefObject<HTMLInputElement | null> }) {
  const id = useId()

  return (
    <div>
      <ol className="flex flex-col-reverse">
        {entries.map((v, i) => (
          <li className={i === selectedIdx ? "bg-sky-400" : ""} key={`${id}-${i}`}>{v}</li>
        ))}
      </ol>
      <input id="isme-message" name="isme-message" className="bg-lime-100  border-b-black border p-2" type='search' onChange={(e) => { onChangeSearchTerm(e.currentTarget.value) }} ref={inputRef}></input>
    </div>
  )
}

