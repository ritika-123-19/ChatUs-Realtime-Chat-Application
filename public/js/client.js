const socket = io();
console.log("Socket connected"+ socket.connected);

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector('.container')

var audio = new Audio('./img/ting.mp3');
// Function which will append event info to the contaner
const append = (name, message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'center'){
        let markup = `
        <h5>${name} ${message}</h5>
    `
    messageElement.innerHTML = markup
    messageContainer.appendChild(messageElement)
    }
    if ( position == 'left' || position == 'right'){
    let markup = `
        <h4>${name}</h4>
        <p>${message}</p>
    `
    messageElement.innerHTML = markup
    messageContainer.appendChild(messageElement)
    }
    if ( position == 'left'){
    audio.play();
    }
}


// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('newUser', name);

socket.on('user-joined', name =>{
    append(`${name}`,`joined the chat`,'center')
    scrollToBottom()
})

socket.on('receive',data =>{
    append(`${data.name}`,`${data.message}`, 'left')
    scrollToBottom()
})

// If a user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name}`,`left the chat`, 'center')
    scrollToBottom()
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You`,`${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
    scrollToBottom()
})
function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}