// alternative to load event
document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    let mailFormat = document.querySelectorAll("[name='mailFormat']");
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
    mailFormat.forEach(node=> {
      node.addEventListener('click', (e) => {
        let currentValue = document.querySelector("[name='mailFormat']:checked");
        let emailFormat = currentValue.value;
        
        let form_sender = document.querySelector("#form_sender");
        let form_receiver = document.querySelector('#form_receiver');
        let inputAmount = document.querySelector("[name='inputAmount']");
      
        form_sender.placeholder = emailFormat == "normal"?"Please enter Sender Email*":"Please enter Sender Address";
        form_receiver.placeholder = emailFormat == "normal"?"Please enter Receiver Email*":"Please enter Receiver Address";
        inputAmount.disabled = (emailFormat == "normal");
        //inputAmount.style= (emailFormat == "normal")? "display:none;":"";
        let labels1 = document.getElementsByTagName('label');
        for (let i = 0 ; i < labels1.length; i++) {
          if (emailFormat == "normal") {
            labels1[i].classList.remove('color_white');
          }
          else {
            labels1[i].classList.add('color_white');
          }
        }

        let bodyInner = document.body;
        if (emailFormat=="normal") {
          bodyInner.classList.remove('background_black');
        } else {
          bodyInner.classList.add('background_black');
        }
        let head_titleInner = document.querySelector('[name=head_title]');
        if (emailFormat=="normal") {
          head_titleInner.classList.remove('color_white');
        } else {
          head_titleInner.classList.add('color_white');
        }
      });
    });
  }
}