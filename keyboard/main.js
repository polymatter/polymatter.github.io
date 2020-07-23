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
    '5': '\u0300',
    '6': '\u0309',
    '7': '\u0303',
    '8': '\u0301',
    '9': '\u0323',
    '0': 'đ',
    '=': '₫',
    '[': 'ư',
    '{': 'Ư',
    ']': 'ơ',
    '}': 'Ơ',
    '@': '\"',
    '#': '\\',
    '~': '|'
};

function translate(keyPress) {
    return translations[keyPress] || keyPress;
}

function replaceKey(e) {
    if (e.inputType === 'insertText') {
        input.value = input.value.substring(0, input.value.length - 1) + translate(e.data);
    }
}