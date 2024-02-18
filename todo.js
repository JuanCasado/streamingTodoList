
const started = Date.now()

let toDo = []
let onProgress = null
let done = []

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

function createNewItem(text) {
    const id = crypto.randomUUID()
    const createdAt = Date.now()
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

function createTodoItem() {
    
}

function createOnProgressItem() {

}

function createDoneItem() {

}

// Create the items from load

function loadNewItem(text) {
    const id = crypto.randomUUID()
}

function loadTodoItem() {

}

function loadOnProgressItem() {

}

function loadDoneItem() {

}

// Change an item state

function startItem() {

}

function startItem() {

}

// Delete items



