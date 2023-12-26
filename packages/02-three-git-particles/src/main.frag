#version 300 es

precision highp float;

in float intensity;
out vec4 FragColor;

uniform float uTime;

void main() {
    FragColor = vec4(intensity * sin(uTime));
}
