const UP = "UP"
const DOWN = "DOWN"
const LEFT = "LEFT"
const RIGHT = "RIGHT"

const selectedChangedEvent = "selectedChanged"

class Selected extends EventTarget {
    constructor(listArray) {
        super()
        this.listArray = listArray
        this.active = false
        this.list = 0
        this.index = 0
    }

    getList() {
        return this.listArray[this.list]
    }
    
    getIndex() {
        return Math.min(this.getList().length-1, this.index)
    }

    getItem() {
        return this.getList().items[this.getIndex()]
    }

    
    select(list, index) {
        this.list = list
        this.index = index
        this.activate()
        this.dispatchEvent(selectedChangedEvent)
    }
    
    deactivate() {
        this.active = false
        this.dispatchEvent(selectedChangedEvent)
    }
    activate() {
        this.active = true
        this.dispatchEvent(selectedChangedEvent)
    }
    toggle() {
        this.active = !this.active
        this.dispatchEvent(selectedChangedEvent)
    }

    edit() {
        if (!this.active) {
            return
        }
        this.getItem()
        this.getList().update()
    }

    delete() {
        if (!this.active) {
            return
        }
        this.getList().remove(this.getItem().id)
    }

    move(direction) {
        if (!this.active) {
            return
        }
        switch(direction) {
            case UP: {
                const currentIndex = this.getIndex()
                this.setIndex(currentIndex-1)
                const futureIndex = this.getIndex()
                console.log(UP, currentIndex, futureIndex)
                const itemToMove = this.getList().items[currentIndex]
                this.getList().items[currentIndex] = this.getList().items[futureIndex]
                this.getList().items[futureIndex] = itemToMove
                this.getList().update()
            } return
            case DOWN: {
                const currentIndex = this.getIndex()
                this.setIndex(currentIndex+1)
                const futureIndex = this.getIndex()
                console.log(DOWN, currentIndex, futureIndex)
                const itemToMove = this.getList().items[currentIndex]
                this.getList().items[currentIndex] = this.getList().items[futureIndex]
                this.getList().items[futureIndex] = itemToMove
                this.getList().update()
            } return
            case LEFT: {
                const itemToMove = this.getItem()
                this.getList().remove(itemToMove.id)
                this.setList(this.list-1)
                this.getList().push(itemToMove)
                this.setIndex(this.getList().length-1)
            } return
            case RIGHT: {
                const itemToMove = this.getItem()
                this.getList().remove(itemToMove.id)
                this.setList(this.list+1)
                this.getList().push(itemToMove)
                this.setIndex(this.getList().length-1)
            } return
        }
        this.dispatchEvent(selectedChangedEvent)
    }

    setIndex(index) {
        this.index = Math.min(Math.max(index, 0), this.getList().length-1)
    }

    setList(list) {
        this.list = Math.min(Math.max(list, 0), this.listArray.length-1)
    }

    change(direction) {
        if (!this.active) {
            return
        }
        switch(direction) {
            case UP: this.setIndex(this.index-1); return
            case DOWN: this.setIndex(this.index+1); return
            case LEFT: this.setList(this.list-1); return
            case RIGHT: this.setList(this.list+1); return
        }
        this.dispatchEvent(selectedChangedEvent)
    }
}

function addSelectedListener(selected, event, callback) {
    selected.addEventListener(event, callback);
}

function getSelected(listArray) {
    return new Selected(listArray)
}
