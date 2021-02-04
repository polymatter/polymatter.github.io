'use strict';

document.body.onload = () => {
  fetchUpdateData();
  setDashboardBacklink();
}
const langBlock = {
  HEADING_MITIGATION: 'Mitigation',
  HEADING_CONTINGENCY: 'Contingency',
  HEADING_IMPACT: 'Impact'
}

function setDashboardBacklink() {
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

  let backlink = document.querySelector('.dashboard-link');
  const content = document.querySelector('.content');
  backlink.addEventListener('click', () => {
    let riskId = content.style.getPropertyValue('--selected-risk-id');
    content.style.setProperty('--selected-risk-id', null);
    const riskDetail = document.querySelector('#' + riskId);
    const dashboard = document.querySelector('#dashboard');
    dashboard.classList.remove('hide');

    const dashboardAnim = dashboard.animate(
      fixSlideRightBug([{ opacity: 0, transform: 'translateX(100%)' }, { opacity: 1, transform: 'translateX(0%)' }]),
      { duration: 1000, easing: 'ease-in-out', fill: 'both' },
    );
    dashboardAnim.addEventListener('finish', () => {
      dashboardAnim.commitStyles();
      dashboard.setAttribute('style', '');
    });

    if (!riskDetail.classList.contains('hide')) {
      riskDetail.classList.remove('hide');
      riskDetail.classList.add('positioned');
      const riskDetailAnim = riskDetail.animate(
        [{ transform: 'translateX(0%)' }, { transform: 'translateX(-100%)' }],
        { delay: 0, duration: 1000, easing: 'ease-in-out', fill: 'both' }
      );
      riskDetailAnim.addEventListener('finish', () => {
        riskDetailAnim.commitStyles();
        riskDetail.setAttribute('style', '');
        riskDetail.classList.add('hide');
        riskDetail.classList.remove('positioned');
        document.querySelector('.dashboard-link').classList.add('hidden');
      });
    } else {
      console.error(`RiskId ${riskId} is hidden but somehow we are expected to scroll away from it?`);
    }
  })
}

function fetchUpdateData() {
  // fetch('https://jsonstorage.net/api/items/26a9423e-7389-4cfb-a26c-99236a8f7ba7')
  //   .then(response => response.json())
  //   .then(data => updateDisplay(data));
  const DEBUG = true;
  if (!DEBUG) {
    fetch('https://411uchidwl.execute-api.eu-west-2.amazonaws.com/dev/risks')
    .then(response => response.json())
    .then(data => {
      updateDisplay(data)
    });
  } else {
    const data = [{"id":"Id_1","level":"High","label":"The server capacity initially defined may be inadequate","mitigation":"Capacity analysis will be done during the design stage, if this shows a problem design issues will be revisited","contingency":"Purchase and install additional disc space at the customer site","impact":"Cost of disc space plus installation effort & travel","likelihood":"High"},{"id":"Id_3","level":"Low","label":"System integration more complex than estimated","mitigation":"Early development of integration plan, with formal entry requirements for components entering integration","contingency":"Expend more development effort, try and minimize this by regular meetings between development and integration tems","impact":"Delays to project and higher costs of development","likelihood":"Low"},{"id":"Id_2","level":"Medium","label":"Misunderstood requirements during bid, unambiguous, can't recover money for this client","mitigation":"Multiple checkpoints with end users and client project manager, delivery of early drafts","contingency":"Open discussion with client about issues raised, prepare for change request, may need to absorb some cost impact","impact":"More time during requirements phase, and maybe reworking during development. Could be difficult times during testing with client","likelihood":"Medium"}];
    updateDisplay(data);
  }
}

function createAutosizeTextAreaContainer(text) {
  let label = document.createElement('span');
  label.classList.add('risk-detail-label');
  let ta = document.createElement('textarea')
  ta.classList.add('risk-detail-textarea');
  ta.classList.add('risk-detail-textarea-true');
  ta.innerText = text;
  label.appendChild(ta);
  label.appendChild(createMirrorDiv(ta));
  return { container: label, textarea: ta };
}

