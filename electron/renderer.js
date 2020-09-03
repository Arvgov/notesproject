class Renderer {
    constructor(ctx, doc) {
        this.ctx = ctx
        this.doc = doc
    }

    render() {
        this.clear()
        this.drawStrokes()
        this.drawShapes()
	}

    drawStrokes() {
        this.ctx.lineJoin = "round"
        this.ctx.lineWidth = 1

        for (var i = 0; i < this.doc.strokes.length; i++) {
            let stroke = this.doc.strokes[i].points
            this.ctx.strokeStyle = this.doc.strokes[i].color
            this.ctx.moveTo(stroke[0][0], stroke[0][1]);
            this.ctx.beginPath()
            for (var j = 1; j < stroke.length; j++) {
                 this.ctx.lineTo(stroke[j][0], stroke[j][1]);
            }
            this.ctx.stroke();
	  }
    }

    drawShapes() {
        for (var i = 0; i < this.doc.shapes.length; i++) {
            let shape = this.doc.shapes[i].shape
            let bounds = this.doc.shapes[i].bounds
            this.ctx.beginPath();
            if (shape == "rect") {
                this.ctx.rect(bounds[0], bounds[1], bounds[2], bounds[3]);
            } else {
                let cx = bounds[0] + bounds[2]/2
                let cy = bounds[1] + bounds[3]/2
                let r = bounds[2] / 4 + bounds[3] / 4
                this.ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            }
            this.ctx.stroke();

        }
    }

    clear() {
        let canvas = this.ctx.canvas
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    resize() {
        if (window.innerWidth > this.ctx.canvas.width) {
            this.ctx.canvas.width = window.innerWidth;
        }
        if (window.innerHeight > this.ctx.canvas.height) {
            this.ctx.canvas.height = window.innerHeight;
        }
        this.render()
    }
}
