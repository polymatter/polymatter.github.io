'use strict';

const database_url = 'https://411uchidwl.execute-api.eu-west-2.amazonaws.com/dev/risks'

document.body.onload = () => {
  fetchUpdateData();
  setDashboardBacklink();
}

// NOTE: I am assuming that a langblock property could be a function, just in case we need to take a parameter in order to translate effectively. It could potentially also return an object with properties that suggest how it should be presented (eg colour, underlining etc.)
const langBlock = {
  HEADING_MITIGATION: `Mitigation`,
  HEADING_CONTINGENCY: `Contingency`,
  HEADING_IMPACT: `Impact`,
  TEXTAREA_CHANGE_CHANGE: `Change detected! Don't forget to save`,
  TEXTAREA_CHANGE_INITIAL: `Initial copy from server`,
  TEXTAREA_CHANGE_NOCHANGE: `No changes from saved copy`,
  TEXTAREA_BUTTON_SAVE: `Done`,
  TEXTAREA_BUTTON_UNDO: `Undo`,
  STATUS_SHARED: `Shared`,
  STATUS_WRITE_PROTECTED: `Write Protected`,
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
  fetch(database_url)
    .then(response => response.json())
    .then(data => {
      updateDisplay(data)
    });
}

function createAutosizeTextAreaContainer(text, attributeName, saveCallback) {
  let container = document.createElement('div');
  let { textareaContainer, textarea } = createTextAreaContainer(container, attributeName, saveCallback);
  container.appendChild(textareaContainer);
  return { container, textarea };

  // WHY INNER FUNCTIONS AND NOT INLINE FUNCTIONS: I think it reads better by breaking into individual steps with a clear intent. Performance is not an issue here.
  // WHY INNER FUNCTIONS AND NOT CLOSURES: I think it reads better by making it explicit which parameters the functions will use.
  // WHY INNER FUNCTIONS AND NOT GLOBAL FUNCTIONS: These inner functions are only useful in this particular context.

  function createTextAreaContainer(container, attributeName, saveCallback) {
    let textarea = document.createElement('textarea');
    textarea.classList.add('risk-detail-textarea');
    textarea.classList.add('risk-detail-textarea-true');
    textarea.innerText = text;
    let buttonBarWrap = createButtonBar(textarea, attributeName, saveCallback);
    container.appendChild(buttonBarWrap);
    let textareaContainer = document.createElement('div');
    textareaContainer.classList.add('risk-detail-label');
    textareaContainer.appendChild(textarea);
    textareaContainer.appendChild(createMirrorDiv(textarea));

    return { textareaContainer, textarea};
  }

  function createButtonBar(textarea, attributeName, saveCallback) {
    let buttonBarWrap = document.createElement('div');
    buttonBarWrap.classList.add('risk-detail-section-button-wrap');
    buttonBarWrap.appendChild(document.createElement('span'));
    let notifications = document.createElement('span');
    notifications.classList.add('risk-detail-section-notification');
    let notificationText = document.createTextNode(langBlock.TEXTAREA_CHANGE_INITIAL);
    notifications.appendChild(notificationText);
    buttonBarWrap.appendChild(notifications);
    let updateNotification = () => {
      if (textarea.value == textarea.innerHTML) {
        notificationText.textContent = langBlock.TEXTAREA_CHANGE_NOCHANGE;
      } else {
        notificationText.textContent = langBlock.TEXTAREA_CHANGE_CHANGE;
      }
    };
    let updateNotificationEvents = ['change', 'keyup', 'keydown'];
    updateNotificationEvents.forEach(event => {
      textarea.addEventListener(event, updateNotification);
    });
    let buttonBar = document.createElement('div');
    buttonBar.classList.add('risk-detail-section-button-bar');
    let confirmEdit = document.createElement('button');
    confirmEdit.classList.add('risk-detail-section-button');
    confirmEdit.classList.add('risk-detail-section-button-confirm');
    confirmEdit.addEventListener('click', async () => {
      let payload = {};
      payload.id = document.querySelector('.content').style.getPropertyValue('--selected-risk-id')
      payload[attributeName] = textarea.value;

      let response = await postData(database_url, payload);
      console.log(`${JSON.stringify(response)}`);
      saveCallback(attributeName, textarea.value);
    })
    confirmEdit.appendChild(document.createTextNode(langBlock.TEXTAREA_BUTTON_SAVE));
    let confirmEditIcon = document.createElement('i');
    confirmEditIcon.classList.add('material-icons');
    confirmEditIcon.appendChild(document.createTextNode('done'));
    confirmEdit.appendChild(confirmEditIcon);
    let undoEdit = document.createElement('button');
    undoEdit.classList.add('risk-detail-section-button');
    undoEdit.classList.add('risk-detail-section-button-undo');
    undoEdit.addEventListener('click', () => {
      textarea.value = textarea.innerHTML;
      textarea.dispatchEvent(new Event('change'));
    });
    undoEdit.appendChild(document.createTextNode(langBlock.TEXTAREA_BUTTON_UNDO));
    let undoEditIcon = document.createElement('i');
    undoEditIcon.classList.add('material-icons');
    undoEditIcon.appendChild(document.createTextNode('undo'));
    undoEdit.appendChild(undoEditIcon);
    buttonBar.appendChild(undoEdit);
    buttonBar.appendChild(confirmEdit);
    buttonBarWrap.appendChild(buttonBar);
    return buttonBarWrap;
  }
  function createMirrorDiv(textarea) {
    // DESCRIPTION: Textareas do not autosize
    // WHY: Idiots. The Web Standards Committee were just plain idiots.
    // SOLUTION: We create a mirror div and hide it behind the textarea and mirror all the text in the textarea. As the div grows and shrinks it will change the size of the parent container and thus the height of the textarea.
    // WHY SOLUTION LIKE THIS: This way we get a size calculated by css layout engine itself. It is also possible to manipulate the size of the textarea by using javascript
    const taDummy = document.createElement('div');
    taDummy.classList.add('risk-detail-textarea');
    taDummy.classList.add('risk-detail-textarea-mirror');
    const eventsToTriggerUpdate = ['change', 'keydown', 'keyup'];
    eventsToTriggerUpdate.forEach(event => {
      textarea.addEventListener(event, () => {
        // DESCRIPTION: Newline characters will not be rendered, so will need to be replaced with a <br> tag in order to render. The &nbsp is a non-breaking space which means that on an empty newline, the newline will be displayed. Without it there is an ugly jitter.
        taDummy.innerHTML = textarea.value.replace(/\n/g, '<br/>') + '&nbsp';
      });
    });
    textarea.dispatchEvent(new Event('change'));
    return taDummy;
  }
}

