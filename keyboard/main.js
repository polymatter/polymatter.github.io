const input = document.querySelector('.input');
const log = document.querySelector('#debug');

input.oninput = replaceKey;

const translations = {
    '!': 'Ă',
    '1': 'ă',
    '2': 'â',
    '3': 'ê'
};

function translate(keyPress) {
    return translations[keyPress] || keyPress;
}

function replaceKey(e) {
    if (e.inputType === 'insertText') {
        input.value = input.value.substring(0, input.value.length - 2) + translate(e.data);
    }
}