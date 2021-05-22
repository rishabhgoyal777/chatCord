const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages'); // for automatic scrolling down upon new messages
const roomName = document.getElementById('room-name');  // for info about roomname
const userList = document.getElementById('users');      // and users

//get username and room from url
const {username, room} = Qs.parse(location.search, {   //takes values of username an room from url
    ignoreQueryPrefix: true  // ignoers special characters ? , & etc
});

console.log(username, room);

const socket = io();

//join chatroom
socket.emit('joinRoom', { username, room});

//get rooom and users
socket.on('roomUsers', ( { room, users} ) => {
    outputRoomName(room);
    outputUsers(users);
});

//message from server
socket.on('message', Message => {  //message is keyword for catching emit while Message is the string passed as paramter
    console.log(Message);    //this prints on client side console (chrome)
    outputMessage(Message);  // adding in chat box

    chatMessages.scrollTop = chatMessages.scrollHeight;  // for automatic scrolling down upon new messages
});

//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();      // default submit form submits to file

    const msg = e.target.elements.msg.value; //get message text  // chat.html has id msg for input messages

    // console.log(msg); // console logging client side

    socket.emit("chatMessage", msg);  // emit message to server

    //empty input after submiting 1 message
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');  //create new div// every message in chat html is a new div
    div.classList.add('message');       //with class message with this innerHtml, (changing the message)
    div.innerHTML = `<p class="meta">${message.username} <span> ${message.time}</span></p>   
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div); //adding this div to the parent of messages in chat html which has class chat-messages 
}

//add room name to dom
function outputRoomName(room){
    roomName.innerText = room;
}

// add users to dom
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => ` <li> ${user.username}</li>`).join('')}
    `;  //The map() method calls the provided function once for each element in an array, in order.
}