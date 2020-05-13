import * as ELEMENTS from './uiElements.js';
import { searchWeather } from './fetch.js';

ELEMENTS.PROMPT_BUTTON.addEventListener('click', () => searchWeather(ELEMENTS.PROMPT_CITY.value))