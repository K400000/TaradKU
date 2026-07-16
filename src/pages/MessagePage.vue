<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { appState, myConversations, sendMessage } from '../stores/app.js'
import AppTopBar from '../components/AppTopBar.vue'

const activeConvId = ref(myConversations.value[0]?.id || null)
const showingChat = ref(false)
const newMessage = ref('')
const chatBodyRef = ref(null)

const activeConv = computed(() => appState.conversations.find(c => c.id === activeConvId.value))
const otherUserId = computed(() => {
  if (!activeConv.value) return null
  return activeConv.value.buyerId === appState.currentUser?.id
    ? activeConv.value.sellerId
    : activeConv.value.buyerId
})
const otherUser = computed(() => appState.users.find(u => u.id === otherUserId.value))

function selectConv(id) {
  activeConvId.value = id
  showingChat.value = true
  const conv = appState.conversations.find(c => c.id === id)
  if (conv) conv.unread = 0
  nextTick(scrollToBottom)
}

function handleSend() {
  if (!newMessage.value.trim() || !activeConvId.value) return
  sendMessage(activeConvId.value, newMessage.value.trim())
  newMessage.value = ''
  nextTick(scrollToBottom)
}

function scrollToBottom() {
  if (chatBodyRef.value) chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
}

function formatTime(d) {
  return d ? new Date(d).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : ''
}
function formatDate(d) {
  if (!d) return ''
  const today = new Date()
  const then = new Date(d)
  if (today.toDateString() === then.toDateString()) return formatTime(d)
  const diff = Math.floor((today - then) / 86400000)
  if (diff < 7) return `${diff}d ago`
  return then.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })
}

watch(activeConvId, () => nextTick(scrollToBottom), { immediate: true })
</script>

<template>
  <div class="msg-page">
    <AppTopBar title="Messages" :show-search="false" />
    <div class="msg-layout" :class="{ 'showing-chat': showingChat }">
      <!-- Conversation List -->
      <aside class="conv-list">
        <div class="conv-list-header">
          <span class="conv-list-title">Inbox</span>
          <button class="btn btn-ghost btn-sm" id="compose-btn">
            <i class="bi bi-pencil-square"></i>
          </button>
        </div>

        <div class="conv-items">
          <div
            v-for="conv in myConversations"
            :key="conv.id"
            class="conv-item"
            :class="{ 'conv-active': activeConvId === conv.id }"
            @click="selectConv(conv.id)"
            :id="`conv-${conv.id}`"
          >
            <div class="conv-avatar">
              <div class="avatar" :style="{ background: appState.users.find(u => u.id === (conv.buyerId === appState.currentUser?.id ? conv.sellerId : conv.buyerId))?.avatarColor || '#15803d' }">
                {{ appState.users.find(u => u.id === (conv.buyerId === appState.currentUser?.id ? conv.sellerId : conv.buyerId))?.avatar || 'U' }}
              </div>
              <div class="online-dot" v-if="Math.random() > 0.5"></div>
            </div>
            <div class="conv-info">
              <div class="conv-name-row">
                <span class="conv-name">{{ appState.users.find(u => u.id === (conv.buyerId === appState.currentUser?.id ? conv.sellerId : conv.buyerId))?.name }}</span>
                <span class="conv-time">{{ formatDate(conv.lastTimestamp) }}</span>
              </div>
              <div class="conv-last">{{ conv.lastMessage || 'No messages yet' }}</div>
            </div>
            <div class="conv-unread" v-if="conv.unread > 0">{{ conv.unread }}</div>
          </div>

          <div class="empty-state" v-if="myConversations.length === 0" style="padding: 40px 16px;">
            <i class="bi bi-chat-dots empty-icon"></i>
            <div class="empty-title">ไม่มีการสนทนา</div>
          </div>
        </div>
      </aside>

      <!-- Chat Window -->
      <main class="chat-window" v-if="activeConv">
        <!-- Chat Header -->
        <div class="chat-header">
          <button class="btn btn-ghost btn-sm mobile-back-btn" @click="showingChat = false" title="Back to Inbox">
            <i class="bi bi-arrow-left"></i>
          </button>
          <div class="avatar" :style="{ background: otherUser?.avatarColor || '#15803d' }">
            {{ otherUser?.avatar || 'U' }}
          </div>
          <div class="chat-header-info">
            <div class="chat-name">{{ otherUser?.name }}</div>
            <div class="chat-sub verified-badge" v-if="otherUser?.verified">
              <i class="bi bi-patch-check-fill"></i> Verified Student • Online
            </div>
          </div>
          <div class="chat-header-actions">
            <button class="btn btn-ghost btn-sm" id="call-btn"><i class="bi bi-telephone"></i></button>
            <button class="btn btn-ghost btn-sm" id="info-btn"><i class="bi bi-info-circle"></i></button>
          </div>
        </div>

        <!-- Messages -->
        <div class="chat-body" ref="chatBodyRef">
          <div class="chat-product-ref" v-if="activeConv.productTitle">
            <i class="bi bi-tag-fill text-green"></i>
            <span>Regarding: <strong>{{ activeConv.productTitle }}</strong></span>
          </div>

          <div class="date-separator">TODAY</div>

          <div
            v-for="msg in activeConv.messages"
            :key="msg.id"
            class="msg-row"
            :class="{ 'msg-mine': msg.senderId === appState.currentUser?.id }"
          >
            <div class="avatar avatar-sm" v-if="msg.senderId !== appState.currentUser?.id" :style="{ background: otherUser?.avatarColor || '#15803d' }">
              {{ otherUser?.avatar || 'U' }}
            </div>
            <div class="msg-bubble">
              <div class="msg-text">{{ msg.text }}</div>
              <div class="msg-time">{{ formatTime(msg.timestamp) }}</div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="chat-input-bar">
          <button class="chat-icon-btn" id="attachment-btn"><i class="bi bi-paperclip"></i></button>
          <button class="chat-icon-btn" id="emoji-btn"><i class="bi bi-emoji-smile"></i></button>
          <input
            v-model="newMessage"
            class="chat-input"
            type="text"
            placeholder="Type a message..."
            @keydown.enter="handleSend"
            id="message-input"
          />
          <button class="send-btn" @click="handleSend" :disabled="!newMessage.trim()" id="send-btn">
            <i class="bi bi-send-fill"></i>
          </button>
        </div>
      </main>

      <!-- No conv selected -->
      <main class="chat-empty" v-else>
        <i class="bi bi-chat-dots empty-icon"></i>
        <div class="empty-title">เลือกการสนทนา</div>
        <div class="empty-desc">คลิกที่ผู้ติดต่อทางซ้ายเพื่อเริ่มแชท</div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.msg-page { display: flex; flex-direction: column; height: 100vh; }
