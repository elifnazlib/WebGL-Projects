"use strict";

let canvas;
let gl;

const NumVertices = 36;

const points = []
const colors = [];

const xAxis = 0;
const yAxis = 1;
const zAxis = 2;

let axis = xAxis;
let theta = [0, 0, 0];
let thetaLoc;
let toggle = false;

const vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

 const vertexColors = [
    [0.0, 0.0, 0.0, 1.0],  // black
    [1.0, 0.0, 0.0, 1.0],  // red
    [1.0, 1.0, 0.0, 1.0],  // yellow
    [0.0, 1.0, 0.0, 1.0],  // green
    [0.0, 0.0, 1.0, 1.0],  // blue
    [1.0, 0.0, 1.0, 1.0],  // magenta
    [0.0, 1.0, 1.0, 1.0],  // cyan
    [1.0, 1.0, 1.0, 1.0]   // white
];

function quad(a, b, c, d) {
    // We need to partition the quad into two
    // triangles in order for WebGL to be able to
    // render it.  In this case, we create two
    // triangles from the quad indices vertex color
    // assigned by the index of the vertex
    const indices = [a, b, c, a, c, d];

    for (let i = 0; i < indices.length; ++i) {
        points.push(vertices[indices[i]]);
        colors.push(vertexColors[indices[i]]);
    }
}

function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

window.onload = function init () {
    canvas = document.getElementById("glCanvas");

    // gl = WebGLUtils.setupWebGL(canvas);
    gl = canvas.getContext("webgl2");
    if (!gl) {
        alert("WebGL isn't available");
        return;
    }

    colorCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Load shaders
    const program = initShaders(gl, "shaders/vshader.glsl", "shaders/fshader.glsl");
    gl.useProgram(program);

    // Color buffer
    const cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    const vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // Vertex buffer
    const vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    const vPosition = gl.getAttribLocation(program,"vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program,"theta");

    // Event listeners for buttons
    document.getElementById("xButton").onclick = () => axis = xAxis;
    document.getElementById("yButton").onclick = () => axis = yAxis;
    document.getElementById("zButton").onclick = () => axis = zAxis;
    document.getElementById("tButton").onclick = function () { toggle = !toggle; };
    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (toggle) theta[axis] += 1.0;

    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    requestAnimationFrame(render);
}