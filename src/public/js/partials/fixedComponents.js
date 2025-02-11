const scrollTop   = document.querySelector('div.scroll-to-top-icon')
const contact     = document.querySelector('div.contact-icon')
const dropup      = document.querySelector('div.dropup')
const chat        = document.querySelector('div.chat-icon')
const AIchat      = document.querySelector('div.chatbot-icon')

const chatBox     = document.querySelector('div.chat-box')
const minimize    = chatBox.querySelector('div.minimize')
const chatHeader  = chatBox.querySelector('div.chat-header')
const chatBody    = chatBox.querySelector('div.chat-body')
const chatContent = chatBox.querySelector('ul.chat-content')
const input       = chatBox.querySelector('textarea.input')
const sendBtn     = chatBox.querySelector('div.send-btn')
const notLoggedIn = chatBox.querySelector('div.not-logged-in')
const form        = chatBox.querySelector('form.input-form')

const AIchatBox     = document.querySelector('div.ai-chat-box')
const AIminimize    = AIchatBox.querySelector('div.minimize')
const AIchatHeader  = AIchatBox.querySelector('div.chat-header')
const AIchatBody    = AIchatBox.querySelector('div.chat-body')
const AIchatContent = AIchatBox.querySelector('ul.chat-content')
const AIinput       = AIchatBox.querySelector('textarea.input')
const AIsendBtn     = AIchatBox.querySelector('div.send-btn')
const AInotLoggedIn = AIchatBox.querySelector('div.not-logged-in')
const AIform        = AIchatBox.querySelector('form.input-form')

if (uid) {
  chatBody.style.display     = ''
  AIchatBody.style.display   = ''
  chatHeader.style.opacity   = '1'
  AIchatHeader.style.opacity = '1'
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
      message.senderId === uid ? chat.setAttribute('class', 'right-content') : chat.setAttribute('class', 'left-content')
      chatContent.appendChild(chat)
    })
    chatContent.scrollTo(0, chatContent.scrollHeight)
  } catch (error) {
    console.error("Error fetching chat data:", error)
  }
}
async function getAIChatData() {
  try {
    const response = await fetch(`/api/chat/ai/${uid}`)
    if (!response.ok) throw new Error(`Response status: ${response.status}`)

    const json = await response.json();
    const messages = json.data
    AIchatContent.replaceChildren()
    messages.forEach((message) => {
      const chat = document.createElement('li')
      chat.textContent = message.content 
      message.senderId === uid ? chat.setAttribute('class', 'right-content') : chat.setAttribute('class', 'left-content')
        
      AIchatContent.appendChild(chat)
    })
    AIchatContent.scrollTo(0, AIchatContent.scrollHeight)
  } catch (error) {
    console.error("Error fetching chat data:", error)
  }
}

// icon 
var isUsed = false
chat.onclick = function() {
  if (chatBox.style.display === 'none') {
    chatBox.style.display = 'block'
    if (isUsed) {
      chatBox.style.right = '370px'
    } else {
      chatBox.style.right = '60px'
      isUsed = true
    }
    getChatData()
  } else {
    chatBox.style.display = 'none'
    chatBox.style.right === '60px' ? isUsed = false : ''
  } 
}
AIchat.onclick = function() {
  if (AIchatBox.style.display === 'none') {
    AIchatBox.style.display = 'block'
    if (isUsed) {
      AIchatBox.style.right = '370px'
    } else {
      AIchatBox.style.right = '60px'
      isUsed = true
    }
    getAIChatData()
  } else {
    AIchatBox.style.display = 'none'
    AIchatBox.style.right === '60px' ? isUsed = false : ''
  } 
}

// minimize button
minimize.onclick = function () {
  chatBox.style.display = 'none'
  chatBox.style.right === '60px' ? isUsed = false : isUsed = true
} 
AIminimize.onclick = function () {
  AIchatBox.style.display = 'none'
  AIchatBox.style.right === '60px' ? isUsed = false : isUsed = true
} 
  
// send message
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
AIsendBtn.onclick = async function() {
  if (AIinput.value.trim() !== '') {
    const prompt = AIinput.value
    AIinput.value = ''
    AIsendBtn.classList.add('not-allowed')

    const chat = document.createElement('li')
    chat.textContent = prompt
    AIchatContent.appendChild(chat)
    chat.classList.add('right-content')

    const answer = document.createElement('li')
    answer.textContent = 'Loading...'
    answer.classList.add('left-content')
    AIchatContent.appendChild(answer)
    AIchatContent.scrollTo(0, AIchatContent.scrollHeight)

    const response = await fetch('/api/chat/ai/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({prompt: prompt})
    })
    if (!response.ok) throw new Error(`Response status: ${response.status}`)
    const json = await response.json()
    console.log(json.answer)

    answer.textContent = json.answer
    AIchatContent.scrollTo(0, AIchatContent.scrollHeight)
  }
}

// input event
input.addEventListener('input', function() {
  if (input.value.trim() !== '') sendBtn.classList.remove('not-allowed') 
  else sendBtn.classList.add('not-allowed')
})
AIinput.addEventListener('input', function() {
  if (AIinput.value.trim() !== '') AIsendBtn.classList.remove('not-allowed') 
  else AIsendBtn.classList.add('not-allowed')
})

// submit event
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter" && input.value.trim() !== '') {
    sendBtn.click()
  }
})
AIinput.addEventListener("keypress", function(event) {
  if (event.key === "Enter" && AIinput.value.trim() !== '') {
    AIsendBtn.click()
  }
})

socket.on('chat-message', (id, msg, room) => {
  const chat = document.createElement('li')
  chat.textContent = msg
  if (id.trim() === uid) chat.classList.add('right-content')
  chatContent.appendChild(chat)
  chatContent.scrollTo(0, chatContent.scrollHeight)
})