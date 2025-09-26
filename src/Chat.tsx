import { useEffect, useRef, useState, type FormEvent } from "react";
import { History } from "./chat-history";

const SHOW_HISTORY_KEY = 'r'

export function Chat() {
  const { push, clearAll, messages, selectedMessageIdx, cycleSelectedMessage, search } = useMessageHistory();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchHistoryInputRef = useRef<HTMLInputElement>(null);

  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === SHOW_HISTORY_KEY && e.ctrlKey && showHistory === false) {
        setShowHistory(true)
        searchHistoryInputRef.current?.focus()
      }
    }

    inputRef.current?.addEventListener('keydown', handleKeydown)

    return () => {
      inputRef.current?.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || (e.key === 'c' && e.ctrlKey)) {
        setShowHistory(false)
        inputRef.current?.focus()
      }
      if (e.key === SHOW_HISTORY_KEY && e.ctrlKey) {
        cycleSelectedMessage()
      }
    }

    formRef.current?.addEventListener('keydown', handleKeydown)

    return () => {
      formRef.current?.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  return (
    <div className="flex-col-reverse">
      <form ref={formRef} onSubmit={(e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const formProps = Object.fromEntries(formData);
        const message = formProps['isme-message'];
        if (!(message && typeof message === 'string')) { return; }
        push(message);
        (e.target as HTMLFormElement).reset()
        inputRef.current?.focus()
      }}>
        {showHistory && <History entries={messages} selectedIdx={selectedMessageIdx} onChangeSearchTerm={search} inputRef={searchHistoryInputRef} />}
        <label className="m-5 p-2" htmlFor="chat">Send a message</label>
        <input id="isme-message" name="isme-message" className="bg-lime-100  border-b-black border p-2" type='text' ref={inputRef}></input>
        <button type="submit" className="bg-sky-500 m-5 p-2">Send</button>
        <button onClick={clearAll} className="bg-orange-200 m-5 p-2">Clear History</button>
      </form>
    </div>
  );
}


const localStorageKey = 'messages'
const MAX_HISTORY_SIZE = 50;

function getStoredMessages(): string[] {
  const stored = localStorage.getItem(localStorageKey)
  if (stored === null) return [];
  return JSON.parse(stored) as string[]
}

function setStoredMessages(messages: string[]) {
  localStorage.setItem(localStorageKey, JSON.stringify(messages))
}

export function useMessageHistory() {
  const initialMessages = getStoredMessages()
  const [messages, setMessages] = useState(initialMessages)
  const [messageIdx, setMessageIdx] = useState<number | null>(null)
  console.log('rendering', { messageIdx })

  const push = (message: string) => {
    const allMsgs = [message, ...messages].slice(0, MAX_HISTORY_SIZE)
    setMessages(() => allMsgs)
    setStoredMessages(allMsgs)
  }

  const search = (searchTerm: string) => {
    setMessages(getStoredMessages().filter(m => m.includes(searchTerm)))
  }

  const clearSearch = () => {
    setMessages(getStoredMessages())
  }

  const clearAll = () => {
    setMessages([])
    setStoredMessages([])
  }

  const cycleSelectedMessage = (direction: boolean = true) => {
    console.log('cycle selected', { messageIdx, messages })
    if (messageIdx === null && messages.length > 0) setMessageIdx(0)
    if (messageIdx === null) return;
    if (messageIdx >= messages.length) setMessageIdx(0)
    const inc = direction ? 1 : -1
    setMessageIdx(curr => curr! + inc)
  }

  return {
    messages,
    cycleSelectedMessage,
    selectedMessageIdx: messageIdx,
    push,
    search,
    clearSearch,
    clearAll
  }
}
