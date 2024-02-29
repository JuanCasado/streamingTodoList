const onTimerChangedEvent = "onTimerChanged"

class Timer extends EventTarget {
    constructor() {
        super()
        this.interval = null
        this.offset = 0
        this.updateInterval = 0
    }

    reset(updateInterval, offset) {
        if (this.updateInterval === updateInterval
            && this.interval !== null
            && this.offset === this.offset) {
            return
        }
        this.stop()
        this.updateInterval = updateInterval
        this.start()
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

    stop() {
        if (this.interval === null) {
            return
        }
        clearInterval(this.interval)
        this.interval = null
    }

    start() {
        if (this.updateInterval) {
            stop()
            this.interval = setInterval(()=>{ this.update() }, this.updateInterval)
        }
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

function stopTimer(timer) {
    timer.stop()
    return timer
}

function startTimer(timer) {
    timer.start()
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
