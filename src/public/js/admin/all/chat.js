importLinkCss('/css/admin/allChats.css')

const chatBody    = document.querySelector('div.chat-body')
const chatHeader  = chatBody.querySelector('div.chat-header')
const chatContent = document.querySelector('ul.chat-content')
const input       = document.querySelector('textarea.input')
const sendBtn     = document.querySelector('div.send-btn')
const form        = document.querySelector('form.input-form')
const chatList    = document.querySelector('div.chat-list').querySelectorAll('div.item')
let chatId = ''

socket.emit('joinRoom', {id: uid, room: 'admin-room'})

async function getChatData(adminId, userId, userName, chatContent) {
  try {
    const response = await fetch(`/admin/all-chats/${userId}`)
    if (!response.ok) throw new Error(`Response status: ${response.status}`)

    const json = await response.json();
    const messages = json.data
    chatId = json.chatId
    
    chatHeader.querySelector('div.name').textContent = userName
    chatHeader.querySelector('div.last-active').textContent = 'active now'
    chatHeader.style.opacity = 1
    chatContent.replaceChildren()
    messages.forEach((message) => {
      const chat = document.createElement('li')
      chat.textContent = message.content 
      if (message.senderId === adminId) chat.setAttribute('class', 'right-content')
      chatContent.appendChild(chat)
    })
    chatContent.scrollTo(0, chatContent.scrollHeight)
  } catch (error) {
    console.error("Error fetching chat data:", error)
  }
}

function checkActive(index) {
  chatList.forEach((item, i) => {
    if (i === index) item.classList.add('active')
    else item.classList.remove('active')
  })
}

chatList.forEach((chat, index) => {
  chat.onclick = function() {
    const userId = chat.id
    const userName = chat.querySelector('div.name').textContent
    input.id = userId
    getChatData(uid, userId, userName, chatContent)
    checkActive(index)
  }
})

sendBtn.onclick = async function() {
  if (input.value.trim() !== '') {
    console.log(input.id)
    socket.emit('privateMessage', { room: input.id, message: `${uid}:${input.value}` })
    const response = await fetch('/admin/all-chats/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({value: input.value, chatId: chatId})
    })
    if (!response.ok) throw new Error(`Response status: ${response.status}`)
    const json = await response.json()
    console.log(json)
    input.value = ''
    sendBtn.classList.add('not-allowed')
    chatContent.scrollTo(0, chatContent.scrollHeight)
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
  chatContent.scrollTo(0, chatContent.scrollHeight)
})