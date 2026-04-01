#version 300 es

in vec4 vPosition;
uniform mat4 MVP; //ModelViewProj

void main()
{
    gl_Position = MVP * vPosition;
}
