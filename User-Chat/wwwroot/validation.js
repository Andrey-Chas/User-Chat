var dataInit = {
    "secret": "",
    "access": ["d8fbfab8-e0d1-4aab-bc0d-2671b973031d"],
}
var dataAsk = {
    "secret": "",
    "question": "",
    "chat_uuid": "e5ad940c-4b37-4c9f-bb59-5fdf3d2c2e4d",
}
var dataHistory = {
    "uuid": "6b7583f2-d641-4db4-875b-2331e40a5008",
}
var optionsInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "",
}
var optionsAsk = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "",
}
var optionsHistory = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataHistory),
}
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo2ODk5LCJ1c2VybmFtZSI6ImFuZHJjaGFzNzc3QGdtYWlsLmNvbSIsImV4cCI6MTY5NDE3ODkzNCwiZW1haWwiOiJhbmRyY2hhczc3N0BnbWFpbC5jb20ifQ.6hZJtsFsEHx7llO6-zWFToR44p8xev97v9CcXxAG9a0";
var optionsToken = {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "JWT " + token },
    body: "",
}
var savedChat = [];
var keyChat = [];
var savedMessage = "";
var savedChats = "";
var message = document.getElementById("message");
var action = "";
var dataFromInit = "";
var count = 0;

const link = "https://someserver/";
const askField = document.getElementById("askField");
const inputInit = document.getElementById("init");
const send = document.getElementById("sendMessage");
const chatField = document.getElementById("chatField");
const offcanvasBar = document.getElementById("offcanvasBar");
const noSavedConversations = document.getElementById("noSavedConversations");

if (JSON.parse(localStorage.getItem("isSavedChat")) == true) {
    noSavedConversations.style.visibility = "collapse";
}

if (localStorage.getItem("keyChat") != null) {
    keyChat = JSON.parse(localStorage.getItem("keyChat"));
    loadHistory();
}

async function initFetch() {
    var dataToken = {
        "action": "initialize",
        "meetings": ["d8fbfab8-e0d1-4aab-bc0d-2671b973031d"],
    }
    optionsToken.body = JSON.stringify(dataToken);
    var response = await fetch("https://blue.wudpecker.io/profile/microservice-token/", optionsToken);
    var data = await response.json();
    dataInit.secret = data.token;
    optionsInit.body = JSON.stringify(dataInit);
    fetch("https://ask.wudpecker.io/initialize", optionsInit)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            dataFromInit = data;
            init(data);
        })
        .catch(function (error) {
            console.error("Error: ", error);
        })
}

async function askFetch() {
    var dataToken = {
        "action": "ask",
        "model": "3.5",
    }
    optionsToken.body = JSON.stringify(dataToken);
    var response = await fetch("https://blue.wudpecker.io/profile/microservice-token/", optionsToken);
    var data = await response.json();
    dataAsk.secret = data.token;
    optionsAsk.body = JSON.stringify(dataAsk);
    fetch("https://ask.wudpecker.io/ask_question", optionsAsk)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            replyMessage(data);
        })
        .catch(function (error) {
            console.error("Error: ", error);
        })
}

function historyFetch() {
    fetch("https://ask.wudpecker.io/history", optionsHistory)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            loadHistoryChat(data);
        })
        .catch(function (error) {
            console.error("Error: ", error);
        })
}

//function tokenFetch() {
//    fetch("https://blue.wudpecker.io/profile/microservice-token/", optionsToken)
//        .then(function (response) {
//            return response.json();
//        })
//        .then(function (data) {
//            if (action == "initialize") {
//                data.token;
//            }
//            else {
//                dataAsk.secret = data.token;
//            }
//        })
//        .catch(function (error) {
//            console.error("Error: ", error);
//        })
//}

function init(data) {
    if (data != "unauthorized") {
        savedMessage = "";
        savedChat = [];
        askField.style.visibility = "visible";
        var chatMessages = document.getElementById("chatMessages");
        if (chatMessages != null) {
            chatMessages.remove();
        }
        createChatMessages();
    }
    else {
        console.log("Unauthorized user");
    }
}

