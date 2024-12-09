

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
let warningSound = new Audio('./sounds/warning.mp3');
let popSound = new Audio('./sounds/pop.mp3');
let deleteSound = new Audio('./sounds/delete.mp3');
let selectSound = new Audio('./sounds/select.mp3');

function addTask() {
    if(inputBox.value === ''){
        warningSound.play();
        alert("You must write something!");

    } else {
        popSound.play();
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    inputBox.value="";
    saveData();
}

listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        selectSound.play();
        e.target.classList.toggle("checked");
        saveData();
    }
    else if (e.target.tagName === "SPAN") {
        deleteSound.play();
        e.target.parentElement.remove();
        saveData();
    }
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask();

function getUserName() {
    var getName = prompt("Please enter your Name here");
    if(getName) {
        localStorage.setItem('name', getName);
        document.getElementById("title").textContent = getName;
    }
}
window.onload = function() {
    var storedName = localStorage.getItem('name');
    if(storedName){
        document.getElementById("title").textContent = storedName;
    } else {
        getUserName();
    }
};


function clearAll() {
    localStorage.clear();
    location.reload();
}