'use strict';

const database_url = 'https://411uchidwl.execute-api.eu-west-2.amazonaws.com/dev/risks'

document.body.onload = () => {
  fetchUpdateData().then(updateDisplay);
  setTopLeftLink();
  setTopRightLink();
}

// NOTE: I am assuming that a langblock property could be a function, just in case we need to take a parameter in order to translate effectively. It could potentially also return an object with properties that suggest how it should be presented (eg colour, underlining etc.) I have standardised on backticks for user displayable strings (ie ones that could legitimately have quotes or double quotes)
// EXAMPLE: SAVE_ITEM: (items) => items.length > 1 ? `Save Item` : `Save Items`
// EXAMPLE EXPLANATION: The parameters would need to be called appropriately at the point it is needed. And the decision about which need to be parameterised will need to be based on the situation.
const langBlock = {
  HEADING_ADD_RISK: `Add Risk`,
  HEADING_MAIN: `Risky Sophie Dashboard`,
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
  NEW_RISK_TEXTAREA_PLACEHOLDER: `Enter Short Risk Description`,
}

function setTopRightLink() {
  const toprightdiv = document.querySelector('.top-right-div');
  toprightdiv.addEventListener('click', topRightHeadingListener);
}

function topRightHeadingListener() {
  const topleftdiv = document.querySelector('.top-left-div');
  if (topleftdiv.classList.contains('canceldiv')) {
    addRiskDoneButtonListener();
  } else {
    console.log('settings page')
  }
}

function setTopLeftLink() {
  const topleftdiv = document.querySelector('.top-left-div');
  topleftdiv.addEventListener('click', topLeftHeadingListener);
}

function topLeftHeadingListener(event) {
  const topleftdiv = event.target.parentElement;
  if (topleftdiv.classList.contains('dashboard-link')) {
    backlinkListener();
  } else if (topleftdiv.classList.contains('canceldiv')) {
    showAddRisk1();
  } else {
    console.log(`Could not find known class in array [${Array.from(topleftdiv.classList)}]`);
  }
}

function undoEditListener(textarea) {
  return () => {
    textarea.value = textarea.innerHTML;
    textarea.dispatchEvent(new Event('change'));
  };
}

async function addRiskDoneButtonListener() {
  const textarea = document.querySelector('.new-risk-textarea');
  const payload = {
    label: textarea.value,
    level: 'Low',
    mitigation: '',
    contingency: '',
    impact: '',
    likelihood: '',
  }
  const response = await postData(database_url, payload);
  console.log(`response ${JSON.stringify(response)}`);
}

function showAddRisk1() {
  const container = document.querySelector('.new-risk-bar-container-2');
  container.classList.add('hide');
  document.querySelector('.new-risk-bar-container-1').classList.remove('hide');
  document.querySelector('.top-left-icon').innerText = 'arrow_back_ios_new';
  document.querySelector('.header_text').innerText = langBlock.HEADING_MAIN;
  document.querySelector('.top-right-icon').innerText = 'menu';
  const topleftdiv = document.querySelector('.top-left-div');
  topleftdiv.classList.remove('canceldiv');
  topleftdiv.classList.add('dashboard-link');
  topleftdiv.classList.add('hidden');
}

function showAddRisk2(newRiskBar2, container) {
  return () => {
    newRiskBar2.classList.remove('hide');
    container.classList.add('hide');
    document.querySelector('.top-left-icon').innerText = 'cancel';
    document.querySelector('.header_text').innerText = langBlock.HEADING_ADD_RISK;
    document.querySelector('.top-right-icon').innerText = 'done';
    const topleftdiv = document.querySelector('.top-left-div');
    topleftdiv.classList.add('canceldiv');
    topleftdiv.classList.remove('dashboard-link');
    topleftdiv.classList.remove('hidden');
  }
}

