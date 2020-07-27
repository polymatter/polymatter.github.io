const input = document.querySelector('.input');
const log = document.querySelector('#debug');

input.onkeydown = function(keyEvent) {
    input.value += translate(keyEvent);
    keyEvent.preventDefault();
}

function translate(e) {
    return translations.filter(t => t.code === e.code && t.shiftKey === e.shiftKey)?.[0]?.value || e.key;
}

const translations = [
    { code: 'Backquote', shiftKey: false, value : '`' },
    { code: 'Backquote', shiftKey: true, value : '~' },
    { code: 'Digit1', shiftKey: true, value : 'Ă' },
    { code: 'Digit2', shiftKey: true, value : 'Â' },
    { code: 'Digit3', shiftKey: true, value : 'Ê' },
    { code: 'Digit4', shiftKey: true, value : 'Ô' },
    { code: 'Digit5', shiftKey: true, value : '%' },
    { code: 'Digit6', shiftKey: true, value : '^' },
    { code: 'Digit7', shiftKey: true, value : '&' },
    { code: 'Digit8', shiftKey: true, value : '*' },
    { code: 'Digit9', shiftKey: true, value : '(' },
    { code: 'Digit0', shiftKey: true, value : 'Đ' },
    { code: 'Digit1', shiftKey: false, value : 'ă' },
    { code: 'Digit2', shiftKey: false, value : 'â' },
    { code: 'Digit3', shiftKey: false, value : 'ê' },
    { code: 'Digit4', shiftKey: false, value : 'ô' },
    { code: 'Digit5', shiftKey: false, value : '\u0300' },
    { code: 'Digit6', shiftKey: false, value : '\u0309' },
    { code: 'Digit7', shiftKey: false, value : '\u0303' },
    { code: 'Digit8', shiftKey: false, value : '\u0301' },
    { code: 'Digit9', shiftKey: false, value : '\u0323' },
    { code: 'Digit0', shiftKey: false, value : 'đ' },
    { code: 'Equal', shiftKey: true, value : '₫' },
    { code: 'BracketLeft', shiftKey: false, value : 'ư' },
    { code: 'BracketLeft', shiftKey: true, value : 'Ư' },
    { code: 'BracketRight', shiftKey: false, value : 'ơ' },
    { code: 'BracketRight', shiftKey: true, value : 'Ơ' },
    { code: 'Quote', shiftKey: true, value : '\"' },
    { code: 'Backslash', shiftKey: false, value : '\\' },
    { code: 'Backslash', shiftKey: true, value : '|' }
];