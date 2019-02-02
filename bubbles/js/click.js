'use strict';

let connection;

function onClick(event) {
  connection.send(JSON.stringify({
    'x': event.offsetX,
    'y': event.offsetY
  }));
}

function init() {
  connection = new WebSocket('wss://neto-api.herokuapp.com/mouse');

  document.getElementsByTagName('canvas')[0].addEventListener('click', onClick);

  showBubbles(connection);
}

document.addEventListener('DOMContentLoaded', init);
