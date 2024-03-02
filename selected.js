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
        return Math.max(Math.min(this.getList().length-1, this.index), 0)
    }

    getItem() {
        const index = this.getIndex()
        const list = this.getList().items
        if (index >= list.length) {
            return null
        }
        return list[this.getIndex()]
    }

    
    select(list, index) {
        this.list = list
        this.index = index
        this.activate()
        this.dispatchEvent(new Event(selectedChangedEvent))
    }
    
    deactivate() {
        this.active = false
        this.dispatchEvent(new Event(selectedChangedEvent))
    }
    activate() {
        if (this.getItem() === null) {
            return
        }
        this.active = true
        this.dispatchEvent(new Event(selectedChangedEvent))
    }
    toggle() {
        if (this.getItem() === null) {
            return
        }
        this.active = !this.active
        this.dispatchEvent(new Event(selectedChangedEvent))
    }

    edit() {
        if (!this.active) {
            return
        }
        if (this.getItem() === null) {
            return
        }
        this.getItem()
        this.getList().update()
    }

    delete() {
        if (!this.active) {
            return
        }
        if (this.getItem() === null) {
            return
        }
        this.getList().remove(this.getItem().id)
    }

    move(direction) {
        if (!this.active) {
            return
        }
        if (this.getItem() === null) {
            return
        }
        switch(direction) {
            case UP: {
                const currentIndex = this.getIndex()
                this.setIndex(currentIndex-1)
                const futureIndex = this.getIndex()
                const itemToMove = this.getList().items[currentIndex]
                this.getList().items[currentIndex] = this.getList().items[futureIndex]
                this.getList().items[futureIndex] = itemToMove
                this.getList().update()
            } break
            case DOWN: {
                const currentIndex = this.getIndex()
                this.setIndex(currentIndex+1)
                const futureIndex = this.getIndex()
                const itemToMove = this.getList().items[currentIndex]
                this.getList().items[currentIndex] = this.getList().items[futureIndex]
                this.getList().items[futureIndex] = itemToMove
                this.getList().update()
            } break
            case LEFT: {
                const itemToMove = this.getItem()
                this.getList().remove(itemToMove.id)
                this.setList(this.list-1)
                this.getList().push(itemToMove)
                this.setIndex(this.getList().length-1)
            } break
            case RIGHT: {
                const itemToMove = this.getItem()
                this.getList().remove(itemToMove.id)
                this.setList(this.list+1)
                this.getList().push(itemToMove)
                this.setIndex(this.getList().length-1)
                
            } break
        }
        this.dispatchEvent(new Event(selectedChangedEvent))
    }

    setIndex(index) {
        this.index = Math.max(Math.min(index, this.getList().length-1), 0)
    }

    setList(list) {
        if (list < 0) {
            list = this.listArray.length + (-1 * list)
        }
        this.list = Math.max(Math.min(list % this.listArray.length, this.listArray.length-1), 0)
    }

    change(direction) {
        if (this.getItem() === null) {
            return
        }
        if (!this.active) {
            return
        }
        switch(direction) {
            case UP:    this.setIndex(this.getIndex()-1);   break
            case DOWN:  this.setIndex(this.getIndex()+1);   break
            case LEFT:
                do {
                    this.setList(this.list-1)
                } while(this.getList().length === 0);
                break
            case RIGHT:
                do {
                    this.setList(this.list+1)
                } while(this.getList().length === 0);
                break
        }
        console.log(this)
        this.dispatchEvent(new Event(selectedChangedEvent))
    }
}

function addSelectedListener(selected, event, callback) {
    selected.addEventListener(event, callback);
}

function getSelected(listArray) {
    return new Selected(listArray)
}
