
document.body.onload = fetchUpdateData;

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
    level.classList = cssClassListForLevel(risk.level);
    
    let label = document.createElement('summary');
    label.appendChild(level);
    label.appendChild(document.createTextNode(risk.label));
    
    let mitigation = createDivElement(risk.mitigation);
    let contingency = createDivElement(risk.contingency);
    let impact = createDivElement(risk.impact);

    let riskui = document.createElement('details');
    riskui.appendChild(label);
    riskui.appendChild(mitigation);
    riskui.appendChild(contingency);
    riskui.appendChild(impact);
    riskui.classList = ["dashboard-element"];

    container.appendChild(riskui);
  });

  function createDivElement(text = '', cssClass) {
    let element = document.createElement('div');
    element.appendChild(document.createTextNode(text));
    if (cssClass) {
      element.classList = [cssClass];
    }
  }

  function cssClassListForLevel(text) {
    let result = [];
    if (text === 'High') {
      result.push('badge-high')
    } else if (text === 'Medium') {
      result.push('badge-medium');
    } else if (text === 'Low') {
      result.push('badge-low');
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
