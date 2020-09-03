const { ipcRenderer } = require('electron');

class Document {
    constructor() {
        this.strokes = []
        this.shapes = []
        this.color = "#000000"
        this.drawing = false
    }

    rect(x, y, w, h) {
        this.shapes.push({
            shape: "rect",
            bounds: [x, y, w, h]
        })
    }

    circle(x, y, w, h) {
        this.shapes.push({
            shape: "circle",
            bounds: [x, y, w, h]
        })
    }

    startStroke(x, y) {
        this.strokes.push({
            color: this.color,
            points: [[x, y]]
        })
        this.drawing = true
    }

    continueStroke(x, y) {
        if (this.drawing) {
            this.getLastStroke().points.push([x, y])
        }
    }

    endStroke() {
        this.drawing = false
    }

    changeLastStrokeColor(color) {
        this.getLastStroke().color = color
    }

    getLastStroke() {
        return this.strokes[this.strokes.length - 1]
    }

    removeLastStroke() {
        this.strokes.pop()
        this.endStroke()
    }

    clear() {
        this.strokes = []
    }

    save() {
        ipcRenderer.send('save-document', {
            strokes: this.strokes
        })
    }

    load(callback) {
        ipcRenderer.send('load-document')
        ipcRenderer.once('load-document', (event, data) => {
            if (data != null) {
                console.log("got")
                this.strokes = data.strokes
                if (callback) {
                    callback()
                }
            }
        })
    }
}
