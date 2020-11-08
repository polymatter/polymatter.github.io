
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
    let label = document.createElement('summary');
    label.appendChild(document.createTextNode(risk.Label));
    
    let riskui = document.createElement('details');
    riskui.appendChild(label);
    riskui.classList = ["dashboard-element"];

    container.appendChild(riskui);
  });
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
