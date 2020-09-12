const remote = require('electron').remote;
const win = remote.getGlobal('mainWin');
let gscale = 1;

function startStroke(x, y, doc, renderer) {
    doc.startStroke(x, y)
    //renderer.render()
}

function continueStroke(x, y, doc, renderer) {
    doc.continueStroke(x, y)
    //renderer.render()
}

function detectShape(doc, renderer, recognizer) {
    let color = '#' + Math.random().toString(16).substr(2, 6)
    doc.changeLastStrokeColor(color)
    var lastStroke = doc.getLastStroke()
    recognizer.process(lastStroke.points, function(shape, bounds) {
        console.log(shape)
        console.log(bounds)
        if (shape == "circle") {
            doc.changeLastStrokeColor("red")
        } else {
            doc.changeLastStrokeColor("blue")
        }
        //renderer.render()
    })
}
function replaceWithDetected(shape, bounds) {
    doc.removeLastStroke()
    if (shape == "circle") {
        doc.circle(bounds[0], bounds[1], bounds[2], bounds[3])
    } else if (shape == "rectangle") {
        doc.rect(bounds[0], bounds[1], bounds[2], bounds[3])
    }
}

$(document).ready(function() {
    const doc = new Document()

    let canvas = document.getElementById('canvas')

    let context = canvas.getContext("2d");
    const renderer = new Renderer(context, doc)
    context.canvas.width  = Math.floor(window.innerWidth * 1.3)
    context.canvas.height = Math.floor(window.innerHeight * 1.3)
    let eventManager = new EventManager()

    var offx = 0;
    var offy = 0;
    var dx = 0;
    var dy = 0;
    addCoreEvents(eventManager)

    eventManager.on("mouseDown", function(x, y) {
        dx = x
        dy = y
        startStroke(x, y, doc, renderer)
    })

    eventManager.on("mouseDownMove", function(x, y) {
        console.log(x, y)
        context.lineJoin = "round"
        context.lineWidth = 1
        context.strokeStyle = "black"

        context.moveTo(0, 0)
        context.beginPath()
        context.lineTo(100, 100)
        context.stroke()

        context.beginPath();
        context.moveTo(dx, dy);
        context.lineTo(x, y);
        context.stroke();
        dx = x
        dy = y
    })

    eventManager.on("mouseUp", function(x, y) {
    })



    let glide = false;
    let vx = 0;
    let vy = 0;
    eventManager.on("pan", function(dx, dy) {
        glide = false
        vx = dx
        vy = dy
    })

    eventManager.on("stoppan", function(dx, dy) {
        glide = true
        vx = dx
        vy = dy
    })

    eventManager.on("tick10ms", function() {
        offx = offx + 3 * vx
        offy = offy + 3 * vy
        $(canvas).css("top", Math.floor(offy))
        $(canvas).css("left", Math.floor(offx))
        if (glide) {
            vx *= 0.97
            vy *= 0.97
        }
    })

    var width;
    eventManager.on("startPinch", function(cx, cy, scale) {
        width = parseInt($(canvas).css("width").slice(0, -2))
        $(canvas).css("width", Math.floor(scale * width))
    })

    eventManager.on("endPinch", function(cx, cy, scale) {
        $(canvas).css("width", Math.floor(scale * width))
        offx = offx + cx - (offx + (cx - offx) * scale)
        offy = offy + cy - (offy + (cy - offy) * scale)
        $(canvas).css("top", Math.floor(offy))
        $(canvas).css("left", Math.floor(offx))
        gscale *= scale
    })

    eventManager.on("pinch", function(cx, cy, scale) {
        $(canvas).css("width", Math.floor(scale * width))
        newOffx = offx + cx - (offx + (cx - offx) * scale)
        newOffy = offy + cy - (offy + (cy - offy) * scale)
        $(canvas).css("top", Math.floor(newOffy))
        $(canvas).css("left", Math.floor(newOffx))
    })

    function addCoreEvents(eventManager) {
        const hammer = new Hammer(canvas, {
          domEvents: true
        });
        hammer.get('pinch').set({ enable: true });
        hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

        var x, y;

        /*setInterval(function() {
            eventManager.trigger("tick100ms")
        }, 100)

        setInterval(function() {
            eventManager.trigger("tick10ms")
        }, 10) */

        $('#canvas').mousedown(function(e){
            x = e.pageX - this.offsetLeft;
            y = e.pageY - this.offsetTop;
            eventManager.trigger("mouseDown", x, y);
        });

        $('#canvas').mousemove(function(e){
            let oldx = x
            let oldy = y
            x = (e.pageX - this.offsetLeft) / gscale;
            y = (e.pageY - this.offsetTop) / gscale;
            eventManager.trigger("mouseMove", x, y, x - oldx, y - oldy)
        });

        $('#canvas').mouseup(function(e){
            eventManager.trigger("mouseUp");
        });

        $('#canvas').mouseleave(function(e){
            eventManager.trigger("mouseLeave");
        });

        $("#save-button").click(function(e){
            doc.save()
        });

        $("#load-button").click(function(e){
            doc.load(() => { renderer.render() })
        });

        $("#new-button").click(function(e){
            doc.clear()
            renderer.render()
        });

        var fullscreen = false
        $("#fullscreen-button").click(function(e) {
            fullscreen = !fullscreen
            win.setFullScreen(fullscreen)
        });

        hammer.on('pinch', function (e) {
            let x = e.center.x
            let y = e.center.y;
            let scale = e.scale
            eventManager.trigger("pinch", x, y, scale)
        });

        hammer.on('pinchstart', function (e) {
            let x = e.center.x
            let y = e.center.y;
            let scale = e.scale
            eventManager.trigger("startPinch", x, y, scale)
        });

        hammer.on('pinchend', function (e) {
            let x = e.center.x
            let y = e.center.y;
            let scale = e.scale
            eventManager.trigger("endPinch", x, y, scale)
        });

        hammer.on("panleft panright panup pandown tap press", function(e) {
            if (e.pointerType == "touch") {
                if (e.isFinal) {
                    console.log(e)
                    eventManager.trigger("stoppan", e.velocityX, e.velocityY)
                } else {
                    eventManager.trigger("pan", e.velocityX, e.velocityY)
                }
            }
        })

        $(window).resize(function() {
            //renderer.resize()
        });
    }
});
