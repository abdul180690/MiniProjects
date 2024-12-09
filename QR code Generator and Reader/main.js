
// QR Creater

let wrapper1 = document.querySelector(".wrapper1");
let QRInput = document.querySelector(".form input");
let QRButton = document.querySelector(".form button");
let QRImg = document.querySelector(".qr-code");
let saveQR = document.querySelector(".saveQR");

QRButton.addEventListener("click", () => {
    let QRValue = QRInput.value;
    QRImg.innerHTML="";
    let qrcode = new QRCode(QRImg, {
        text : QRValue, 
        width: 180,
        height: 180,
        padding: 5,
        coloDark: '#000000',
        colorLight: '#ffffff',
        correctLevel : QRCode.CorrectLevel.H
    });
    wrapper1.classList.add("active");
});

saveQR.addEventListener("click", () => {
    let ImgSrc = QRImg.querySelector("img").src;
    saveQR.href = ImgSrc;
    saveQR.download='QRCode';
});



// QR Reader

const wrapper2 = document.querySelector(".wrapper2"),
form = document.querySelector("form"),
fileInp = form.querySelector("input"),
infoText = form.querySelector("p"),
closeBtn = document.querySelector(".close"),
copyBtn = document.querySelector(".copy");

function fetchRequest(formData, file) {
    infoText.innerText = "Scanning QR Code...";
    fetch("http://api.qrserver.com/v1/read-qr-code/",{
        method: "POST", body: formData
    }).then(res => res.json()).then(result => {
        result = result[0].symbol[0].data;
        infoText.innerText = result ? "Upload QR Code to Scan" : "Couldn't Scan QR Code";
        if(!result) return;
        wrapper2.querySelector("textarea").innerText = result;
        form.querySelector("img").src = URL.createObjectURL(file);
        wrapper2.classList.add("active");
    }).catch(() => {
        infoText.innerText = "Couldn't Scan QR Code";
    });
}

fileInp.addEventListener("change", e => {
    let file = e.target.files[0];
    if(!file) return;
    let formData = new FormData();
    formData.append("file", file);
    fetchRequest(formData, file);

});

form.addEventListener("click", () => fileInp.click());

copyBtn.addEventListener("click", () => {
    let text = wrapper2.querySelector("textarea").textContent;
    navigator.clipboard.writeText(text);
});
closeBtn.addEventListener("click", () => wrapper2.classList.remove("active"));
