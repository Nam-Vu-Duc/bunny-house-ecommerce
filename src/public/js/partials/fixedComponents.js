const minimize    = document.querySelector('div.minimize')
const scrollTop   = document.querySelector('div.scroll-to-top-icon')
const contact     = document.querySelector('div.contact-icon')
const dropup      = document.querySelector('div.dropup')
const chat        = document.querySelector('div.chat-icon')
const chatBox     = document.querySelector('div.chat-box')
const chatHeader  = chatBox.querySelector('div.chat-header')
const chatBody    = chatBox.querySelector('div.chat-body')
const chatContent = chatBody.querySelector('ul.chat-content')
const input       = document.querySelector('textarea.input')
const sendBtn     = document.querySelector('div.send-btn')
const notLoggedIn = document.querySelector('div.not-logged-in')
const form        = document.querySelector('form.input-form')

async function getChatData() {
  try {
    const response = await fetch(`/api/chat/${uid}`)
    if (!response.ok) throw new Error(`Response status: ${response.status}`)

    const json = await response.json();
    const messages = json.data
    chatContent.replaceChildren()
    messages.forEach((message) => {
      const chat = document.createElement('li')
      chat.textContent = message.content 
      if (message.senderId === uid) chat.setAttribute('class', 'right-content')
      chatContent.appendChild(chat)
    })
    chatContent.scrollTo(0, chatContent.scrollHeight)
  } catch (error) {
    console.error("Error fetching chat data:", error)
  }
}

if (uid) {
 chatBody.style.display = ''
 chatHeader.style.opacity = '1'
}

window.addEventListener('scroll', function() {
  document.documentElement.scrollTop >= 1000 ? scrollTop.style.display = "" : scrollTop.style.display = "none"
})
scrollTop.onclick = function() {
  window.scrollTo({top: 0, behavior: "smooth"})
}
contact.onclick = function() {
  dropup.style.display === 'none' ? dropup.style.display = 'block' : dropup.style.display = 'none'
}
chat.onclick = function() {
  if (chatBox.style.display === 'none') {
    chatBox.style.display = 'block'
    getChatData()
  } else {
    chatBox.style.display = 'none'
  } 
}
minimize.onclick = function () {
  chatBox.style.display = 'none'
} 
  
sendBtn.onclick = async function() {
  if (input.value.trim() !== '') {
    socket.emit('privateMessage', { room: uid, message: `${uid}:${input.value}` })
    const response = await fetch('/api/chat/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({value: input.value})
    })
    if (!response.ok) throw new Error(`Response status: ${response.status}`)
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

socket.on('chat-message', (id, msg) => {
  const chat = document.createElement('li')
  chat.textContent = msg
  if (id.trim() === uid) chat.classList.add('right-content')
  chatContent.appendChild(chat)
  chatContent.scrollTo(0, chatContent.scrollHeight)
})