function backlinkListener() {
  const content = document.querySelector('.content');
  const riskId = content.style.getPropertyValue('--selected-risk-id');
  content.style.setProperty('--selected-risk-id', null);
  const riskDetail = document.querySelector(`#${riskId}`);
  const dashboard = document.querySelector('#dashboard');
  dashboard.classList.remove('hide');

  const dashboardAnim = dashboard.animate(
    fixSlideRightBug([{ opacity: 0, transform: 'translateX(100%)' }, { opacity: 1, transform: 'translateX(0%)' }]),
    { duration: 1000, easing: 'ease-in-out', fill: 'both' }
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
}

function fetchUpdateData() {
  return fetch(database_url)
    .then(response => response.json());
}

function createAutosizeTextAreaContainer(text, attributeName, saveCallback) {
  const container = createElement('div');
  const { textareaContainer, textarea } = createTextAreaContainer(container, attributeName, saveCallback);
  container.appendChild(textareaContainer);
  return { container, textarea };

  // WHY INNER FUNCTIONS AND NOT INLINE FUNCTIONS: I think it reads better by breaking into individual steps with a clear intent. Performance is not an issue here.
  // WHY INNER FUNCTIONS AND NOT CLOSURES: I think it reads better by making it explicit which parameters the functions will use.
  // WHY INNER FUNCTIONS AND NOT GLOBAL FUNCTIONS: These inner functions are only useful in this particular context.

  function createTextAreaContainer(container, attributeName, saveCallback) {
    const textareaContainer = createElement('div', { class: 'risk-detail-label'});
    const textarea = createElement('textarea', { class: ['risk-detail-textarea', 'risk-detail-textarea-true'], innerText: text, parent: textareaContainer });
    const buttonBarWrap = createButtonBar(textarea, attributeName, saveCallback);
    container.appendChild(buttonBarWrap);
    textareaContainer.appendChild(textarea);
    textareaContainer.appendChild(createMirrorDiv(textarea));

    return { textareaContainer, textarea};
  }

  function createButtonBar(textarea, attributeName, saveCallback) {
    const buttonBarWrap = createElement('div', { class: 'risk-detail-section-button-wrap'});
    const spacer = createElement('span', { parent: buttonBarWrap});
    const notifications = createElement('span', { class: 'risk-detail-section-notification', innerText: langBlock.TEXTAREA_CHANGE_INITIAL, parent: buttonBarWrap});
    const updateNotificationEvents = ['change', 'keyup', 'keydown'];
    updateNotificationEvents.forEach(event => {
      textarea.addEventListener(event, updateNotificationBarListener(notifications));
    });
    const buttonBar = createElement('div', { class: 'risk-detail-section-button-bar', parent: buttonBarWrap});

    const undoEdit = createElement('button', {
      class: ['risk-detail-section-button', 'risk-detail-section-button-undo']
      ,icon: 'undo'
      ,innerText: langBlock.TEXTAREA_BUTTON_UNDO
      ,parent: buttonBar});
    undoEdit.addEventListener('click', undoEditListener(textarea));

    const confirmEdit = createElement('button', { 
      class: ['risk-detail-section-button', 'risk-detail-section-button-confirm']
      ,icon: 'done'
      ,innerText: langBlock.TEXTAREA_BUTTON_SAVE
      ,parent: buttonBar});
    confirmEdit.addEventListener('click', confirmEditListener(textarea, attributeName, saveCallback));

    return buttonBarWrap;
  }
  function createMirrorDiv(textarea) {
    // DESCRIPTION: Textareas do not autosize
    // WHY: Idiots. The Web Standards Committee were just plain idiots.
    // SOLUTION: We create a mirror div and hide it behind the textarea and mirror all the text in the textarea. As the div grows and shrinks it will change the size of the parent container and thus the height of the textarea.
    // WHY SOLUTION LIKE THIS: This way we get a size calculated by css layout engine itself. It is also possible to manipulate the size of the textarea by using javascript
    const taDummy = createElement('div', { class: ['risk-detail-textarea', 'risk-detail-textarea-mirror']});
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

  function updateNotificationBarListener(notificationBar) {
    return event => {
      const textarea = event.target;
      if (textarea.value == textarea.innerHTML) {
        notificationBar.innerText = langBlock.TEXTAREA_CHANGE_NOCHANGE;
      } else {
        notificationBar.innerText = langBlock.TEXTAREA_CHANGE_CHANGE;
      }
    }
  }

  function confirmEditListener(textarea, attributeName, saveCallback) {
    return async () => {
      const payload = {};
      payload.id = document.querySelector('.content').style.getPropertyValue('--selected-risk-id')
      payload[attributeName] = textarea.value;

      const response = await postData(database_url, payload);
      console.log(`${JSON.stringify(response)}`);
      saveCallback(attributeName, textarea.value);
    }
  }
}

function updateDisplay(risks) {
  const listOfRisks = document.querySelector('#dashboard');
  removeAllElements(listOfRisks);
  const detailedRisks = document.querySelector('.content');

  risks.forEach(risk => {
    const summaryOfRisk = createRiskSummaryElement(risk);
    listOfRisks.appendChild(summaryOfRisk);

    const detailOfRisk = createRiskDetailElement(risk);
    detailedRisks.appendChild(detailOfRisk);
  });

  const newRiskBar2 = createAddRiskBar2();
  const newRiskBar1 = createAddRiskBar1(newRiskBar2);
  listOfRisks.appendChild(newRiskBar1);
  listOfRisks.appendChild(newRiskBar2);

  function createAddRiskBar1(newRiskBar2) {
    
    const container = createElement('div', {class: ['new-risk-bar-container-1'] });
    const riskBar = createElement('button', {
      child: {
        class: ['new-risk-add-text']
        ,innerHTML: '&nbsp;Add New Risk'
        ,tag: 'span'
      }
      ,class: ['new-risk-bar-1']
      ,innerHTML: '&nbsp;&nbsp;&nbsp;'
      ,parent: container
      ,prependIcon: 'add'
    });

    riskBar.addEventListener('click', showAddRisk2(newRiskBar2, container));

    return container;
  }

  function createAddRiskBar2() {
    const container = createElement('div', { class: ['new-risk-bar-container-2', 'hide'] });
    const riskBar = createElement('div', { class: ['new-risk-bar-2'], parent: container });

    const addRiskDescription = createElement('textarea', { class: 'new-risk-textarea', placeholder: langBlock.NEW_RISK_TEXTAREA_PLACEHOLDER, parent: riskBar });
    
    return container;
  }

  function removeAllElements(element) {
    Array.from(element.children).forEach(elem => elem.remove());
  }

  function createRiskDetailElement(risk) {

    const detailOfRisk = createElement('article', { id: risk.id, class: ['risk-detail', 'hide']});

    // HEADING
    const { container } = createAutosizeTextAreaContainer(risk.label, 'label', saveCallback)
    const heading = createElement('div', {
      child: [
        {
          class: ['badge', `badge-${risk.level.toLowerCase()}`]
          ,tag: 'span'
        }
        ,container
      ]
      ,class: 'risk-detail-heading'
      ,parent: detailOfRisk 
    });

    // ICONBAR
    const iconbar = createElement('div', {
      child: [{
        class: 'risk-detail-iconbar-item'
        ,innerText: langBlock.STATUS_SHARED
        ,prependIcon: 'people'
        ,tag: 'span'
      },{
        class: 'risk-detail-iconbar-item'
        ,innerText: langBlock.STATUS_WRITE_PROTECTED
        ,prependIcon: 'lock'
        ,tag: 'span'
      }]
      ,class: 'risk-detail-iconbar'
      ,parent: detailOfRisk
    });

    // SECTIONLIST
    const headings = [langBlock.HEADING_MITIGATION, langBlock.HEADING_CONTINGENCY, langBlock.HEADING_IMPACT];
    const sectionlist = createElement('div', {
      child: {
        child: headings.map(heading => {
          return createElement('span', { 
            class: ['risk-detail-sectionlist-item', `risk-detail-sectionlist-${heading.toLowerCase()}`]
            ,innerText: heading
          });
        })
        ,class: 'risk-detail-sectionlist-content'
      }
      ,class: 'risk-detail-sectionlist'
      ,parent: detailOfRisk
    });

    // SECTION DETAILS
    const sectiondetails = createElement('div', {
      child: {
        child: [
          createSection(langBlock.HEADING_MITIGATION, 'mitigation', risk.mitigation)
          ,createSection(langBlock.HEADING_CONTINGENCY, 'contingency', risk.contingency)
          ,createSection(langBlock.HEADING_IMPACT, 'impact', risk.impact)
        ]
        ,class: 'risk-detail-sections-contents'
      }
      ,class: 'risk-detail-sections'
      ,parent: detailOfRisk
    });

    return detailOfRisk;

    function createSection(title, sectionClass, text = '') {
      const element = createElement(undefined, { 
        child: {
          child: {
            class: 'risk-detail-section-label'
            ,innerText: title
            ,tag: 'span'
          }
          ,class: 'risk-detail-section-title'
        }
        ,class: sectionClass
        ,tag: 'section'
      });
  
      const body = createElement('div', { style: 'display: flex;', parent: element});
      const { container } = createAutosizeTextAreaContainer(text, title, saveCallback)
      body.appendChild(container);
  
      return element;
    }

    function saveCallback(attribute, value) {
      risk[attribute] = value;
      fetchUpdateData();
    }
  }

  function createRiskSummaryElement(risk) {
    const summaryOfRisk = createElement('section', {
      child:[{
        class: ['badge', `badge-${risk.level.toLowerCase()}`]
        ,tag: 'span'
      },{
        class: ['dashboard-label']
        ,innerText: risk.label
        ,tag: 'span'
      }]
      ,class: 'dashboard-element' });

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

      const riskDetail = document.querySelector(`#${risk.id}`);
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
}

function createElement(tag = 'div', options = {}) {
  // OPTIONS DESCRIPTION: Can include any property of the element. Includes things like "href: $url" for a tags.
  // EXAMPLE: createElement('a', { id: 'funky1', href: 'blag.com', class: ['image', 'funky-image']}) will create the element representing <a id="funky1" href="blag.com" class="image funky-image">
  // WHY MAKE A COPY: To avoid destructive updates on the options parameter which is passed in by reference
  const optionsCopy = JSON.parse(JSON.stringify(options)); // NOTE: fine in this situation but will not copy functions or check prototypes etc.
  // WHAT IS SPECIAL OPTIONS: These are common things we might want to do with elements
  const specialOptions = {
    class: (classes, element) => { 
      if (typeof classes === 'string') {
        element.classList.add(classes);
      } else if (Array.isArray(classes)) {
        classes.forEach(css => element.classList.add(css));
      } else {
        console.error(`createElement classes parameter is ${classes}`);
      }
    }
    ,child: (options, element) => {
      const arrayify = (f, args) => {
        if (!Array.isArray(args)) {
          f(args);
        } else {
          args.forEach(f);
        }
      }

      const addChild = options => {
        if (options instanceof Element) {
          element.appendChild(options);
        } else {
          element.appendChild(createElement(options.tag, options));
        }
      }

      arrayify(addChild, options);
    }
    ,parent: (parent, child) => {
      parent.appendChild(child);
    }
    ,prependToParent: (parent, child) => {
      parent.prepend(child)
    }
    ,icon: (iconname, element) => {
      element.appendChild(createElement('i', { class: 'material-icons', innerText: iconname}));
    }
    ,prependIcon: (iconname, element) => {
      element.prepend(createElement('i', { class: 'material-icons', innerText: iconname}));
    }
  }
  const specialOperations = [];
  Object.keys(specialOptions).filter(option => options[option]).forEach(option => {
    specialOperations.push(specialOptions[option].bind(null, options[option]));
    delete optionsCopy[option];
  });
  const element = Object.assign(document.createElement(options.tag || tag), optionsCopy);
  specialOperations.forEach(fn => {
    fn(element);
  })
  return element;
}

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
