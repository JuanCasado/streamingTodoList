const duplicatedFile = /\(([^0-9]*)(\d+)([^0-9]*)\)$/;
function fileNameToDisplay(fileName) {
    if (fileName.endsWith(".json") && fileName.length > 5) {
        fileName = fileName.slice(0, fileName.length - 5)
    }
    const match = fileName.match(duplicatedFile);
    if (match) {
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
    const selected = getSelected(Object.values(lists))

    addEventListener(inputs.addTodoButton, clickEvent, () => {
        const text = getText(inputs.addTodoText)
        clearText(inputs.addTodoText)
        createTodoItem(text)
    })

    addEventListener(inputs.clearButton, clickEvent, () => {
        clear()
        clearTimeline(inputs.timeline)
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
        click(inputs.clearButton)
        loadTodoJSON(content)
        setText(inputs.saveText, fileNameToDisplay(name))
        recomputeTimeline(timeline, Object.values(lists))
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

    addListListener(lists.done, pushItemEvent, () => {
        const lastItem = lists.done.items[lists.done.items.length - 1]
        if (lastItem.startedAt.length === lastItem.stoppedAt.length) {
            const startTime = lastItem.startedAt[lastItem.startedAt.length - 1]
            const endTime = lastItem.stoppedAt[lastItem.stoppedAt.length - 1]
            const secsDuration = Math.abs((endTime - startTime) / 1000)
            appendToTimeline(inputs.timeline, lastItem.text, secsDuration, lastItem.color)
        } else {
            console.error(`Item with id=${id} is broken`)
        }
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
        const item = selected.getItem()
        if (item !== null) {
            editElement(item)
            focusElement(item.id)
            selected.deactivate()
        }
    })

    addEventListener(document, keyEvent, (event) => {
        if (event.code === "Escape") {
            unfocus(inputs.saveText)
            unfocus(inputs.addTodoText)
            selected.deactivate()
            const item = selected.getItem()
            if (item !== null) {
                commitElement(item)
            }
        } else if(event.target === inputs.addTodoText) {
            if (event.code === "Enter") {
                click(inputs.addTodoButton)
            }
        } else if(event.target === inputs.saveText) {
            if (event.code == "Enter") {
                click(inputs.saveButton)
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
                case 'Delete':      selected.delete();      return
                case 'Space':       selected.toggle();      return
                case 'KeyE': {
                    const item = selected.getItem()
                    if (item !== null) {
                        editElement(item)
                        focusElement(item.id)
                        selected.deactivate()
                    }
                } return
                case 'Tab':
                    if (event.target === inputs.addTodoButton
                    || event.target === inputs.addTodoText) {
                        focus(inputs.saveText)
                        event.preventDefault()
                    } else if (event.target === inputs.saveButton
                        || event.target === inputs.addSaveText) {
                        focus(inputs.addTodoText)
                        event.preventDefault()
                    }
                break
                case 'Enter':
                    if (event.target.nodeName !== inputNodeName) {
                        focus(inputs.addTodoText)
                    } else {
                        const text = getText(event.target)
                        const item = getItem(event.target.parentElement.id)
                        if (item !== null) {
                            item.text = text
                            commitElement(item)
                            selected.selectElement(item.id)
                        }
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

    addEventListener(inputs.editButton, clickEvent, async () => {
        console.log("Requesting video edit!")
        const response = await fetch(getText(inputs.editText)+'/editVideo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'stl-web',
                'X-Request-Id': crypto.randomUUID(),
            },
            body: saveTodoJSON(),
        })

        const id = response.headers.get('X-Response-Id')
        const content = await response.text()
        console.log(`Response ${id}: ${content}`)
        console.log(response)
    })
}

function sortTimeFragment(lhs, rhs) {
    return lhs.start < rhs.start
}

function recomputeTimeline(timeline, lists) {
    clearTimeline(timeline)
    const timeFragments = []
    for (const list of lists) {
        for (const item of list.getItems()) {
            for (let i = 0; i < Math.min(item.startedAt.length, item.stoppedAt.length); ++i) {
                timeFragments.push({
                    text: item.text,
                    color: item.color,
                    start: item.startedAt[i],
                    stop: item.stoppedAt[i],
                })
            }
        }
    }

    timeFragments.sort(sortTimeFragment)
    for (const timeFragment of timeFragments) {
        const secsDuration = Math.abs((timeFragment.stop - timeFragment.start) / 1000)
        appendToTimeline(timeline, timeFragment.text, secsDuration, timeFragment.color)
    }
}
