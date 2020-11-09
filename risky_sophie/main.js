
document.body.onload = fetchUpdateData;

const langBlock = {
  HEADING_MITIGATION: 'Mitigation',
  HEADING_CONTINGENCY: 'Contingency',
  HEADING_IMPACT: 'Impact'
}


function fetchUpdateData() {
  // fetch('https://jsonstorage.net/api/items/26a9423e-7389-4cfb-a26c-99236a8f7ba7')
  //   .then(response => response.json())
  //   .then(data => updateDisplay(data));
  fetch('https://411uchidwl.execute-api.eu-west-2.amazonaws.com/dev/risks')
    .then(response => response.json())
    .then(data => updateDisplay(data));
}

function updateDisplay(data) {
  console.log(data);
  let risks = data;
  let container = document.querySelector('#dashboard');

  risks.forEach(risk => {
    let level = document.createElement('span');
    level.classList.add(cssClassListForLevel(risk.level));
    level.classList.add('badge');
    
    let label = document.createElement('summary');
    label.appendChild(level);
    label.appendChild(document.createTextNode(risk.label));
    
    let mitigation = createSection(langBlock.HEADING_MITIGATION, 'mitigation', risk.mitigation);
    let contingency = createSection(langBlock.HEADING_CONTINGENCY, 'contingency', risk.contingency);
    let impact = createSection(langBlock.HEADING_IMPACT, 'impact', risk.impact);

    let riskui = document.createElement('details');
    riskui.appendChild(label);
    riskui.appendChild(mitigation);
    riskui.appendChild(contingency);
    riskui.appendChild(impact);
    riskui.classList.add("dashboard-element");

    container.appendChild(riskui);
  });

  function createSection(titleText, sectionClass, text = '') {
    let heading = document.createElement('div');
    heading.classList.add('title');
    heading.appendChild(document.createTextNode(titleText))
    
    let body = document.createElement('div');
    heading.classList.add('body');
    body.appendChild(document.createTextNode(text));
    
    let element = document.createElement('section');
    element.classList.add(sectionClass);
    element.appendChild(heading);
    element.appendChild(body);
    return element;
  }

  function cssClassListForLevel(text) {
    let result = 'Unknown';
    if (text === 'High') {
      result = 'badge-high';
    } else if (text === 'Medium') {
      result = 'badge-medium';
    } else if (text === 'Low') {
      result = 'badge-low';
    }
    return result;
  }
}

// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