function sendMessage() {
    noSavedConversations.style.visibility = "collapse";
    localStorage.setItem("isSavedChat", JSON.stringify(true));
    var chatMessages = document.getElementById("chatMessages");
    message = document.getElementById("message").value;
    if (JSON.parse(localStorage.getItem(dataFromInit)) == null) {
        savedMessage = message;
        var chatInfo = {
            "message": savedMessage,
            "uuid": dataFromInit,
        }
        keyChat.push(chatInfo);
        const cardOffcanvasDiv = document.createElement("div");
        cardOffcanvasDiv.className = "card text-bg-info rounded-0";
        const cardOffcanvasBodyDiv = document.createElement("div");
        cardOffcanvasBodyDiv.className = "card-body";
        cardOffcanvasBodyDiv.id = dataFromInit;
        cardOffcanvasBodyDiv.innerHTML = savedMessage;
        cardOffcanvasDiv.appendChild(cardOffcanvasBodyDiv);
        offcanvasBar.appendChild(cardOffcanvasDiv);
        savedChats = document.querySelectorAll(".text-bg-info");
        localStorage.setItem("keyChat", JSON.stringify(keyChat));
        savedChats.forEach(item => {
            item.addEventListener("click", loadHistoryChat);
        });
    }
    dataAsk.question = message;
    const cardDiv = document.createElement("div");
    cardDiv.className = "card rounded-0 w-50 p-1";
    cardDiv.style.marginLeft = "300px";
    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.className = "card-body";
    cardBodyDiv.innerHTML = dataAsk.question;
    cardDiv.appendChild(cardBodyDiv);
    savedChat.push(dataAsk.question);
    localStorage.setItem(dataFromInit, JSON.stringify(savedChat));
    chatMessages.appendChild(cardDiv);
    askFetch();
}

function replyMessage(data) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card text-bg-light rounded-0 w-50 p-1";
    cardDiv.style.marginLeft = "300px";
    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.className = "card-body";
    cardBodyDiv.innerHTML = data.response;
    cardDiv.appendChild(cardBodyDiv);
    savedChat.push(data.response);
    localStorage.setItem(dataFromInit, JSON.stringify(savedChat));
    chatMessages.appendChild(cardDiv);
}

function loadHistory() {
    keyChat.forEach(item => {
        const cardOffcanvasDiv = document.createElement("div");
        cardOffcanvasDiv.className = "card text-bg-info rounded-0";
        const cardOffcanvasBodyDiv = document.createElement("div");
        cardOffcanvasBodyDiv.className = "card-body";
        cardOffcanvasBodyDiv.id = item.uuid;
        cardOffcanvasBodyDiv.innerHTML = item.message;
        cardOffcanvasDiv.appendChild(cardOffcanvasBodyDiv);
        offcanvasBar.appendChild(cardOffcanvasDiv);
    });
    savedChats = document.querySelectorAll(".text-bg-info");
    savedChats.forEach(item => {
        item.addEventListener("click", loadHistoryChat);
    });
}

function loadHistoryChat(event) {
    var isReply = false;
    var chatMessages = document.getElementById("chatMessages");
    if (chatMessages != null) {
        chatMessages.remove();
    }
    askField.style.visibility = "visible";
    createChatMessages();
    chatMessages = document.getElementById("chatMessages");
    savedChat = [];
    dataFromInit = event.target.id;
    savedChat = JSON.parse(localStorage.getItem(event.target.id));
    savedChat.forEach(item => {
        const cardDiv = document.createElement("div");
        if (isReply) {
            cardDiv.className = "card text-bg-light rounded-0 w-50 p-1";
            isReply = false;
        }
        else {
            cardDiv.className = "card rounded-0 w-50 p-1";
            isReply = true;
        }
        cardDiv.style.marginLeft = "300px";
        const cardBodyDiv = document.createElement("div");
        cardBodyDiv.className = "card-body";
        cardBodyDiv.innerHTML = item;
        cardDiv.appendChild(cardBodyDiv);
        chatMessages.appendChild(cardDiv);
    });
}

function pressEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        send.click();
    }
}

function createChatMessages() {
    const createDiv = document.createElement("div");
    createDiv.id = "chatMessages";
    chatField.insertBefore(createDiv, askField);
}

message.addEventListener("keypress", pressEnter);
send.addEventListener("click", sendMessage);
inputInit.addEventListener("click", initFetch);
