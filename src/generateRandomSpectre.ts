import { Spectre, SpectreComponent } from "./Spectre";

export function generateRandomSpectre() {
    const components = Array.from({length: Math.round(Math.random() * 2 + 1)}, () => new SpectreComponent(
        (Math.random() - .5) * 2,
        0.5 + (1 - Math.random() * Math.random()) * 10,
        1 / (.25 + Math.random()),
    ));
    let max = -Infinity;
    for (let x = -1; x <= 1; x += .01) {
        const fx = components.reduce((acc, c) => acc + c.intensivity(x), 0);
        if (fx > max) {
            max = fx;
        }
    }
    return new Spectre(components, 1 / max);
}
