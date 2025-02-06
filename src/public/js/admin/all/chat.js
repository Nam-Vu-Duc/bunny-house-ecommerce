importLinkCss('/css/admin/allChats.css')

const chatBody    = document.querySelector('div.chat-body')
const chatContent = document.querySelector('ul.chat-content')
const input       = document.querySelector('textarea.input')
const sendBtn     = document.querySelector('div.send-btn')
const form        = document.querySelector('form.input-form')
const chatList    = document.querySelector('div.chat-list').querySelectorAll('div.item')

async function getChatData(adminId, userId, chatContent) {
  try {
    const response = await fetch(`/admin/all-chats/${userId}`)
    if (!response.ok) throw new Error(`Response status: ${response.status}`)

    const json = await response.json();
    const messages = json.data
    
    chatContent.replaceChildren()
    messages.forEach((message) => {
      const chat = document.createElement('li')
      chat.textContent = message.content 
      if (message.senderId === adminId) chat.setAttribute('class', 'right-content')
      chatContent.appendChild(chat)
    })
  } catch (error) {
    console.error("Error fetching chat data:", error)
  }
}

chatList.forEach((chat, index) => {
  chat.onclick = function() {
    const userId = chat.id
    getChatData(uid, userId, chatContent)
  }
})
  
socket.emit('joinRoom', 'admin-room')

sendBtn.onclick = async function() {
  if (input.value.trim() !== '') {
    socket.emit('privateMessage', { room: '12345', message: `${uid}:${input.value}` })
    const response = await fetch('/admin/all-chats/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({value: input.value})
    })
    if (!response.ok) throw new Error(`Response status: ${response.status}`)
    const json = await response.json()
    console.log(json)
    input.value = ''
    sendBtn.classList.add('not-allowed')
  }
}

input.addEventListener('input', function() {
  if (input.value.trim() !== '') sendBtn.classList.remove('not-allowed') 
  else sendBtn.classList.add('not-allowed')
})

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter" && input.value.trim() !== '') {
    sendBtn.click()
    input.value = ''
    sendBtn.classList.add('not-allowed')
  }
})

socket.on('chat message', (id, msg) => {
  console.log(`${id},${msg}`)
  const chat = document.createElement('li')
  chat.textContent = msg
  if (id.trim() === uid) chat.setAttribute('class', 'right-content') 
  chatContent.appendChild(chat)
})