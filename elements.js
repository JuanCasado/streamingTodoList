const clickEvent = "click"

const inputNodeName = "INPUT"

function getDOMInputs() {
    return {
        todoList: document.getElementById("todo-list" ),
        onProgressList: document.getElementById("on-progress-list"),
        doneList: document.getElementById("done-list" ),
        
        addTodoText: document.getElementById("add-todo-text"),
        addTodoButton: document.getElementById("add-todo-button"),
        
        startTimer: document.getElementById("start-timer"),
        elapsedTimer: document.getElementById("elapsed-timer"),
        currentTimer: document.getElementById("current-timer"),
        
        startButton: document.getElementById("start"),
        stopButton: document.getElementById("sop"),
        clearButton: document.getElementById("clear"),
        saveButton: document.getElementById("save"),
        loadButton: document.getElementById("load"),
    }
}

class ButtonAction {
    constructor(text, callback) {
        this.text = text
        this.callback = callback
    }
}
const startButtonText = "START"
const pauseButtonText = "PAUSE"
const doneButtonText = "DONE"
const restartButtonText = "RESTART"
const cancelButtonText = "CANCEL"
function createButtonAction(text, callback) {
    return new ButtonAction(text, callback)
}
function createItemAction(action, id) {
    return createButtonAction(action.text, ()=>action.callback(id))
}

function createItemButton(buttonAction) {
    const itemButton = document.createElement("button")
    itemButton.innerText = buttonAction.text
    itemButton.onclick = buttonAction.callback
    return itemButton
}

function createItem(text, buttonActions = []) {
    // <li class="item"><text>{text}</text><button>START</button></li>
    const item = document.createElement('li')
    item.className = "item"
    const itemText = document.createElement("text")
    itemText.innerText = text
    item.appendChild(itemText)
    for (const action of buttonActions) {
        const itemButton = createItemButton(action)
        item.appendChild(itemButton)
    }
    return item
}

function getText(item) {
    if (item.nodeName == inputNodeName) {
        return item.value
    } else {
        return item.innerText;
    }
}

function clearText(item) {
    if (item.nodeName == inputNodeName) {
        item.value = ""
    } else {
        item.innerText = "";
    }
}

function addItem(list, item) {
    list.appendChild(item)
}

function addEventListener(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

function updateList(source, htmlList, buttonActions = []) {
    buttonActions = Array.isArray(buttonActions)? buttonActions : [buttonActions]
    while (htmlList.lastElementChild) {
        htmlList.removeChild(htmlList.lastElementChild);
    }
    for (const item of source) {
        const itemActions = buttonActions.map(action => createItemAction(action, item.id))
        const htmlElement = createItem(item.text, itemActions)
        addItem(htmlList, htmlElement)
    }
}

function saveFile(content, fileName, contentType) {
    const a = document.createElement("a")
    const file = new Blob([content], {type: contentType})
    a.href = URL.createObjectURL(file)
    a.download = fileName
    a.click()
}

async function loadFile() {
    files = await window.showOpenFilePicker()
    if (files.length == 1) {
        const file = await files[0].getFile()
        const contents = await file.text()
        return contents
    } else {
        console.error(`Unexpected number of files: ${files.length}`)
    }
}