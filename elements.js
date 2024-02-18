const clickEvent = "click"

const inputNodeName = "INPUT"

function getDOMInputs() {
    return {
        todoList: document.getElementById("todo-list" ),
        addTodoText: document.getElementById("add-todo-text"),
        addTodoButton: document.getElementById("add-todo-button"),
        startTimer: document.getElementById("start-timer"),
        elapsedTimer: document.getElementById("elapsed-timer"),
        currentTimer: document.getElementById("current-timer"),
        currentItemText: document.getElementById("current-item-text"),
        currentItemDone: document.getElementById("current-item-done"),
        doneList: document.getElementById("done-list" ),
        startButton: document.getElementById("start"),
        stopButton: document.getElementById("sop"),
        clearButton: document.getElementById("clear"),
        saveButton: document.getElementById("save"),
        loadButton: document.getElementById("load"),
    }
}

function createItem(text) {
    // <li class="item"><text>{text}</text><button>START</button></li>
    const item = document.createElement('li')
    item.className = "item"
    const itemText = document.createElement("text")
    itemText.innerText = text
    item.appendChild(itemText)
    const itemButton = document.createElement("button")
    itemButton.innerText = "START"
    // TODO: add callback to the button here?
    item.appendChild(itemButton)
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

function updateList(source, htmlList) {
    while (htmlList.lastElementChild) {
        htmlList.removeChild(htmlList.lastElementChild);
    }
    for (const item of source) {
        const htmlElement = createItem(item.text)
        addItem(htmlList, htmlElement)
    }
}
