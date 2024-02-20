
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
        saveFile(saveJSON(), `todo-${Date.now()}.json`, 'application/json');
    })

    addEventListener(inputs.loadButton, clickEvent, async () => {
        const content = await loadFile()
        loadJSON(content)
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
