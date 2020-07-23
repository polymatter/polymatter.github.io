const input = document.querySelector('.input');
const log = document.querySelector('#debug');

input.onkeydown = logKey;

function logKey(e) {
  log.textContent += ` ${e.code}`;
  input.textContent = input.textContent.substring(0, input.textContent.length - 2) + e.code;
  console.log(e);
}