import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: ""
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const aldiShoppingListInDB = ref(database, "Store/Aldi/shoppingListAldi")
const tescoShoppingListInDB = ref(database, "Store/Tesco/shoppingListTesco")
const storesInDB = ref(database, "Stores")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

const aldiShoppingListel = document.getElementById("aldi-list")
const tescoShoppingListel = document.getElementById("tesco-list")

const aldiEl = document.querySelector(".aldi")
const tescoEl = document.querySelector(".tesco")
let globalAldiChosen = null
let globalTescoChosen = null

aldiEl.addEventListener("click", function() {
    globalAldiChosen = true
    globalTescoChosen = null

})

tescoEl.addEventListener("click", function() {
    globalTescoChosen = true
    globalAldiChosen = null

})



addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    if (globalAldiChosen == true) {
        push(aldiShoppingListInDB, inputValue)
        clearInputFieldEl()
    } else if (globalTescoChosen == true) {
        
        push(tescoShoppingListInDB, inputValue)
        clearInputFieldEl()
    }
    
    

})




onValue(aldiShoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl(aldiShoppingListel)
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem, aldiShoppingListel)
        }    
    } else {
        
        aldiShoppingListel.innerHTML = '<div class="no-items">No items here... yet</div>';
    }
})

onValue(tescoShoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        
        clearShoppingListEl(tescoShoppingListel)
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem, tescoShoppingListel)
        }
    } else {
        tescoShoppingListel.innerHTML = '<div class="no-items">No items here... yet</div>'
    }
})



function clearShoppingListEl(shoppingList) {
    shoppingList.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item, shoppingList) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDbAldi = ref(database, `Store/Aldi/shoppingListAldi/${itemID}`)
        let exactLocationOfItemInDbTesco = ref(database, `Store/Tesco/shoppingListTesco/${itemID}`)
        remove(exactLocationOfItemInDbAldi)
        remove(exactLocationOfItemInDbTesco)
    })
    
    shoppingList.append(newEl)
}