function createMirrorDiv(ta) {
  // DESCRIPTION: Textareas do not autosize
  // WHY: Idiots. The Web Standards Committee were just plain idiots.
  // SOLUTION: We create a mirror div and hide it behind the textarea and mirror all the text in the textarea. As the div grows and shrinks it will change the size of the parent container and thus the height of the textarea.
  // WHY SOLUTION LIKE THIS: This way we get a size calculated by css layout engine itself. It is also possible to manipulate the size of the textarea by using javascript
  const taDummy = document.createElement('div');
  taDummy.classList.add('risk-detail-textarea');
  taDummy.classList.add('risk-detail-textarea-mirror');
  const eventsToTriggerUpdate = ['change', 'keydown', 'keyup'];
  eventsToTriggerUpdate.forEach(event => {
    ta.addEventListener(event, () => {
      taDummy.innerHTML = ta.value.replace(/\n/g, '<br/>') + '&nbsp';
    });
  });
  taDummy.innerHTML = ta.value.replace(/\n/g, '<br/>');
  return taDummy;
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

    let detailOfRisk = document.createElement('article');
    detailOfRisk.setAttribute('id', risk.id);
    detailOfRisk.classList.add('risk-detail');
    detailOfRisk.classList.add('hide');

    // HEADING
    let heading = document.createElement('div');
    heading.classList.add('risk-detail-heading');
    let level = document.createElement('span');
    level.classList.add(`badge-${risk.level.toLowerCase()}`);
    level.classList.add('badge');
    heading.appendChild(level);
    let { container, textarea } = createAutosizeTextAreaContainer(risk.label)
    heading.appendChild(container);
    detailOfRisk.appendChild(heading);

    let buttonBarWrap = document.createElement('div');
    buttonBarWrap.classList.add('risk-detail-section-button-wrap');
    buttonBarWrap.appendChild(document.createElement('span'));
    let notifications = document.createElement('span');
    notifications.classList.add('risk-detail-section-notification');
    let notificationText = document.createTextNode("Initial copy from server");
    notifications.appendChild(notificationText);
    buttonBarWrap.appendChild(notifications);
    let updateNotification = () => {
      if (textarea.value == textarea.innerHTML) {
        notificationText.textContent = "No changes from saved copy"
      } else {
        notificationText.textContent = "Change detected! Don't forget to save"
      }
    }
    textarea.addEventListener('change', updateNotification);
    let buttonBar = document.createElement('div');
    buttonBar.classList.add('risk-detail-section-button-bar');
    let confirmEdit = document.createElement('button');
    confirmEdit.classList.add('risk-detail-section-button');
    confirmEdit.classList.add('risk-detail-section-button-confirm');
    confirmEdit.appendChild(document.createTextNode("Done "));
    let confirmEditIcon = document.createElement('i');
    confirmEditIcon.classList.add('material-icons');
    confirmEditIcon.appendChild(document.createTextNode('done'));
    confirmEdit.appendChild(confirmEditIcon);
    let undoEdit = document.createElement('button');
    undoEdit.classList.add('risk-detail-section-button');
    undoEdit.classList.add('risk-detail-section-button-undo');
    undoEdit.addEventListener('click', () => {
      textarea.value = textarea.innerHTML;
      updateNotification();
    });
    undoEdit.appendChild(document.createTextNode("Undo "));
    let undoEditIcon = document.createElement('i');
    undoEditIcon.classList.add('material-icons');
    undoEditIcon.appendChild(document.createTextNode('undo'));
    undoEdit.appendChild(undoEditIcon);
    buttonBar.appendChild(undoEdit);
    buttonBar.appendChild(confirmEdit);
    buttonBarWrap.appendChild(buttonBar);
    detailOfRisk.appendChild(buttonBarWrap);

    // ICONBAR
    let iconbar = document.createElement('div');
    iconbar.classList.add('risk-detail-iconbar');
    let icon_shared = document.createElement('i');
    icon_shared.classList.add('material-icons');
    icon_shared.appendChild(document.createTextNode("people"));
    iconbar.appendChild(icon_shared);
    let label_shared = document.createElement('span');
    label_shared.classList.add('risk-detail-shared-label');
    label_shared.appendChild(document.createTextNode("Shared"));
    iconbar.appendChild(label_shared);
    let icon_writeprotect = document.createElement('i');
    icon_writeprotect.classList.add('material-icons');
    icon_writeprotect.appendChild(document.createTextNode("lock"));
    iconbar.appendChild(icon_writeprotect);
    let label_writeprotect = document.createElement('span');
    label_writeprotect.classList.add('risk-detail-writeprotect-label');
    label_writeprotect.appendChild(document.createTextNode("Write protected"));
    iconbar.appendChild(label_writeprotect);
    detailOfRisk.appendChild(iconbar);

    // SECTIONLIST
    let sectionlist = document.createElement('div');
    sectionlist.classList.add('risk-detail-sectionlist');
    let sectionlistcontent = document.createElement('div');
    sectionlistcontent.classList.add('risk-detail-sectionlist-content');
    [langBlock.HEADING_MITIGATION, langBlock.HEADING_CONTINGENCY, langBlock.HEADING_IMPACT].forEach(sectionText => {
      let section = document.createElement('span');
      section.classList.add('risk-detail-sectionlist-item');
      section.classList.add('risk-detail-sectionlist-' + sectionText.toLowerCase());
      section.appendChild(document.createTextNode(sectionText));
      sectionlistcontent.appendChild(section);
    })
    sectionlist.appendChild(sectionlistcontent);
    detailOfRisk.appendChild(sectionlist);

    // SECTION DETAILS
    let sectiondetails = document.createElement('div');
    sectiondetails.classList.add('risk-detail-sections');
    let sectioncontents = document.createElement('div');
    sectioncontents.classList.add('risk-detail-sections-contents');
    sectioncontents.appendChild(createSection(langBlock.HEADING_MITIGATION, 'mitigation', risk.mitigation));
    sectioncontents.appendChild(createSection(langBlock.HEADING_CONTINGENCY, 'contingency', risk.contingency));
    sectioncontents.appendChild(createSection(langBlock.HEADING_IMPACT, 'impact', risk.impact));
    sectiondetails.appendChild(sectioncontents);

    detailOfRisk.appendChild(sectiondetails);

    return detailOfRisk;
  }

  function createRiskSummaryElement(risk) {
    let summaryOfRisk = document.createElement('section');
    summaryOfRisk.classList.add("dashboard-element");

    let level = document.createElement('span');
    level.classList.add(`badge-${risk.level.toLowerCase()}`);
    level.classList.add('badge');
    summaryOfRisk.appendChild(level);

    let label = document.createElement('span');
    label.classList.add('dashboard-label');
    label.appendChild(document.createTextNode(risk.label));
    summaryOfRisk.appendChild(label);

    summaryOfRisk.addEventListener('click', () => {
      document.querySelector('.content').style.setProperty('--selected-risk-id', risk.id);
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
        document.querySelector('.hidden.dashboard-link').classList.remove('hidden');
      });
    });

    return summaryOfRisk;
  }

  function createSection(titleText, sectionClass, text = '') {
    let headingText = document.createElement('span');
    headingText.classList.add('risk-detail-section-label');
    headingText.appendChild(document.createTextNode(titleText))
    let heading = document.createElement('div');
    heading.classList.add('risk-detail-section-title');
    heading.appendChild(headingText);

    let buttonBar = document.createElement('div');
    buttonBar.classList.add('risk-detail-section-button-bar');
    let confirmEdit = document.createElement('button');
    confirmEdit.classList.add('risk-detail-section-button');
    confirmEdit.classList.add('risk-detail-section-button-confirm');
    confirmEdit.appendChild(document.createTextNode("Done "));
    let confirmEditIcon = document.createElement('i');
    confirmEditIcon.classList.add('material-icons');
    confirmEditIcon.appendChild(document.createTextNode('done'));
    confirmEdit.appendChild(confirmEditIcon);
    let undoEdit = document.createElement('button');
    undoEdit.classList.add('risk-detail-section-button');
    undoEdit.classList.add('risk-detail-section-button-undo');
    undoEdit.appendChild(document.createTextNode("Undo "));
    let undoEditIcon = document.createElement('i');
    undoEditIcon.classList.add('material-icons');
    undoEditIcon.appendChild(document.createTextNode('undo'));
    undoEdit.appendChild(undoEditIcon);
    buttonBar.appendChild(undoEdit);
    buttonBar.appendChild(confirmEdit);

    let body = document.createElement('div');
    body.style.setProperty('display', 'flex');
    let { container } = createAutosizeTextAreaContainer(text)
    body.appendChild(container);

    let element = document.createElement('section');
    element.classList.add(sectionClass);
    element.appendChild(heading);
    element.appendChild(body);
    element.appendChild(buttonBar);
    return element;
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
