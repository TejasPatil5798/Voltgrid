import { useCallback, useEffect, useRef, useState } from 'react'
import { getRole } from '../lib/auth'
import {
  POLL_MS,
  fetchConversationsSafe,
  fetchConversationThread,
  sendChatMessage,
} from '../lib/messagingApi'
import { formatThreadMessages } from '../lib/messageUtils'

export default function useMessaging({ enabled = true, onNotice } = {}) {
  const role = getRole()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [threadLoading, setThreadLoading] = useState(false)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [peerTyping, setPeerTyping] = useState(false)
  const threadRef = useRef(null)
  const scrollThreadOnUpdateRef = useRef(true)
  const typingTimerRef = useRef(null)

  const scrollThreadToBottom = useCallback((behavior = 'auto') => {
    const el = threadRef.current
    if (!el) return
    window.requestAnimationFrame(() => {
      if (behavior === 'smooth') {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
      } else {
        el.scrollTop = el.scrollHeight
      }
    })
  }, [])

  const handleThreadScroll = useCallback(() => {
    const el = threadRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    scrollThreadOnUpdateRef.current = distanceFromBottom < 80
  }, [])

  const unreadCount = conversations.reduce((n, c) => n + (c.unreadCount || (c.unread ? 1 : 0)), 0)

  const refreshConversations = useCallback(async () => {
    const res = await fetchConversationsSafe()
    setConversations(res.data || [])
    return res.data || []
  }, [])

  const openConversation = useCallback(
    async (conversation) => {
      if (!conversation) return
      setSelected(conversation)
      setThreadLoading(true)
      setPeerTyping(false)
      scrollThreadOnUpdateRef.current = true
      try {
        const res = await fetchConversationThread(conversation)
        setMessages(
          formatThreadMessages(
            res.data,
            role,
            conversation.peerName || conversation.from,
          ),
        )
        await refreshConversations()
      } catch (err) {
        onNotice?.(err.message || 'Could not load conversation.')
      } finally {
        setThreadLoading(false)
      }
    },
    [role, refreshConversations, onNotice],
  )

  const loadInitial = useCallback(async () => {
    setLoading(true)
    try {
      await refreshConversations()
    } finally {
      setLoading(false)
    }
  }, [refreshConversations])

  useEffect(() => {
    if (!enabled) return undefined
    loadInitial()
  }, [enabled, loadInitial])

  useEffect(() => {
    if (!enabled) return undefined
    const id = window.setInterval(async () => {
      const list = await refreshConversations()
      if (!selected) return
      const updated = list.find((c) => c.id === selected.id)
      if (updated) setSelected(updated)
      try {
        const res = await fetchConversationThread(selected)
        setMessages(
          formatThreadMessages(
            res.data,
            role,
            selected.peerName || selected.from,
          ),
        )
      } catch {
        /* polling */
      }
    }, POLL_MS)
    return () => window.clearInterval(id)
  }, [enabled, selected, role, refreshConversations])

  useEffect(() => {
    if (threadLoading || !messages.length) return
    if (!scrollThreadOnUpdateRef.current) return
    scrollThreadToBottom('auto')
  }, [messages, threadLoading, scrollThreadToBottom])

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current)
    }
  }, [])

  function handleDraftChange(value) {
    setDraft(value)
    if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current)
    setPeerTyping(false)
    typingTimerRef.current = window.setTimeout(() => {
      if (value.trim()) setPeerTyping(true)
      typingTimerRef.current = window.setTimeout(() => setPeerTyping(false), 1800)
    }, 400)
  }

  async function handleSend(text) {
    if (!selected || !text?.trim()) return
    setSending(true)
    setPeerTyping(false)
    scrollThreadOnUpdateRef.current = true
    try {
      await sendChatMessage({ conversation: selected, text: text.trim() })
      setDraft('')
      onNotice?.('Message sent.')
      await openConversation(selected)
      await refreshConversations()
    } catch (err) {
      onNotice?.(err.message || 'Could not send message.')
    } finally {
      setSending(false)
    }
  }

  return {
    conversations,
    loading,
    selected,
    setSelected,
    messages,
    threadLoading,
    draft,
    sending,
    peerTyping,
    unreadCount,
    threadRef,
    handleThreadScroll,
    openConversation,
    refreshConversations,
    handleDraftChange,
    handleSend,
  }
}
