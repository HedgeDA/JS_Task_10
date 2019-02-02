'use strict';

let connection;
let counter;
let errors;

function connectionMessage(event) {
  let message;

  try {
    message = JSON.parse(event.data);
  } catch (error) {
    return;
  }

  counter.textContent = message['connections'];
  errors.value = message['errors'];
}

function init() {
  connection = new WebSocket('wss://neto-api.herokuapp.com/counter');

  counter = document.querySelector('.counter');
  errors = document.querySelector('.errors');

  connection.addEventListener('message', connectionMessage);
}

function beforeunload() {
  connection.close(1000);
}

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('beforeunload', beforeunload);