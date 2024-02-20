
function fileNameToDisplay(fileName) {
    if (fileName.endsWith(".json") && fileName.length > 5) {
        fileName = fileName.slice(0, fileName.length - 5)
    }
    return fileName
}

function fileNameToStore(fileName) {
    if (fileName === "") {
        fileName = `todo-${Date.now()}.json`
    }
    if (!fileName.endsWith(".json")) {
        fileName += ".json"
    }
    return fileName
}

function main() {
    const inputs = getDOMInputs()
    const lists = getItemLists()
    const timers = getTimersLists()

    addEventListener(inputs.addTodoButton, clickEvent, () => {
        const text = getText(inputs.addTodoText)
        clearText(inputs.addTodoText)
        createTodoItem(text)
    })

    addEventListener(inputs.clearButton, clickEvent, () => {
        clear()
    })

    addEventListener(inputs.saveButton, clickEvent, () => {
        const fileName = getText(inputs.saveText)
        saveFile(saveJSON(), fileNameToStore(fileName), 'application/json');
    })

    addEventListener(inputs.loadButton, clickEvent, async () => {
        const [name, content] = await loadFile()
        loadJSON(content)
        setText(inputs.saveText, fileNameToDisplay(name))
    })
    
    addListListener(lists.toDo, listChangedEvent, () => {
        updateList(lists.toDo.getItems(), inputs.todoList, [
            createButtonAction(startButtonText, startItem),
        ])
    })

    addListListener(lists.onProgress, listChangedEvent, () => {
        updateList(lists.onProgress.getItems(), inputs.onProgressList, [
            createButtonAction(pauseButtonText, pauseItem),
            createButtonAction(doneButtonText, doneItem),
        ])
        if (lists.onProgress.hasItems()) {
            elapsedTimer(timers.elapsed)
        } else {
            frozenTimer(timers.elapsed)
        }
    })

    addListListener(lists.done, listChangedEvent, () => {
        updateList(lists.done.getItems(), inputs.doneList, [
            createButtonAction(restartButtonText, restartItem),
            createButtonAction(cancelButtonText, cancelItem),
        ])
    })

    addTimerListener(timers.current, onTimerChangedEvent, () => {
        setText(inputs.currentTimer, timers.current.getTime())
    })
    addTimerListener(timers.elapsed, onTimerChangedEvent, () => {
        setText(inputs.elapsedTimer, timers.elapsed.getTime())
    })
    addTimerListener(timers.start, onTimerChangedEvent, () => {
        setText(inputs.startTimer, timers.start.getTime())
    })
}
