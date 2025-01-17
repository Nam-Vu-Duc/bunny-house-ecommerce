importLinkCss('/css/user/fixedComponents.css')

const socket = io('http://localhost:3000', {
  path: "/socket.io"
})
const minimize    = document.querySelector('div.minimize')
const chat        = document.querySelector('div.chat-icon')
const chatBox     = document.querySelector('div.chat-box')
const chatBody    = document.querySelector('div.chat-body')
const chatContent = document.querySelector('ul.chat-content')
const input       = document.querySelector('textarea.input')
const sendBtn     = document.querySelector('div.send-btn')
const notLoggedIn = document.querySelector('div.not-logged-in')
const form = document.querySelector('form.input-form')

if (userId) chatBody.style.display = ''
chat.onclick = function() {chatBox.style.display === 'none' ? chatBox.style.display = '' : chatBox.style.display = 'none'}
minimize.onclick = function () {chatBox.style.display = 'none'}

// if (userId === '65eddb9e7abb421b88771b35') {
//   socket.emit('joinRoom', '67682d1ef5b2b2e80b0f439c')
// } else {
//   socket.emit('joinRoom', 'guest')
// } 
  
sendBtn.onclick = function() {
  if (input.value.trim() !== '') {
    socket.emit('privateMessage', { room: '12345', message: `${userId}:${input.value}` })
    // {{!-- socket.emit('chat message', `${userId}:${input.value}`); --}}
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
  if (id.trim() === userId) {
    chat.setAttribute('class', 'right-content')
  }  
    chatContent.appendChild(chat);
});

async function getChatData() {
  try {
    const response = await fetch(`/api/chat/${userId}`)
    if (!response.ok) throw new Error(`Response status: ${response.status}`)

    const json = await response.json();
    const messages = json.data

    messages.forEach((message) => {
      const chat = document.createElement('li')
      chat.textContent = message.content 
      if (message.senderId === userId) chat.setAttribute('class', 'right-content')
      chatContent.appendChild(chat)
    })
  } catch (error) {
    console.error("Error fetching chat data:", error)
  }
}

if (syncData) getChatData()