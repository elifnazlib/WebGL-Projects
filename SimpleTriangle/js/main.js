"use strict";

// Get the canvas element and create a WebGL2 rendering context
const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl2");

// Check if WebGL2 is supported
if (!gl) {
    alert("WebGL is not supported!");
}


// Define triangle vertices (x, y)
const vertices = new Float32Array([
    0.0,  0.5,
    -0.5, -0.5,
    0.5, -0.5
]);


// Create and compile shaders, then link them into a program
const program = initShaders(gl, "shaders/vshader.glsl", "shaders/fshader.glsl");

// Use the shader program before setting up attributes
gl.useProgram(program);

// Create vertex array object (vao)
// It remembers how your vertex data is set up so you can reuse it easily when drawing
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

// Create a GPU buffer and bind it
const positionPuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionPuffer);

// Upload vertex data to GPU (STATIC_DRAW: data won't change)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Get the attribute location in the shader
const positionLoc = gl.getAttribLocation(program, "a_position");

// Enable the attribute
gl.enableVertexAttribArray(positionLoc);

// Tell WebGL how to read the buffer for this attribute
// 2 components per vertex (x, y), type = float, not normalized, stride = 0, offset = 0
gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

// Unbind the VAO (its settings are now saved)
gl.bindVertexArray(null);


// --- Drawing part ---

// Clear the canvas with black color
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

// Bind vao for triangle
gl.bindVertexArray(vao);

// Draw the triangle
// gl.TRIANGLES: groups of 3 vertices form triangles
// 0: start index, 3: number of vertices
gl.drawArrays(gl.TRIANGLES, 0, 3);