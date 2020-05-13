import * as ELEMENTS from './uiElements.js';
import { searchWeather } from './fetch.js';

console.log('TEST SECRET', secrets?.TEST_SECRET)

ELEMENTS.PROMPT_BUTTON.addEventListener('click', () => searchWeather(ELEMENTS.PROMPT_CITY.value))