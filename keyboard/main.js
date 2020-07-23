const input = document.querySelector('.input');
const log = document.querySelector('#debug');

input.oninput = replaceKey;

const translations = {
    '`': '`',
    '¬': '~',
    '!': 'Ă',
    '\"': 'Â',
    '£': 'Ê',
    '$': 'Ô',
    '%': '%',
    '^': '^',
    '&': '&',
    '*': '*',
    '(': '(',
    ')': 'Đ',
    '1': 'ă',
    '2': 'â',
    '3': 'ê',
    '4': 'ô',
    '5': '',
    '6': '',
    '7': '',
    '8': '',
    '9': '',
    '0': 'đ'
};

function translate(keyPress) {
    return translations[keyPress] || keyPress;
}

function replaceKey(e) {
    if (e.inputType === 'insertText') {
        input.value = input.value.substring(0, input.value.length - 1) + translate(e.data);
    }
}