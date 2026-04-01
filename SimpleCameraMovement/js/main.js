"use strict";

let gl;
let program;
let projectionMatrix;

let eye = vec3(0, 0, 2);
let at  = vec3(0, 0, 0);
const up  = vec3(0, 1, 0);

let vao1, vao2;
let mvpLoc;


// ---------------- INIT ----------------
function main()
{
    const canvas = document.getElementById("glCanvas");
    gl = canvas.getContext("webgl2");

    if (!gl) {
        alert("WebGL2 is not supported!");
        return;
    }

    program = initShaders(gl, "shaders/vshader.glsl", "shaders/fshader.glsl");
    gl.useProgram(program);

    initBuffers();

    mvpLoc = gl.getUniformLocation(program, "MVP");

    resize();
    requestAnimationFrame(render);
};


// ---------------- RENDER ----------------
function render()
{
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    const view = lookAt(eye, at, up);
    const world = mat4();
    const mvp = mult(projectionMatrix, mult(view, world));

    gl.uniformMatrix4fv(mvpLoc, false, flatten(mvp));

    gl.bindVertexArray(vao1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindVertexArray(vao2);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(render);
};


// ---------------- BUFFERS ----------------
function initBuffers()
{
    const pos = gl.getAttribLocation(program, "vPosition");

    // Triangle 1
    vao1 = gl.createVertexArray();
    gl.bindVertexArray(vao1);

    const vertices1 = new Float32Array([
        -0.3, -0.3, 0,
        0.3, -0.3, 0,
        0.0,  0.3, 0
    ]);

    const buffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
    gl.bufferData(gl.ARRAY_BUFFER, vertices1, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);

    // Triangle 2
    vao2 = gl.createVertexArray();
    gl.bindVertexArray(vao2);

    const vertices2 = new Float32Array([
        -0.6, 0.6, 0,
        -0.3, 0.6, 0,
        -0.45, 0.9, 0
    ]);

    const buffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    gl.bufferData(gl.ARRAY_BUFFER, vertices2, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
};


// ---------------- RESIZE ----------------
function resize()
{
    // If the size of the window changed, call this to update the GL matrices

    const canvas = gl.canvas;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Calculate the projection matrix
    var aspect = canvas.width / canvas.height;
    var fovy = 45.0;
    var near = 0.01;
    var far = 10.0;

    gl.viewport(0, 0, canvas.width, canvas.height); // Set the viewport to be the entire window

    projectionMatrix = perspective(fovy, aspect, near, far);
};


// ---------------- CAMERA MOVEMENT ----------------
document.addEventListener("keydown", function(event)
{
    switch (event.key) {
        case "w":
        case "W":
            eye[1] += 0.1; // up
            at[1] += 0.1;
            break;

        case "s":
        case "S":
            eye[1] -= 0.1; // down
            at[1] -= 0.1;
            break;

        case "d":
        case "D":
            eye[0] += 0.1; // right
            at[0] += 0.1;
            break;

        case "a":
        case "A":
            eye[0] -= 0.1; // left
            at[0] -= 0.1;
            break;
    }
});


// ---------------- MOUSE SCROLL ZOOM ----------------
document.addEventListener("wheel", function(event)
{
    // eye[2] += event.deltaY * 0.001;

    const zoomSpeed = 0.1;
    let dir = normalize(subtract(at, eye)); // eye -> at dir
    let delta = -zoomSpeed * (event.deltaY > 0 ? 1 : -1);
    eye = add(eye, scale(delta, dir));
});


window.onresize = resize;
main();