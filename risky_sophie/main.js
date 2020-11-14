
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
    .then(data => { 
      updateDisplay(data)
    });

  document.querySelector('body > header').addEventListener('click', function() {
    let dashboard = document.querySelector('.dashboard');
    dashboard.classList.remove('hidden');
  });
}

function updateDisplay(risks) {
  let listOfRisks = document.querySelector('#dashboard');
  let detailedRisks = document.querySelector('body');

  risks.forEach(risk => {
    let summaryOfRisk = createRiskSummaryElement(risk);
    listOfRisks.appendChild(summaryOfRisk);

    let detailOfRisk = createRiskDetailElement(risk);
    detailedRisks.appendChild(detailOfRisk);
  });

  function createRiskDetailElement(risk) {
    let detailOfRisk = document.createElement('article');
    detailOfRisk.classList.add('hidden');
    detailOfRisk.classList.add('risk-detail-hidden');
    detailOfRisk.classList.add('risk-detail-' + risk.id);
    
    let level = document.createElement('span');
    level.classList.add(cssClassListForLevel(risk.level));
    level.classList.add('badge');
    detailOfRisk.appendChild(level);

    let label = document.createElement('span');
    label.classList.add('dashboard-label');
    label.appendChild(document.createTextNode(risk.label));
    detailOfRisk.appendChild(label);

    detailOfRisk.appendChild(createSection(langBlock.HEADING_MITIGATION, 'mitigation', risk.mitigation));
    detailOfRisk.appendChild(createSection(langBlock.HEADING_CONTINGENCY, 'contingency', risk.contingency));
    detailOfRisk.appendChild(createSection(langBlock.HEADING_IMPACT, 'impact', risk.impact));

    return detailOfRisk;
  }

  function createRiskSummaryElement(risk) {
    let summaryOfRisk = document.createElement('section');
    summaryOfRisk.classList.add("dashboard-element");
    
    let level = document.createElement('span');
    level.classList.add(cssClassListForLevel(risk.level));
    level.classList.add('badge');
    summaryOfRisk.appendChild(level);

    let label = document.createElement('span');
    label.classList.add('dashboard-label');
    label.appendChild(document.createTextNode(risk.label));
    summaryOfRisk.appendChild(label);

    summaryOfRisk.addEventListener('click', () => { showDetail(risk.id)(); hideDashboard()() });

    return summaryOfRisk;
  }

  function hideDashboard() {
    return function() {
      let dashboard = document.querySelector('.dashboard');
      dashboard.classList.add('hidden');
    }
  }

  function showDetail(riskId) {
    return function() {
      //hide any previously shown detail risk (there would be at most one)
      let shownDetailRisk = document.querySelector('.risk-detail-shown');
      if (shownDetailRisk) {
        shownDetailRisk.classList.add('risk-detail-hidden');
        shownDetailRisk.classList.remove('risk-detail-shown');
      }

      let detailRisk = document.querySelector('.risk-detail-' + riskId);
      detailRisk.classList.remove('risk-detail-hidden');
      detailRisk.classList.add('risk-detail-shown');
    }
  }

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
