#version 300 es

#define MAX_STEPS 100
#define SURFACE_DIST 0.001f
#define MAX_DIST 100.0f

precision highp float;

out vec4 FragColor;
uniform float u_width;
uniform float u_height;

float sphereSDF(vec3 rayTip, vec3 position, float radius) {
    return length(position - rayTip) - radius;
}

float rayMarch(vec3 rayOrigin, vec3 rayDirection) {
    float currentDistance = 0.0f;
    for(int i = 0; i < MAX_STEPS; i++) {
        vec3 rayTip = rayOrigin + rayDirection * currentDistance;
        float newDistance = sphereSDF(rayTip, vec3(0.0f, 0.0f, 0.0f), 3.0f);
        currentDistance += newDistance;
        if(newDistance < SURFACE_DIST || currentDistance > MAX_DIST) {
            break;
        }
    }
    return currentDistance;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5f * vec2(u_width, u_height)) / u_height;

    // Camera
    vec3 rayOrigin = vec3(0.0f, 0.0f, 10.0f);
    vec3 rayDirection = normalize(vec3(uv, -1.0f));

    float dist = rayMarch(rayOrigin, rayDirection);
    dist /= 10.0f;

    FragColor = vec4(vec3(dist), 1.0f); // Orange color for the sphere
}
