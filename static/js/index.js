// alternative to load event
document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    // init default Setup
    initFunction();
    // bind Radios
    bindRadios();
    // bind Submit
    bindSubmit();
  }
}

const bindSubmit = () => {
  let contactForm = document.querySelector('#contact-form');
  contactForm.onsubmit = (event) => {
    event.preventDefault();
    console.log('submit');
    console.log(event);
  };
};

const initFunction = () => {
  // let mailFormat = document.querySelectorAll("[name='mailFormat']");
    let initNumber = document.querySelector("[name='inputAmount']");
    initNumber.disabled=true;
    // initNumber.style= "display:none;";
    let labels = document.getElementsByTagName('label');
    for (let i = 0 ; i < labels.length; i++) {
      console.log(labels[i].innerText);
      labels[i].classList.remove('color_white');
    }
    let body = document.body;
    body.classList.remove('background_black');
    let head_title = document.querySelector('[name=head_title]');
    head_title.classList.remove('color_white');
};

const bindRadios = () => {
  // get radios
  let mailFormat = document.querySelectorAll("[name='mailFormat']");
  // change the current setup by click radio
  mailFormat.forEach(radio=> {
    radio.addEventListener('click', (e) => {
      let currentValue = document.querySelector("[name='mailFormat']:checked");
      let emailFormat = currentValue.value;
      // setup input by emailFormat
      setupInputByFormat(emailFormat);
      // change labels by emailFormat
      changeLabelsByFormat(emailFormat);
      // set up bg by emailFormat
      setupBgByFormat(emailFormat);
    });
  });
};

const changeLabelsByFormat = (emailFormat) => {
  let labels = document.getElementsByTagName('label');
  for (let i = 0 ; i < labels.length; i++) {
    if (emailFormat == "normal") {
      labels[i].classList.remove('color_white');
    }
    else {
      labels[i].classList.add('color_white');
    }
  }
};

const setupInputByFormat = (emailFormat) => {
  let form_sender = document.querySelector("#form_sender");
  let form_receiver = document.querySelector('#form_receiver');
  let inputAmount = document.querySelector("[name='inputAmount']");
  form_sender.placeholder = emailFormat == "normal"?"Please enter Sender Email*":"Please enter Sender Address";
  form_receiver.placeholder = emailFormat == "normal"?"Please enter Receiver Email*":"Please enter Receiver Address";
  inputAmount.disabled = (emailFormat == "normal");
};

const setupBgByFormat = (emailFormat) => {
  let head_titleInner = document.querySelector('[name=head_title]');
  let bodyInner = document.body;
  if (emailFormat=="normal") {
    bodyInner.classList.remove('background_black');
    head_titleInner.classList.remove('color_white');
  } else {
    bodyInner.classList.add('background_black');
    head_titleInner.classList.add('color_white');
  }
  head_titleInner.innerHTML = emailFormat=="normal"?"Normal Email":"Zen Email";
}