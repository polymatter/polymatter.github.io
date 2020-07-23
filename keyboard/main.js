const input = document.querySelector('.input');
const log = document.querySelector('#debug');

input.onkeydown = logKey;

function logKey(e) {
  log.textContent += ` ${e.code}`;
}