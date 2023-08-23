const socket = io();

var username;
var chats = document.querySelector(".chats");
var users_list = document.querySelector(".users-list");
var users_count = document.querySelector(".users-count");
var user_msg = document.querySelector("#user-msg");
var msg_send = document.querySelector("#msg-send");

do{
    username = prompt("enter your name: ");
}while(!username);
// it will called when user will join......
socket.emit("new-user-joined",username);

// notify when user is joined......
socket.on("user-connected",(socket_name)=>{
    userJoinLeft(socket_name,"joined"); //here joined is simple status, this fun call when user joined or left the chat

});

//  function to create join/left div
function userJoinLeft(name,status){
    let div = document.createElement("div")
    div.classList.add('user-join');
    let content = ` <p><b>${name}</b> ${status} the chat</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
};

// notify that user has left
socket.on("user-disconnected",(user)=>{
    userJoinLeft(user,"left");
})


//user-window....updating user-list and count
socket.on("user-list",(users)=>{
    users_list.innerHTML="";
    users_arr= Object.values(users);
    for(let i = 0; i<users_arr.length;i++){
        let p = document.createElement("p");
        p.innerText = users_arr[i];
        users_list.appendChild(p);
    }
    
    users_count.innerHTML = users_arr.length;
});

// msg sending
msg_send.addEventListener("click",()=>{
    let data ={
        user: username,
        msg:user_msg.value
    };

    if(user_msg.value!=''){
        appendMessage(data,"outgoing");
        socket.emit("message",data);
        user_msg.value="";
    }
});


function appendMessage(data,status){
    let div = document.createElement("div");
    div.classList.add("message",status);
    let content = `<h5>${data.user}</h5>
                    <p>${data.msg}</p>`;
    div.innerHTML = content;
    chats.appendChild(div);

}


socket.on("message",(data)=>{
    appendMessage(data,"incoming")
});