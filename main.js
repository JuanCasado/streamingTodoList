const duplicatedFile = /\(([^0-9]*)(\d+)([^0-9]*)\)$/;
function fileNameToDisplay(fileName) {
    if (fileName.endsWith(".json") && fileName.length > 5) {
        fileName = fileName.slice(0, fileName.length - 5)
    }
    const match = fileName.match(duplicatedFile);
    if (match) {
        console.log(match)
        fileName = fileName.replace(`(${match[2]})`, "")
    }
    return fileName.trim()
}

function fileNameToStore(fileName) {
    fileName = fileName.trim()
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

    addEventListener(anyEmlement, clickEvent, (event) => {
        selected.selectElement(event.detail)
    })

    addEventListener(anyEmlement, doubleClickEvent, (event) => {
        selected.selectElement(event.detail)
        selected.edit()
    })

    addEventListener(document, keyEvent, (event) => {
        console.log(event)
        console.log(event.target)
        if (event.code === "Escape") {
            inputs.saveText.blur()
            inputs.addTodoText.blur()
            selected.deactivate()
            // TODO: stop editing elements
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
                case 'KeyJ':        // fall-through
                case 'KeyW':        selected.change(UP);    return
                case 'KeyK':        // fall-through
                case 'KeyS':        selected.change(DOWN);  return
                case 'KeyH':        // fall-through
                case 'KeyA':        selected.change(LEFT);  return
                case 'KeyL':        // fall-through
                case 'KeyD':        selected.change(RIGHT); return
                case 'Delete':      // fall-through
                case 'Backspace':   // fall-through
                case 'KeyQ':        selected.delete();      return
                case 'KeyE':        selected.edit();        return
                case 'Space':       selected.toggle();      return
                case 'Tab':
                    if (event.target === inputs.addTodoButton
                    || event.target === inputs.addTodoText) {
                        inputs.saveText.focus()
                        event.preventDefault()
                    } else if (event.target === inputs.saveButton
                        || event.target === inputs.addSaveText) {
                        inputs.addTodoText.focus()
                        event.preventDefault()
                    }
                break
                case 'Enter':
                    if (event.target.nodeName !== inputNodeName) {
                        inputs.addTodoText.focus()
                    } else {
                        // TODO: save the edited element on Enter

                    }
                break
            }
        }
    })

    addSelectedListener(selected, selectedChangedEvent, ()=>{
        const item = selected.getItem()
        if (item === null) {
            return
        } else if (selected.active) {
            selectElement(item)
        } else {
            unselectElement(item)
        }
    })

    // TODO: do this every time a new timeline is created not with a timer
    setTimeout(() => {
        const h = (Math.floor(Math.random() * 360) + 1)
            .toString(10)
            .padStart(2, '0')
        const s = "100%"
        const l = "70%"
        document.documentElement.style.setProperty('--rand-color', `hsl(${h}, ${s}, ${l})`)
    }, 100)
}
