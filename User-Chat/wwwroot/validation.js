var dataInit = {
    "secret": "strongPassword",
    "access": ["uuid"],
}
var dataAsk = {
    "secret": "strongPassword",
    "question": "",
    "chat_uuid": "c8821506-0ef7-4029-a16c-c3436aa4254c",
}
var dataHistory = {
    "secret": "strongPassword",
    "uuid": "uuid",
}
var optionsInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataInit),
}
var optionsAsk = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataAsk)
}
var optionsHistory = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataHistory),
}
var savedChat = [];
var savedMessage = "";
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

function initFetch() {
    fetch(link, optionsInit)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            init(data);
        })
        .catch(function (error) {
            console.error("Error: ", error);
        })
}

function askFetch() {
    fetch(link, optionsAsk)
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
    fetch(link, optionsHistory)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

        })
}

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
    var data = "This is a generated reply";
    var chatMessages = document.getElementById("chatMessages");
    var message = document.getElementById("message").value;
    if (JSON.parse(localStorage.getItem(savedMessage)) == null) {
        savedMessage = message;
        const cardOffcanvasDiv = document.createElement("div");
        cardOffcanvasDiv.className = "card rounded-0";
        const cardOffcanvasBodyDiv = document.createElement("div");
        cardOffcanvasBodyDiv.className = "card-body";
        cardOffcanvasBodyDiv.innerHTML = message;
        cardOffcanvasDiv.appendChild(cardOffcanvasBodyDiv);
        offcanvasBar.appendChild(cardOffcanvasDiv);
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
    localStorage.setItem(savedMessage, JSON.stringify(savedChat));
    chatMessages.appendChild(cardDiv);
    replyMessage(data, savedMessage, chatMessages);
}

function replyMessage(data, savedMessage, chatMessages) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card text-bg-light rounded-0 w-50 p-1";
    cardDiv.style.marginLeft = "300px";
    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.className = "card-body";
    cardBodyDiv.innerHTML = data;
    cardDiv.appendChild(cardBodyDiv);
    savedChat.push(data);
    localStorage.setItem(savedMessage, JSON.stringify(savedChat));
    chatMessages.appendChild(cardDiv);
}

function createChatMessages() {
    const createDiv = document.createElement("div");
    createDiv.id = "chatMessages";
    chatField.insertBefore(createDiv, askField);
}

send.addEventListener("click", sendMessage);
inputInit.addEventListener("click", init);
