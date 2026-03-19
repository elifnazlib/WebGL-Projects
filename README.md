# WebGL Projects
A collection of WebGL2 projects.

<br>

## Projects
### 1. Simple Triangle Program

<img width="300" height="300" alt="Ekran görüntüsü 2026-03-19 154116" src="https://github.com/user-attachments/assets/5c16d743-3f6f-4ab7-ade8-aa2aab217a7d"/>

<br>
<br>

## Notes

### Vertex Array Object (VAO)

VAO describes how the vertex attributes are stored in a VBO. It remembers how your vertex data is set up so you can reuse it easily when drawing.

<br>

#### Without VAO

If we want to draw one triangle and one square on the screen:

```javascript
const triBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  0, 0.5,
  -0.5, 0,
  0.5, 0
]), gl.STATIC_DRAW);

const quadBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -0.5, -0.5,
   0.5, -0.5,
  -0.5, -1.0,
   0.5, -1.0
]), gl.STATIC_DRAW);

// drawing triangle
gl.bindBuffer(gl.ARRAY_BUFFER, triBuffer);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);
gl.drawArrays(gl.TRIANGLES, 0, 3);

// drawing square
gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
```

> [!WARNING]
> You must repeat vertexAttribPointer and enableVertexAttribArray for every object.
> 
> As the number of objects grows, the code becomes messy and error-prone.

<br>

#### With VAO

A VAO records all vertex attribute state for an object once:

```javascript
// triangle vao
const triVAO = gl.createVertexArray();
gl.bindVertexArray(triVAO);

const triBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  0, 0.5,
  -0.5, 0,
  0.5, 0
]), gl.STATIC_DRAW);

gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);

// square vao
const quadVAO = gl.createVertexArray();
gl.bindVertexArray(quadVAO);

const quadBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -0.5, -0.5,
   0.5, -0.5,
  -0.5, -1.0,
   0.5, -1.0
]), gl.STATIC_DRAW);

gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);

gl.bindVertexArray(null);

// drawing triangle
gl.bindVertexArray(triVAO);
gl.drawArrays(gl.TRIANGLES, 0, 3);

// drawing square
gl.bindVertexArray(quadVAO);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
```

> [!TIP]
> - With VAOs, you don’t need to write `vertexAttribPointer` and `enableVertexAttribArray` for every object again.
> - `gl.bindVertexArray(vao)` prepares the VAO for drawing.
