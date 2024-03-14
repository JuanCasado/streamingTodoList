
const listChangedEvent = "listChanged"
const pushItemEvent = "pushItem"
const removeItemEvent = "removeItem"

class ItemList extends EventTarget {
    constructor() {
        super()
        this.items = []
    }

    update() {
        this.dispatchEvent(new Event(listChangedEvent))
    }

    push(item) {
        this.items.push(item)
        this.dispatchEvent(new Event(listChangedEvent))
        this.dispatchEvent(new Event(pushItemEvent))
    }

    getIndex(id) {
        for (let index = 0; index < this.items.length; ++index) {
            const item = this.items[index]
            if (item.id === id) {
                return index
            }
        }
        console.error(`Unfetched index: Item with id ${id} is missing`)
        return null
    }

    getItem(id) {
        for (const item of this.items) {
            if (item.id === id) {
                return item
            }
        }
        console.error(`Unfetched item: Item with id ${id} is missing`)
        return null
    }

    hasItem(id) {
        for (const item of this.items) {
            if (item.id === id) {
                return true
            }
        }
        return false
    }

    remove(id) {
        const index = this.getIndex(id)
        if (index === null) {
            console.error(`Item with id ${id} was not removed!`)
            return
        }

        this.items.splice(index, 1)
        this.dispatchEvent(new Event(listChangedEvent))
        this.dispatchEvent(new Event(removeItemEvent))
    }

    clear() {
        if (this.items.length === 0) {
            return
        }
        this.items.length = 0
        this.dispatchEvent(new Event(listChangedEvent))
        this.dispatchEvent(new Event(removeItemEvent))
    }

    load(json) {
        this.items.length = 0
        for (const item of json["items"]) {
            const id = item["id"]
            const text = item["text"]
            const createdAt = item["createdAt"]
            const startedAt = item["startedAt"]
            const stoppedAt = item["stoppedAt"]
            const completedAt = item["completedAt"]
            this.items.push(new Item(
                id,
                text,
                createdAt? new Date(createdAt) : null,
                startedAt.map(date => new Date(date)),
                stoppedAt.map(date => new Date(date)),
                completedAt? new Date(createdAt) : null,
            ))
        }
        this.dispatchEvent(new Event(listChangedEvent))
        this.dispatchEvent(new Event(removeItemEvent))
        this.dispatchEvent(new Event(pushItemEvent))
    }

    getItems() {
        return this.items
    }

    hasItems() {
        return this.items.length > 0
    }

    get length() {
        return this.items.length
    }
}

const toDo = new ItemList()
const onProgress = new ItemList()
const done = new ItemList()

function getItemLists() {
    return {
        toDo: toDo,
        onProgress: onProgress,
        done: done,
    }
}

function addListListener(list, event, callback) {
    list.addEventListener(event, callback);
}

class Item {
    constructor(id, text, createdAt, startedAt, stoppedAt, completedAt) {
        this.id = id
        this.text = text
        this.createdAt = createdAt
        this.startedAt = Array.isArray(startedAt)? startedAt : [startedAt]
        this.stoppedAt = Array.isArray(stoppedAt)? stoppedAt : [stoppedAt]
        this.completedAt = completedAt
    }
}

// Create the items from scratch

function createTodoItem(text) {
    if (text.length == 0) {
        return
    }

    const id = crypto.randomUUID()
    const createdAt = new Date()
    const startedAt = []
    const stoppedAt = []
    const completedAt = null
    toDo.push(new Item(
        id,
        text,
        createdAt,
        startedAt,
        stoppedAt,
        completedAt,
    ))
}

// Change an item state

function setAsOnProgress(item) {
    for (const itemOnProgress of onProgress.getItems()) {
        pauseItem(itemOnProgress.id)
    }
    onProgress.push(item)
}

function startItem(id) {
    const item = toDo.getItem(id)
    if (item === null) {
        console.error(`Item with id ${id} was not started!`)
        return
    }

    item.startedAt.push(new Date())

    toDo.remove(id)
    setAsOnProgress(item)
}

function pauseItem(id) {
    const item = onProgress.getItem(id)
    if (item === null) {
        console.error(`Item with id ${id} was not paused!`)
        return
    }

    item.stoppedAt.push(new Date())

    onProgress.remove(item.id)
    toDo.push(item)
}

function doneItem(id) {
    const item = onProgress.getItem(id)
    if (item === null) {
        console.error(`Item with id ${id} was not done!`)
        return
    }

    const now = new Date()
    item.stoppedAt.push(now)
    item.completedAt = now

    onProgress.remove(item.id)
    done.push(item)
}

function restartItem(id) {
    const item = done.getItem(id)
    if (item === null) {
        console.error(`Item with id ${id} was not restarted!`)
        return
    }

    item.startedAt.push(new Date())

    done.remove(id)
    setAsOnProgress(item)
}

function cancelItem(id) {
    const item = done.getItem(id)
    if (item === null) {
        console.error(`Item with id ${id} was not canceled!`)
        return
    }

    completedAt = null

    done.remove(id)
    toDo.push(item)
}

// Fetching from any list

function getList(id) {
    for (const list of Object.values(getItemLists())) {
        if (list.hasItem(id)) {
            return list
        }
    }
    return null
}

function getItem(id) {
    const list = getList(id)
    if (list === null) {
        return null
    }
    return list.getItem(id)
}

function getIndex(id) {
    const list = getList(id)
    if (list === null) {
        return null
    }
    return list.getIndex(id)
}

// Other actions

function clear() {
    toDo.clear()
    onProgress.clear()
    done.clear()
}

function saveTodoJSON() {
    return JSON.stringify(getItemLists())
}

function loadTodoJSON(text) {
    const json = JSON.parse(text)
    toDo.load(json["toDo"])
    onProgress.load(json["onProgress"])
    done.load(json["done"])
}
