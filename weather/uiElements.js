/**
 * This is used to demostrate the module functionality in es6
 * 
 * This file exports values which can then by imported
 */
class Result {
    constructor(element) {
        this.ELEMENT = element;
    }

    show(displayStyle = 'block') {
        this.ELEMENT.style.display = displayStyle;
    }

    hide() {
        this.ELEMENT.style.display = 'none';
    }

    setDescription(description) {
        document.querySelector('#resultDescription').innerHTML = description;
    }

    setTemperature(temperature) {
        document.querySelector('#resultTemperature').innerHTML = temperature;
    }

    setIconURL(iconURL, altText) {
        const ICON_ELEMENT = document.querySelector('#resultIcon');
        ICON_ELEMENT.src = iconURL;
        ICON_ELEMENT.alt = altText || document.querySelector('#resultDescription').innerHTML.trim();
    }
}

export const PROMPT_BUTTON = document.querySelector('#promptButton');
export const PROMPT_CITY = document.querySelector('#promptCity');

export const RESULT = new Result(document.querySelector('#result'));