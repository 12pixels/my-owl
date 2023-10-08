import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL : "https://sandbox-dbc30-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
const app = initializeApp(appSettings);
const database = getDatabase(app);
const listInDB = ref(database, "listItems");

const txtInput = document.getElementById('input-field');
const btnSubmit = document.getElementById('add-button');
const listItems = document.getElementById("myList");
const removedItems = document.getElementById("myRemovedList");

onValue(listInDB, function(snapshot){
    if (snapshot.exists()){
        const fetchItems = snapshot.val();
        listItems.innerHTML = "";

        for (var item in fetchItems){
            insertItem(item, fetchItems[item]);
        }
    } else {
        listItems.innerHTML = "<code>No items in the cart</code>"
    };
})
txtInput.addEventListener('input', () => {
    let text = txtInput.value;
    let len = text.trim();
    if (len == 0){
        btnSubmit.setAttribute('disabled', true);
    }
    else{
        btnSubmit.removeAttribute('disabled')      
    }
});
btnSubmit.addEventListener('click', (e) => {
    let inputValue = txtInput.value;
    push(listInDB, inputValue);

    clearInput();
    btnSubmit.setAttribute('disabled', true);
});

function clearInput(){
    txtInput.value = ""; 
}
function insertItem(ID, txtValue){
    const liItem = document.createElement('li');
    liItem.textContent = txtValue;
    listItems.appendChild(liItem);

    liItem.onclick = function(){
        let itemLocation = ref(database,`listItems/${ID}`);
        liItem.classList.add("deleted");
        removedItems.appendChild(liItem);
        remove(itemLocation);
    }
}
