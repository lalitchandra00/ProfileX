import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProfileForm } from '../context/useProfileForm'
import { sendChatMessage } from '../lib/agentClient'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function newId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`
}

function AssistantPanel() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const bottomRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { setField, reloadProfile, resumeInputRef } = useProfileForm()

  const userId = localStorage.getItem('userId')
  const storageKey = userId ? `profilex.assistant.${userId}` : 'profilex.assistant.guest'

  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {}
    } catch {
      return {}
    }
  })()

  const [threadId, setThreadId] = useState(saved.threadId || null)
  const [actionCursor, setActionCursor] = useState(saved.actionCursor || 0)
  const [needsInput, setNeedsInput] = useState(Boolean(saved.needsInput))

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ threadId, actionCursor, needsInput }))
  }, [storageKey, threadId, actionCursor, needsInput])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  function appendMessage(role, content) {
    setMessages((previous) => [...previous, { id: newId(), role, content }])
  }

  async function executeActions(actions) {
    if (actions.some((action) => action.type === 'fill_form') && location.pathname !== '/home') {
      navigate('/home')
      await wait(250)
    }

    for (const action of actions) {
      if (action.type === 'fill_form') {
        for (const [field, value] of Object.entries(action.fields || {})) {
          setField(field, value)
          await wait(200)
        }
      } else if (action.type === 'navigate' && action.to) {
        navigate(action.to)
      } else if (action.type === 'open_resume_upload') {
        resumeInputRef.current?.click()
      } else if (action.type === 'profile_saved') {
        await reloadProfile()
      }
    }
  }

  async function handleSend(event) {
    event.preventDefault()
    const text = input.trim()

    if (!text || busy) {
      return
    }

    if (!userId) {
      appendMessage('assistant', 'Please log in first, then I can help with your profile.')
      return
    }

    setInput('')
    appendMessage('user', text)
    setBusy(true)

    try {
      const data = await sendChatMessage({
        message: text,
        userId,
        threadId,
        actionCursor,
        resume: needsInput,
      })

      setThreadId(data.threadId)
      setActionCursor(data.actionCursor ?? actionCursor)
      setNeedsInput(Boolean(data.needsInput))

      if (data.question) {
        appendMessage('assistant', data.question)
      } else if (data.reply) {
        appendMessage('assistant', data.reply)
      } else {
        appendMessage('assistant', 'Done.')
      }

      await executeActions(data.actions || [])
    } catch (error) {
      appendMessage('assistant', error.message)
      setNeedsInput(false)
    } finally {
      setBusy(false)
    }
  }

  function startNewChat() {
    localStorage.removeItem(storageKey)
    setThreadId(null)
    setActionCursor(0)
    setNeedsInput(false)
    setMessages([])
  }

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[520px] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-white bg-white/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">ProfileX Assistant</p>
              <p className="text-[11px] text-white/80">Your local AI helper</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startNewChat}
                title="New chat"
                className="rounded-full px-2 py-1 text-xs font-semibold text-white/90 transition hover:bg-white/20"
              >
                New
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                title="Close chat"
                className="rounded-full px-2 py-1 text-lg leading-none text-white/90 transition hover:bg-white/20"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-purple-50/40 px-3 py-4">
            {messages.length === 0 && (
              <div className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
                Hi! Try “Open the profile page” or “Fill the form with my details”.
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    message.role === 'user'
                      ? 'rounded-br-sm bg-purple-600 text-white'
                      : 'rounded-bl-sm bg-white text-gray-700'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-sm text-gray-500 shadow-sm">
                  Thinking…
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 bg-white p-3">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={needsInput ? 'Type your answer…' : 'Ask me anything…'}
              className="min-w-0 flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="rounded-full bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:bg-purple-300"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-0.5"
      >
        {open ? 'Hide Assistant' : 'Ask Assistant'}
      </button>
    </div>
  )
}

export default AssistantPanel
