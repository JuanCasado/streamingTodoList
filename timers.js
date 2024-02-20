const onTimerChangedEvent = "onTimerChanged"

class Timer extends EventTarget {
    constructor() {
        super()
        this.interval = null
        this.offset = 0
    }

    reset(updateInterval, offset) {
        this.cancel()
        this.interval = updateInterval? setInterval(()=>{ this.update() }, updateInterval) : null
        if (offset === 0) {
            this.offset = 0
        } else {
            const zeroDate = new Date(0)
            const hours = parseInt(zeroDate.toLocaleTimeString([], {hour: "numeric"})) * 60 * 60
            const minutes = parseInt(zeroDate.toLocaleTimeString([], {minute: "numeric"}))  * 60
            const seconds = parseInt(zeroDate.toLocaleTimeString([], {second: "numeric"}))
            const localOffset = (hours + minutes + seconds) * 1000
            this.offset = offset + localOffset
        }
        this.update()
    }

    update() {
        this.dispatchEvent(new Event(onTimerChangedEvent))
    }

    getTime() {
        const date = new Date(Date.now() - this.offset)
        return date.toLocaleTimeString()
    }

    cancel() {
        if (this.interval === null) {
            return
        }
        clearInterval(this.interval)
        this.interval + null
    }
}

function fixedTimer(timer = new Timer()) {
    timer.reset(null, 0)
    return timer
}

function currentTimer(timer = new Timer()) {
    timer.reset(500, 0)
    return timer
}

function frozenTimer(timer = new Timer()) {
    timer.reset(0, Date.now())
    return timer
}

function elapsedTimer(timer = new Timer()) {
    timer.reset(500, Date.now())
    return timer
}

function addTimerListener(timer, event, callback) {
    timer.addEventListener(event, callback);
    timer.update()
}

function getTimersLists() {
    return {
        start : fixedTimer(),
        elapsed : frozenTimer(),
        current : currentTimer(),
    }
}
