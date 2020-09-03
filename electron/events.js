
class EventManager {
    constructor() {
        this.eventMap = {}
        this.registerMouseDownMove()
        // this.registerMovementThenHold()
        // this.registerMouseDownNoMovement()
    }

    on(eventName, func) {
        if (undefined === this.eventMap[eventName]) {
            this.eventMap[eventName] = []
        }
        this.eventMap[eventName].push(func)
    }

    trigger(eventName, ...args) {
        for (var i in this.eventMap[eventName]) {
            this.eventMap[eventName][i](...args)
        }
    }

    registerMouseDownMove() {
        var down = false
        this.on("mouseDown", () => {
            down = true
        })
        this.on("mouseUp", () => {
            down = false
        })
        this.on("mouseMove", (x, y, dx, dy) => {
            if (down) {
                this.trigger("mouseDownMove", x, y, dx, dy)
            }
        })
    }

    registerTick1s() {
    }

    registerMouseDownNoMovement() {
        var movements = [0]
        var moving = false
        this.on("mouseDownMove", (x, y, dx, dy) => {
            let movement = Math.sqrt(dx * dx + dy * dy)
            movements[movements.length - 1] += movement
        })
        this.on("tick100ms", () => {
            if (movements.length > 5) {
                var movement = movements.reduce((a, b) => a + b)
                if (movement < 15) {
                    this.trigger("mouseDownNoMovement")
                    movements = [0]
                    moving = false
                } else {
                    movements.push(0)
                    movements.shift()
                }
            }
            if (moving) {
                movements.push(0)
            }
        })
        this.on("mouseUp", () => {
            movements = []
            moving = false
        })
        this.on("mouseDown", () => {
            moving = true
        })
        var ticks
        this.ontick
    }

    registerMovementThenHold() {
        var movement = 0
        var ticks = [0]
        var tracking = false
        this.on("mouseMoveDown", (x, y) => {
            bigMovement
            points.push()
        })
        this.on("mouseDown", () => {
            tracking = true
        })
        this.on("mouseUp", () => {
            tracking = false
        })
        this.on("tick100ms", () => {
            if (tracking) {
                console.log("100ms moving")
            }
        })
    }
}

class MovementThenHold {
    constructor() {

    }
}




