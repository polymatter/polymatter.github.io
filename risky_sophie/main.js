
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
}

function updateDisplay(risks) {
  let listOfRisks = document.querySelector('#dashboard');
  let detailedRisks = document.querySelector('.content');

  risks.forEach(risk => {
    let summaryOfRisk = createRiskSummaryElement(risk);
    listOfRisks.appendChild(summaryOfRisk);

    let detailOfRisk = createRiskDetailElement(risk);
    detailedRisks.appendChild(detailOfRisk);
  });

  function createRiskDetailElement(risk) {
    function fixSlideRightBug(keyframes, dummy_keyframe = { transform: 'translateX(0%)', opacity: 0 }) {
      // DESCRIPTION: Animation will show everything else sliding in from the left rather than the element sliding from the right
      // WHY: Don't Know. Can't find any relevant stackoverflow or community posts. Doesn't seem to be a purpose in the Web Animations API documentation on MDN.
      // WHAT IT AFFECTS: In Chrome, Edge and Firefox. In Firefox it additionally stutters while the scrollbar seems to update
      // SOLUTION: Add a keyframe at the start before sliding in from the right
      // WHY SOLUTION LIKE THIS: It keeps the code intent, while also providing a function for the fix if there are other slide right animations needed

      keyframes.unshift(dummy_keyframe);
      keyframes[1].offset = 0.01;
      return keyframes;
    }

    let detailOfRisk = document.createElement('article');
    detailOfRisk.setAttribute('id', risk.id);
    detailOfRisk.classList.add('risk-detail');
    detailOfRisk.classList.add('hide');
    
    let backlink = document.createElement('a');
    backlink.setAttribute('href', '#dashboard');
    backlink.addEventListener('click', e => {
      const dashboard = document.querySelector('#dashboard');
      dashboard.classList.remove('hide');

      const dashboardAnim = dashboard.animate(
        fixSlideRightBug([{ opacity: 0, transform: 'translateX(100%)'}, { opacity: 1, transform: 'translateX(0%)' }]),
        { duration: 1000, easing: 'ease-in-out', fill: 'both' },
      );
      dashboardAnim.addEventListener('finish', () => {
        dashboardAnim.commitStyles();
        dashboard.setAttribute('style', '');
      });

      const riskDetail = document.querySelector('#' + risk.id);
      riskDetail.classList.remove('hide');
      riskDetail.classList.add('positioned');
      const riskDetailAnim = riskDetail.animate(
        [{ transform: 'translateX(0%)' }, { transform: 'translateX(-100%)'}],
        { delay: 0, duration: 1000, easing: 'ease-in-out', fill: 'both' }
        );
        riskDetailAnim.addEventListener('finish', () => {
          riskDetailAnim.commitStyles();
          riskDetail.setAttribute('style', '');
          riskDetail.classList.add('hide');
          riskDetail.classList.remove('positioned');
      });
    })
    backlink.appendChild(document.createTextNode('Back to Dashboard'));
    detailOfRisk.appendChild(backlink);

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

    summaryOfRisk.addEventListener('click', e => {
      const dashboard = document.querySelector('#dashboard');
      dashboard.setAttribute('style', '');
      const dashboardAnim = dashboard.animate(
        [{ opacity: 1, transform: 'translateX(0%)' }, { opacity: 0, transform: 'translateX(100%)' }],
        { duration: 1000, easing: 'ease-in-out', fill: 'both' },
      );
      dashboardAnim.addEventListener('finish', () => {
        dashboardAnim.commitStyles();
        dashboard.classList.add('hide');
      });

      const riskDetail = document.querySelector('#' + risk.id);
      riskDetail.classList.remove('hide');
      riskDetail.classList.add('positioned');
      riskDetail.setAttribute('style', '');
      const riskDetailAnim = riskDetail.animate(
        [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0%)'}],
        { delay: 0, duration: 1000, easing: 'ease-in-out', fill: 'both' }
      );
      riskDetailAnim.addEventListener('finish', () => {
        riskDetailAnim.commitStyles();
      });
    });

    return summaryOfRisk;
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
