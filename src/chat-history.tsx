import { useId, type KeyboardEventHandler, type RefObject } from "react";

export function History({ entries, selectedIdx, onInputKeyDown: onInputKeyDown, inputRef }: { entries: string[], selectedIdx: number | null, onInputKeyDown: KeyboardEventHandler<HTMLInputElement>, inputRef: RefObject<HTMLInputElement | null> }) {
  const id = useId()

  return (
    <div>
      <ol className="flex flex-col-reverse">
        {entries.map((v, i) => (
          <li className={i === selectedIdx ? "bg-sky-400" : ""} key={`${id}-${i}`}>{v}</li>
        ))}
      </ol>
      <input id="isme-message" name="isme-message" className="bg-lime-100  border-b-black border p-2" type='search' ref={inputRef} onKeyDown={onInputKeyDown} ></input>
    </div>
  )
}

