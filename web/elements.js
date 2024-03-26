const clickEvent = "click"
const doubleClickEvent = "dblclick"
const keyEvent = "keyup"

const inputNodeName = "INPUT"
const textNodeName = "TEXT"
const buttonNodeName = "BUTTON"
const elementNodeName = "LI"

const anyEmlement = new EventTarget()

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
        loadButton: document.getElementById("load"),

        saveText: document.getElementById("save-text"),
        saveButton: document.getElementById("save"),

        editText: document.getElementById("edit-text"),
        editButton: document.getElementById("edit"),

        timeline: document.getElementById("timeline"),
    }
}

class ButtonAction {
    constructor(text, callback) {
        this.text = text
        this.callback = callback
    }
}
const startButtonText = "▶️"
const pauseButtonText = "⏸️"
const doneButtonText = "✅"
const restartButtonText = "⬅️"
const cancelButtonText = "❌"
function createButtonAction(text, callback) {
    return new ButtonAction(text, callback)
}
function createElementAction(action, id) {
    return createButtonAction(action.text, () => action.callback(id))
}

function createElementButton(buttonAction) {
    const elementButton = document.createElement("button")
    elementButton.innerText = buttonAction.text
    elementButton.onclick = buttonAction.callback
    return elementButton
}

function dispatchEventToAnyElement(event) {
    if (event.target.nodeName === elementNodeName) {
        anyEmlement.dispatchEvent(new CustomEvent(event.type, {
            detail: event.target.id
        }))
    } else if (event.target.nodeName === textNodeName
            || event.target.nodeName === inputNodeName) {
        anyEmlement.dispatchEvent(new CustomEvent(event.type, {
            detail: event.target.parentElement.id
        }))
    }
}

function createElement(item, buttonActions = []) {
    // <li id="uuid" class="item"><text>{text}</text><button>START</button></li>
    const element = document.createElement('li')
    element.className = "item"
    element.id = item.id

    const itemText = createText(item.text)
    element.appendChild(itemText)

    for (const action of buttonActions) {
        const elementButton = createElementButton(action)
        element.appendChild(elementButton)
    }

    element.addEventListener(clickEvent, dispatchEventToAnyElement)
    element.addEventListener(doubleClickEvent, dispatchEventToAnyElement)

    return element
}

function createText(text) {
    const htmlText = document.createElement("text")
    htmlText.innerText = text
    return htmlText
}

function createInput(item) {
    // <input title="name of saved file"></input>
    const element = document.createElement('input')
    element.className = "item"
    element.title = "element being edited"
    element.value = item.text
    return element
}

function getText(element) {
    if (element.nodeName == inputNodeName) {
        return element.value
    } else {
        return element.innerText;
    }
}

function setText(element, text) {
    if (element.nodeName == inputNodeName) {
        element.value = text
    } else {
        element.innerText = text;
    }
}

function clearText(element) {
    setText(element, "")
}

function addElement(list, element) {
    list.appendChild(element)
}

function addEventListener(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

function filterElements(list1, list2) {
    const result = []
    for (const elemten1 of list1) {
        let missing = true
        for (const elemten2 of list2) {
            if (elemten1.id === elemten2.id) {
                missing = false
                break
            }
        }
        if (missing) {
            result.push(elemten1)
        }
    }
    return result
}

function updateList(items, htmlList, buttonActions = []) {
    const elementsToRemove = filterElements(htmlList.children, items)
    const itemsToAdd = filterElements(items, htmlList.children)
    for (const element of elementsToRemove) {
        htmlList.removeChild(element)
    }
    for (const item of itemsToAdd) {
        const elementActions = buttonActions.map(action => createElementAction(action, item.id))
        const htmlElement = createElement(item, elementActions)
        addElement(htmlList, htmlElement)
    }
    const elements = [...htmlList.children]
    while (htmlList.lastElementChild) {
        htmlList.removeChild(htmlList.lastElementChild)
    }
    for (const item of items) {
        for (const element of elements) {
            if (item.id === element.id) {
                htmlList.appendChild(element)
                break
            }
        }
    }
}

const selectedClassname = "selected"
function selectElement(item) {
    const element = document.getElementById(item.id)
    if (!element.className.includes(selectedClassname)) {
        element.className += " " + selectedClassname
    }
}

function unselectElement(item) {
    const element = document.getElementById(item.id)
    element.className = element.className.replace(selectedClassname, "").trim()
}

function editElement(item) {
    const element = document.getElementById(item.id)
    element.insertBefore(createInput(item), element.firstChild.nextSibling)
    element.removeChild(element.firstChild)
}

function commitElement(item) {
    const element = document.getElementById(item.id)
    element.insertBefore(createText(item.text), element.firstChild.nextSibling)
    element.removeChild(element.firstChild)
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
        return [file.name, contents]
    } else {
        console.error(`Unexpected number of files: ${files.length}`)
    }
}

function click(htmlButton) {
    htmlButton.click()
}

function focus(htmlElement) {
    htmlElement.focus()
}

function unfocus(htmlElement) {
    htmlElement.blur()
}

function focusElement(id) {
    focus(document.getElementById(id).firstChild)
}

function unfocusElement(id) {
    unfocus(document.getElementById(id).firstChild)
}

function createTimeFragment(text, secsDuration, color) {
    // <div class="time-fragment"><text>Hello1</text></div>
    const timeFragment = document.createElement('div')
    timeFragment.className = "time-fragment"
    timeFragment.style = `flex: ${secsDuration}; background-color: ${color}`

    const timeFragmentText = createText(`${text} : ${Math.round(secsDuration)}s`)

    timeFragment.appendChild(timeFragmentText)

    return timeFragment
}

function appendToTimeline(timeline, text, secsDuration, color) {
    timeline.appendChild(createTimeFragment(text, secsDuration, color))
}

function clearTimeline(timeline) {
    while (timeline.lastElementChild) {
        timeline.removeChild(timeline.lastElementChild)
    }
}
