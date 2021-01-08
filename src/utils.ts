export function getContainer() {
    const container = document.querySelector("body");

    if (!container) {
        throw new Error("No <body> in html");
    }

    return container;
}
