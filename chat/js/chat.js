'use strict';

const connection = new WebSocket('wss://neto-api.herokuapp.com/chat');
connection.addEventListener('open', connectionOpen);
connection.addEventListener('close', connectionClose);
connection.addEventListener('message', connectionMessage);

let chat;
let messageBox;
let messageInput;
let messagesContent;
const messagesTemplates = {};


function showMessage(type, text) {
  let newMessage = messagesTemplates[type].cloneNode(true);

  newMessage.querySelector('.message-text').textContent = text;

  if (newMessage.querySelector('.timestamp')) {
    newMessage.querySelector('.timestamp').textContent = (new Date).toTimeString().slice(0, 5);
  }

  if (messagesTemplates['loading'].parentElement === messagesContent) {
    messagesContent.removeChild(messagesTemplates['loading']);
  }

  messagesContent.appendChild(newMessage);
}

function connectionOpen() {
  messageBox.querySelector('.message-submit').disabled = false;

  chat.querySelector('.chat-status').textContent =chat.querySelector('.chat-status').dataset.online;

  showMessage('status', 'Пользователь появился в сети');
}

function connectionClose() {
  messageBox.querySelector('.message-submit').disabled = true;

  chat.querySelector('.chat-status').textContent =chat.querySelector('.chat-status').dataset.offline;

  showMessage('status', 'Пользователь не в сети');
}

function connectionMessage(event) {
  if (event.data === '...') {
    messagesContent.append(messagesTemplates['loading']);
    return;
  }

  showMessage('personal', event.data);
}

function messageSubmit(event) {
  event.preventDefault();

  if(!messageInput.value) {
    return;
  }

  connection.send(messageInput.value);

  showMessage('message', messageInput.value);

  messageInput.value = '';
}

function init() {
  chat = document.querySelector('.chat');

  messageBox = chat.querySelector('.message-box');
  messageBox.addEventListener('submit', messageSubmit);

  for (let template of chat.querySelector('.messages-templates').querySelectorAll('.message')) {
    if (template.classList.length === 1) {
      messagesTemplates['message'] = template;

      continue;
    }
    if (template.classList.contains('loading')) {
      messagesTemplates['loading'] = template.cloneNode(true);

      continue;
    }
    if (template.classList.contains('message-personal')) {
      messagesTemplates['personal'] = template;

      continue;
    }
    if (template.classList.contains('message-status')) {
      messagesTemplates['status'] = template;
    }
  }

  messagesContent = chat.querySelector('.messages-content');

  messageInput = messageBox.querySelector('.message-input');
}

document.addEventListener('DOMContentLoaded', init);
