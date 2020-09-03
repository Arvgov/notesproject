const myOnnxSession = new onnx.InferenceSession();

// load the ONNX model file
myOnnxSession.loadModel("./classifier.onnx").then(() => {
    console.log("ran")
});

class Recognizer {
    constructor() {}

    process(in_points, callback) {
        in_points = JSON.parse(JSON.stringify(in_points));
        var points = in_points.slice(3, -3)
        var newPoints = [];
        var j = 0;

        for (var i in points) {
            if (i == Math.floor(j * points.length / (points.length - 128)) &&
                points.length > 128) {
                j++;
            } else {
                newPoints.push(points[i]);
            }
        }

        while (newPoints.length < 128) {
            newPoints.unshift([newPoints[0][0], newPoints[0][1]]);
            newPoints.push([newPoints[newPoints.length - 1][0], newPoints[newPoints.length - 1][1]]);
        }
        if (newPoints.length != 128) {
            newPoints.pop()
        }
        if (newPoints.length != 128) {
            throw "Points length wrong!"
        }
        let bounds = this.whiten(newPoints)
        var transposed = newPoints[0].map((_, c) => newPoints.map(r => r[c]));
        var tensor = new Tensor(transposed.flat(), "float32", [1, 2, 128, 1])
        myOnnxSession.run([tensor]).then((output) => {
            // consume the output
            const outputTensor = output.values().next().value;
            var out = outputTensor.data
            console.log(`model output tensor: ${outputTensor.data}.`);
            if (out[1] > out[0]) {
                callback("circle", bounds)
            } else {
                callback("rectangle", bounds)
            }
        });
        console.log(tensor)
        // return newPoints
    }


    whiten(points) {
        var minX = points[0][0]
        var maxX = points[0][0]
        var minY = points[0][1]
        var maxY = points[0][1]
        for (var i in points) {
            let x = points[i][0];
            let y = points[i][1];

            if (x > maxX) {
                maxX = x
            }
            if (y > maxY) {
                maxY = y
            }
            if (x < minX) {
                minX = x
            }
            if (y < minY) {
                minY = y
            }
        }
        console.log(minX, minY, maxX, maxY)
        for (var i in points) {
            points[i][0] -= (minX + maxX) / 2.0
            points[i][1] -= (minY + maxY) / 2.0
            points[i][0] /= (maxX - minX)
            points[i][1] /= (maxY - minY)
        }
        console.log(points)
        return [minX, minY, (maxX - minX), (maxY - minY)]
    }
}
