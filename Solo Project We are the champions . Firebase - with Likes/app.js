import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endorsements-c1030-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const myApp = initializeApp(appSettings)
const myData = getDatabase(myApp)
const myDatabaseInFB = ref(myData, "endo")

const endorsement = document.getElementById("endorsement")
const fromInput = document.getElementById("from")
const toInput = document.getElementById("to")
const publishBtn = document.getElementById("publish")
const listContainer = document.querySelector(".list")

function renderApp() {
    if (endorsement.value && fromInput.value && toInput.value) {
        const myObject = {
            comment: endorsement.value,
            from: fromInput.value,
            to: toInput.value
        }

        push(myDatabaseInFB, myObject)

        clearAllinputs()
    }
}

onValue(myDatabaseInFB, function (snapshot) {
    if (snapshot.exists()) {
        let myDataObject = Object.entries(snapshot.val())
        listContainer.innerHTML = ""

        for (let i = 0; i < myDataObject.length; i++) {
            let myNewObject = myDataObject[i][1]
            createElements(myNewObject.comment, myNewObject.from, myNewObject.to, myDataObject[i][0])
        }
    } else {
        listContainer.innerHTML = "Nothing to show.... yet"
    }
})

function clearAllinputs() {
    endorsement.value = ""
    fromInput.value = ""
    toInput.value = ""
}

function createElements(comment, from, to, id) {
    const listEl = document.createElement("li")
    listEl.classList = "list-item flex"

    const firstSpan = document.createElement("span")
    firstSpan.classList = "reciever"
    firstSpan.textContent = `To ${to}`

    const secondSpan = document.createElement("span")
    secondSpan.classList = "comment"
    secondSpan.textContent = comment

    const thirdSpan = document.createElement("span")
    thirdSpan.classList = "sender"
    thirdSpan.textContent = `From ${from}`

    const myDiv = document.createElement("div")
    myDiv.classList = "likes flex"

    const icon = document.createElement("i")
    icon.classList = "likes-icon fa-regular fa-heart"

    const textNumber = document.createElement("p")
    textNumber.classList = "likes-num"
    let myNum = 0
    textNumber.textContent = myNum


    myDiv.append(icon, textNumber)
    listEl.append(firstSpan, secondSpan, thirdSpan, myDiv)
    listContainer.appendChild(listEl)

    let preventLiDoubleClick = false;

    listEl.addEventListener("dblclick", function () {
        if (!preventLiDoubleClick) {
            let myDataLocation = ref(myData, `endo/${id}`)
            remove(myDataLocation)
        }

        preventLiDoubleClick = false
    })

    icon.addEventListener("click", function () {
        preventLiDoubleClick = true;

        icon.classList.toggle("fa-solid")
        if (icon.classList.contains("fa-solid")) {
            myNum++
        } else {
            myNum--
        }
        textNumber.textContent = myNum

        setTimeout(() => {
            preventLiDoubleClick = false;
        }, 100);
    })


}

publishBtn.addEventListener("click", renderApp)