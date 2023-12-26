#version 300 es

in vec2 aData;
out float intensity;

uniform float uCount;
uniform float uRadius;
uniform float uPointSize;
uniform float uRotation;

void main() {
    float centerDistance = aData.x / uCount * uRadius;
    intensity = aData.y;
    gl_PointSize = step(0.5f, intensity) * uPointSize;
    gl_Position = vec4(sin(aData.x + uRotation) * centerDistance, cos(aData.x + uRotation) * centerDistance, 0.0f, 1.0f);
}