.msg-layout { display: flex; flex: 1; overflow: hidden; }

/* Conv List */
.conv-list {
  width: 300px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  overflow: hidden;
}
.conv-list-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--border);
}
.conv-list-title { font-size: 16px; font-weight: 700; }
.conv-items { overflow-y: auto; flex: 1; }

.conv-item {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid var(--border-light);
  position: relative;
}
.conv-item:hover { background: var(--bg-page); }
.conv-active { background: var(--green-50) !important; }
.conv-avatar { position: relative; flex-shrink: 0; }
.online-dot { position: absolute; bottom: 1px; right: 1px; width: 9px; height: 9px; border-radius: 50%; background: #22c55e; border: 2px solid #fff; }
.conv-info { flex: 1; min-width: 0; }
.conv-name-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px; }
.conv-name { font-size: 13px; font-weight: 600; }
.conv-time { font-size: 11px; color: var(--text-muted); }
.conv-last { font-size: 12px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
.conv-unread { background: #dc2626; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 10px; min-width: 18px; text-align: center; flex-shrink: 0; }

/* Chat Window */
.chat-window { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.chat-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-secondary); }
.chat-header {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-card);
  flex-shrink: 0;
}
.chat-header-info { flex: 1; }
.chat-name { font-size: 14px; font-weight: 700; }
.chat-sub { font-size: 11px; margin-top: 2px; display: flex; align-items: center; gap: 4px; }
.chat-header-actions { display: flex; gap: 4px; }

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--bg-page);
}
.chat-product-ref {
  display: flex; align-items: center; gap: 8px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-md); padding: 8px 12px;
  font-size: 12px; color: var(--text-secondary);
  margin-bottom: 8px;
}
.date-separator { text-align: center; font-size: 11px; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; margin: 8px 0; }

.msg-row { display: flex; align-items: flex-end; gap: 8px; }
.msg-mine { flex-direction: row-reverse; }
.msg-bubble {
  max-width: 70%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px 16px 16px 4px;
  padding: 10px 14px;
  position: relative;
}
.msg-mine .msg-bubble {
  background: var(--green-600);
  border: none;
  border-radius: 16px 16px 4px 16px;
  color: #fff;
}
.msg-text { font-size: 14px; line-height: 1.5; }
.msg-time { font-size: 10px; color: rgba(0,0,0,.4); margin-top: 4px; text-align: right; }
.msg-mine .msg-time { color: rgba(255,255,255,.6); }

.chat-input-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  background: var(--bg-card);
  flex-shrink: 0;
}
.chat-icon-btn { font-size: 18px; color: var(--text-secondary); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 8px; transition: background 0.15s; }
.chat-icon-btn:hover { background: var(--bg-page); color: var(--text-primary); }
.chat-input {
  flex: 1;
  padding: 10px 16px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-full);
  font-size: 14px;
  background: var(--bg-page);
  outline: none;
  transition: border-color 0.15s;
}
.chat-input:focus { border-color: var(--green-500); }
.send-btn {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--green-600);
  color: #fff;
  font-size: 16px;
  border: none;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
}
.send-btn:hover:not(:disabled) { background: var(--green-700); transform: scale(1.05); }
.send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.mobile-back-btn { display: none; }

@media (max-width: 850px) {
  .conv-list { width: 100%; display: flex; }
  .chat-window { display: none; }
  .msg-layout.showing-chat .conv-list { display: none; }
  .msg-layout.showing-chat .chat-window { display: flex; width: 100%; }
  .mobile-back-btn { display: inline-flex; align-items: center; justify-content: center; margin-right: 6px; font-size: 1.25rem; }
}
</style>
