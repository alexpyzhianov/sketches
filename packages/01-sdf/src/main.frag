#version 300 es

#define MAX_STEPS 100
#define SURFACE_DIST 0.001f
#define MAX_DIST 100.0f
#define VIEW_DIST 10.0f
#define LIGHT_POS vec3(0.0f, 10.0f, 0.0f)
#define PLANE_POS vec3(0.0f, -1.0f, 0.0f)
#define SPHERE_POS vec3(0.0f, 0.0f, 0.0f)
#define SPHERE_RADIUS 1.0f
#define EPSILON vec2(0.001f, 0.0f)

precision highp float;

out vec4 FragColor;
uniform float u_width;
uniform float u_height;
uniform float u_time;

float sphereSDF(vec3 ray, vec3 position, float radius) {
    return length(position - ray) - radius;
}

float planeSDF(vec3 ray, vec3 position) {
    return ray.y - position.y;
}

float surfaceSDF(vec3 ray) {
    return min(sphereSDF(ray, SPHERE_POS, SPHERE_RADIUS), planeSDF(ray, PLANE_POS));
}

float rayMarch(vec3 rayOrigin, vec3 rayDirection) {
    float currentDistance = 0.0f;
    for(int i = 0; i < MAX_STEPS; i++) {
        vec3 ray = rayOrigin + rayDirection * currentDistance;
        float newDistance = surfaceSDF(ray);
        currentDistance += newDistance;
        if(newDistance < SURFACE_DIST || currentDistance > MAX_DIST) {
            break;
        }
    }
    return currentDistance;
}

vec3 getNormal(vec3 ray) {
    float distance = surfaceSDF(ray);
    vec3 normal = distance - vec3(surfaceSDF(ray - EPSILON.xyy), surfaceSDF(ray - EPSILON.yxy), surfaceSDF(ray - EPSILON.yyx));
    return normalize(normal);
}

float getLight(vec3 ray, vec3 normal) {
    vec3 lightPos = LIGHT_POS;
    lightPos.xz += vec2(sin(u_time), cos(u_time)) * 5.0f;
    vec3 lightDirection = normalize(lightPos - ray);
    return dot(normal, lightDirection);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5f * vec2(u_width, u_height)) / u_height;

    vec3 rayOrigin = vec3(0.0f, 0.0f, 5.0f);
    vec3 rayDirection = normalize(vec3(uv, -1.0f));

    float hitDistance = rayMarch(rayOrigin, rayDirection);
    vec3 hitPosition = rayOrigin + rayDirection * hitDistance;

    vec3 normal = getNormal(hitPosition);
    float diffuseLight = getLight(hitPosition, normal);

    FragColor = vec4(vec3(diffuseLight), 1.0f);
}