function updateDisplay(risks) {
  let listOfRisks = document.querySelector('#dashboard');
  removeAllElements(listOfRisks);
  let detailedRisks = document.querySelector('.content');

  risks.forEach(risk => {
    let summaryOfRisk = createRiskSummaryElement(risk);
    listOfRisks.appendChild(summaryOfRisk);

    let detailOfRisk = createRiskDetailElement(risk);
    detailedRisks.appendChild(detailOfRisk);
  });

  function removeAllElements(element) {
    Array.from(element.children).every(elem => { elem.remove(); return true; });
  }

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
    let { container } = createAutosizeTextAreaContainer(risk.label, 'label', saveCallback)
    heading.appendChild(container);
    detailOfRisk.appendChild(heading);

    // ICONBAR
    let iconbar = document.createElement('div');
    iconbar.classList.add('risk-detail-iconbar');
    let icon_shared = document.createElement('i');
    icon_shared.classList.add('material-icons');
    icon_shared.appendChild(document.createTextNode('people'));
    iconbar.appendChild(icon_shared);
    let label_shared = document.createElement('span');
    label_shared.classList.add('risk-detail-shared-label');
    label_shared.appendChild(document.createTextNode(langBlock.STATUS_SHARED));
    iconbar.appendChild(label_shared);
    let icon_writeprotect = document.createElement('i');
    icon_writeprotect.classList.add('material-icons');
    icon_writeprotect.appendChild(document.createTextNode('lock'));
    iconbar.appendChild(icon_writeprotect);
    let label_writeprotect = document.createElement('span');
    label_writeprotect.classList.add('risk-detail-writeprotect-label');
    label_writeprotect.appendChild(document.createTextNode(langBlock.STATUS_WRITE_PROTECTED));
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
    sectioncontents.appendChild(createSection(langBlock.HEADING_MITIGATION, 'mitigation', risk.mitigation, saveCallback));
    sectioncontents.appendChild(createSection(langBlock.HEADING_CONTINGENCY, 'contingency', risk.contingency, saveCallback));
    sectioncontents.appendChild(createSection(langBlock.HEADING_IMPACT, 'impact', risk.impact, saveCallback));
    sectiondetails.appendChild(sectioncontents);

    detailOfRisk.appendChild(sectiondetails);

    return detailOfRisk;

    function saveCallback(attribute, value) {
      risk[attribute] = value;
      fetchUpdateData();
    }
  }

  function createRiskSummaryElement(risk) {
    let summaryOfRisk = document.createElement('section');
    summaryOfRisk.classList.add('dashboard-element');

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

  function createSection(titleText, sectionClass, text = '', saveCallback) {
    let headingText = document.createElement('span');
    headingText.classList.add('risk-detail-section-label');
    headingText.appendChild(document.createTextNode(titleText))
    let heading = document.createElement('div');
    heading.classList.add('risk-detail-section-title');
    heading.appendChild(headingText);

    let body = document.createElement('div');
    body.style.setProperty('display', 'flex');
    let { container } = createAutosizeTextAreaContainer(text, titleText, saveCallback)
    body.appendChild(container);

    let element = document.createElement('section');
    element.classList.add(sectionClass);
    element.appendChild(heading);
    element.appendChild(body);
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
    body: JSON.stringify(data) // body data type must match 'Content-Type' header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
