
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
    const selected = getSelected([lists.toDo, lists.onProgress, lists.done])

    addEventListener(inputs.addTodoButton, clickEvent, () => {
        const text = getText(inputs.addTodoText)
        clearText(inputs.addTodoText)
        createTodoItem(text)
    })

    addEventListener(inputs.clearButton, clickEvent, () => {
        clear()
    })

    addEventListener(inputs.saveButton, clickEvent, () => {
        const fileName = fileNameToStore(getText(inputs.saveText))
        if (fileName === "") {
            return
        }
        saveFile(saveTodoJSON(), fileName, "application/json");
    })

    addEventListener(inputs.loadButton, clickEvent, async () => {
        const [name, content] = await loadFile()
        loadTodoJSON(content)
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

    
    addEventListener(inputs.startButton, clickEvent, async () => {
        startTimer(timers.elapsed)
        startTimer(timers.current)
    })

    addEventListener(inputs.stopButton, clickEvent, async () => {
        stopTimer(timers.elapsed)
        stopTimer(timers.current)
    })

    addTimerListener(timers.start, onTimerChangedEvent, () => {
        setText(inputs.startTimer, timers.start.getTime())
    })
    addTimerListener(timers.elapsed, onTimerChangedEvent, () => {
        setText(inputs.elapsedTimer, timers.elapsed.getTime())
    })
    addTimerListener(timers.current, onTimerChangedEvent, () => {
        setText(inputs.currentTimer, timers.current.getTime())
    })


    document.addEventListener('keyup', (event)=>{
        console.log(event)
        if (event.code === "Escape") {
            inputs.saveText.blur()
            inputs.addTodoText.blur()
            selected.deactivate()
        } else if(event.target === inputs.addTodoText) {
            if (event.code === "Enter") {
                inputs.addTodoButton.click()
            }
        } else if(event.target === inputs.saveText) {
            if (event.code == "Enter") {
                inputs.saveButton.click()
            }
        } else {
            switch(event.code) {
                case 'ArrowUp':     selected.move(UP);      return
                case 'ArrowDown':   selected.move(DOWN);    return
                case 'ArrowLeft':   selected.move(LEFT);    return
                case 'ArrowRight':  selected.move(RIGHT);   return
                case 'KeyW':           selected.change(UP);    return
                case 'KeyS':           selected.change(DOWN);  return
                case 'KeyA':           selected.change(LEFT);  return
                case 'KeyD':           selected.change(RIGHT); return
                case 'KeyQ':           selected.delete();      return
                case 'KeyE':           selected.edit();        return
                case 'Space':       selected.toggle();      return
            }
        }
    })

    addSelectedListener(selected, selectedChangedEvent, ()=>{
        const item = selected.getItem()
        // TODO: maybe we can avoid this for loop?
        for (const element of document.getElementsByClassName(selectedClassname)) {
            unselectElement(element)
        }
        if (item === null) {
            return
        }
        if (selected.active) {
            selectElement(item)
        } else {
            unselectElement(item)
        }
    })
}
