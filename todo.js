
const started = Date.now()

let toDo = []
let onProgress = null
let done = []

class Item {
    constructor(text) {
        this.text = text
        this.id = crypto.randomUUID()
    }
}

class OnProgressItem {
    constructor(item) {
        this.item = item
        this.started = Date.now()
    }

    done() {
        return DoneItem(this.item)
    }
    
    toDo() {
        return TodoItem(this.item)
    }
}

class TodoItem {
    constructor(item) {
        this.item = item
    }

    done() {
        return DoneItem(this.item)
    }

    start() {
        return OnProgressItem(this)
    }
}

class DoneItem {
    constructor(item) {
        this.item = item
        this.done = Date.now()
    }

    toDo() {
        return TodoItem(this.item)
    }

    start() {
        return OnProgressItem(this)
    }
}


function setupInputs(inputs) {
    console.log("SETTING UP!")
    
    inputs.todoList.appendChild(createItem("AWESOME!!!!!!!!! aaaa bbbbbbbbb kkkkkkkkk"));
}
