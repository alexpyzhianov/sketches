#version 300 es

in vec2 aData;

uniform float uTime;
uniform float uCount;
uniform float uRadius;
uniform float uPointSize;

void main() {
    float centerDistance = aData.x / uCount * uRadius;
    gl_PointSize = uPointSize * aData.y;
    gl_Position = vec4(sin(aData.x) * centerDistance, cos(aData.x) * centerDistance, 0.0f, 1.0f);
}
