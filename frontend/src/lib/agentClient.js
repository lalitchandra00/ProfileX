import { AGENT_URL } from './config'

export async function sendChatMessage({ message, userId, threadId, actionCursor, resume }) {
  let response

  try {
    response = await fetch(`${AGENT_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userId, threadId, actionCursor, resume }),
    })
  } catch {
    throw new Error('Cannot reach the agent. Is the Python server running on port 8001?')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.detail || `Agent request failed (${response.status})`)
  }

  return data
}
