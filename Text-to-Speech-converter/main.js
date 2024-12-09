const reg = window.SpeechRecognition || window.webkitSpeechRecognition;
const speeches = new reg();
var micBox = document.getElementById("container");
function show(){
    micBox.style.display ="block";
    document.getElementById("btn").style.display = "none";

}
function close(){
    micBox.style.display = "none";
    
}

function start1(){
    speeches.start();
    speeches.onresult = function (e) {
        document.getElementById("output").innerText = "You said : "+e.results[e.resultIndex][0].transcript;
    }   
    speeches.onend = function() {
        document.getElementById("res").innerText = "If you want to talk again please click the mic icon.";
    } 
}


let speech = new SpeechSynthesisUtterance();
let vRate = document.getElementById("rate");
speech.rate = vRate.value;
let voices = [];

let voiceSelect = document.querySelector("select");

window.speechSynthesis.onvoiceschanged =() => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0];

    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
};

    voiceSelect.addEventListener("change", () => {
        speech.voice = voices[voiceSelect.value];
});

document.querySelector("button").addEventListener("click",() => {
    speech.text = document.querySelector("textarea").value;
    window.speechSynthesis.speak(speech);
});

window.onload = function(){
    document.getElementById("close").onclick = function(){
        document.getElementById("container").style.display = "none";
        document.getElementById("btn").style.display = "block";
        return false;
    };
};