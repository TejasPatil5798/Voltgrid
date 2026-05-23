import React, { useState } from 'react'
import useMessaging from '../../hooks/useMessaging'
import ConversationList from './ConversationList'
import ChatWindow from './ChatWindow'

export default function MessagesPage({ variant = 'tutor', onNotice }) {
  const [search, setSearch] = useState('')
  const messaging = useMessaging({ enabled: true, onNotice })

  return (
    <div className={`dash-msg-page dash-msg-page--${variant}`}>
      <ConversationList
        variant={variant}
        conversations={messaging.conversations}
        loading={messaging.loading}
        selectedId={messaging.selected?.id}
        search={search}
        onSearchChange={setSearch}
        onSelect={messaging.openConversation}
      />
      <ChatWindow
        variant={variant}
        conversation={messaging.selected}
        messages={messaging.messages}
        loading={messaging.threadLoading}
        draft={messaging.draft}
        sending={messaging.sending}
        peerTyping={messaging.peerTyping}
        threadRef={messaging.threadRef}
        onThreadScroll={messaging.handleThreadScroll}
        onDraftChange={messaging.handleDraftChange}
        onSend={messaging.handleSend}
      />
    </div>
  )
}
