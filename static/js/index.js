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
    let targetForm  = event.target;
    let result = formSerialize(targetForm);
    console.log(result);
    upload();
  };
};

const initFunction = () => {
  // let mailFormat = document.querySelectorAll("[name='mailFormat']");
    let initNumber = document.querySelector("[name='feeAmount']");
    initNumber.disabled=true;
    let feeAmountField = document.querySelector("[name='feeAmountField']");
    feeAmountField.style= "display:none;";
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
  let feeAmount = document.querySelector("[name='feeAmount']");
  let feeAmountField = document.querySelector("[name='feeAmountField']");
   
  form_sender.placeholder = emailFormat == "normal"?"Please enter Sender Email*":"Please enter Sender Address";
  form_receiver.placeholder = emailFormat == "normal"?"Please enter Receiver Email*":"Please enter Receiver Address";
  feeAmount.disabled = (emailFormat == "normal");
  feeAmountField.style= (emailFormat == "normal")?"display:none;":"";
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
};

const formSerialize = (form)=> {
  if (!form||!form.elements) {
    return null;
  }
  let elements = form.elements;
  let jsonObj = {};
  for (let i = 0 ; i < elements.length; i++) {
    if (elements[i].type !=="submit") {
      console.log(elements[i].name);
      console.log(elements[i].value);
      jsonObj[elements[i].name] = elements[i].value;
    }
  }
  return jsonObj;
};


function upload() {
  console.log("upload");
  let uploadFileInput = document.querySelector('#form_file');
  let curFiles = uploadFileInput.files;
  const repoPath = 'ipfs-' + Math.random();
  const ipfs = new Ipfs({ repo: repoPath });
  
  //ipfs準備好了
  console.time('ipfs ready');
  ipfs.on('ready', async () => {
      console.timeEnd('ipfs ready');
      const directory = 'directory';
      const files = await readFiles(ipfs, directory, curFiles);
      console.log(`即將上傳${files.length}個檔到ipfs上面`);

      streamFiles(ipfs, directory, files, (err, directoryHash) => {
          if (err) {
              console.log(`There was an error adding the files ${err}`)
          }
          console.log("https://ipfs.io/ipfs/"+directoryHash);
          
          //
          // ipfs.ls(directoryHash, (err, files) => {
          //     if (err) {
          //         console.log(`There was an error listing the files ${err}`)
          //     }
          //     var list = document.createElement('ul');
          //     var item = document.createElement('li');
          //     item.appendChild(document.createTextNode("directory hash = " + directoryHash));
          //     list.appendChild(item);
          //     files.forEach((file, index) => {
          //         item = document.createElement('li');
          //         item.appendChild(document.createTextNode(`name = ${file.name} hash = ${file.hash}`));
          //         list.appendChild(item);
          //     })
          //     directory_hash.appendChild(list);

          //     ipfs_link.style.display = "inline";
          //     ipfs_link.href = "https://ipfs.io/ipfs/"+directoryHash;
          // })
      })
  })
}

/**
* 產生要上傳到ipfs的json陣列
* @param {*} ipfs ipfs物件
* @param {*} directory 上傳檔案的資料夾名稱
* @param {*} curFiles 上傳的檔案
*/
const readFiles = async (ipfs, directory, curFiles) => {
 
  let promiseArray = [];
 console.time('read file');
  for (let i = 0; i < curFiles.length; i++) {
     
      let readFilePromise =  awaitReadFile(ipfs, directory, curFiles[i]);
      
      promiseArray.push(readFilePromise);
      // 
  }
  let files = await Promise.all(promiseArray);
  console.timeEnd('read file');
  return files;

}
/**
* 將檔案讀進來並產生ipfs上傳的格式
* {path : 資料夾名稱/檔名 , content : 檔案內容}
* 
* @param {*} ipfs  ipfs物件
* @param {*} directory  上傳檔案的資料夾名稱
* @param {*} file 要上傳到ipfs的檔案
*/
async function awaitReadFile(ipfs, directory, file) {
  let fr = new FileReader();
  return new Promise((resolve, reject) => {
      fr.onload = function (fileLoadedEvent) {
          console.log("onload");
          let fileType = file.name.split('.').pop();
          if (fileType === "txt") {
              let textFromFileLoaded = fileLoadedEvent.target.result;
              //若是文字檔，則直接用utf8即可
              resolve({
                  path: `${directory}/${file.name}`,
                  content: ipfs.types.Buffer.from(textFromFileLoaded, "utf8")
              });
          } else {
              resolve({
                  path: `${directory}/${file.name}`,
                  content: ipfs.types.Buffer.from(btoa(fr.result), "base64")
              });
          }
      }
      fr.readAsBinaryString(file);
  });
}
/**
* 將檔案上傳到ipfs上
* @param {*} ipfs ipfs物件
* @param {*} directory 上傳檔案的資料夾名稱
* @param {*} files 要上傳的檔案
* @param {*} cb 最後完成後要執行的callback
*/
const streamFiles = (ipfs, directory, files, cb) => {
  // Create a stream to write files to
  console.log(files);
  const stream = ipfs.files.addReadableStream();
  console.time('stream file');
  stream.on('data', function (data) {
      console.log(`Added ${data.path} hash: ${data.hash}`)
      // The last data event will contain the directory hash
      if (data.path === directory) {
          cb(null, data.hash)
      }
  })
  // Add the files one by one
  files.forEach(file => stream.write(file));
  // When we have no more files to add, close the stream
  stream.end();
  console.timeEnd('stream file');
}

