import { Spectre, SpectreComponent } from "./Spectre";
import { Chemical } from "./Chemical";
import { Planet } from "./Planet";
import { MappedSprite } from "./MappedSprite";
import { getRandomElement } from "./utils/misc";

export function generateRandomConeCellSpectre() {
    const components = Array.from({length: Math.round(Math.random() * 2 + 1)}, () => new SpectreComponent(
        (Math.random() - .5) * 2,
        0.5 + (1 - Math.random() * Math.random()) * 7,
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

export function generateRandomChemicalSpectre() {
    const components = Array.from({length: Math.round(Math.random() * 3 + 1)}, () => new SpectreComponent(
        (Math.random() - .5) * 2,
        0.5 + (1 - Math.random() * Math.random()) * 4,
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

export function generateRandomPlanet() {
    const chemicals = Array.from(
        {length: 5},
        (v, k) => new Chemical(generateRandomChemicalSpectre(), Math.sign(k - 2) * Math.pow(k - 2, 2)));

    return new Planet(
        chemicals,
        Array.from(
            {length: 10},
            () => generateRandomConeCellSpectre()),
        Array.from(document.getElementsByClassName("flower-image"))
        .map(e => new MappedSprite(
            e as HTMLImageElement,
            {
                r: getRandomElement(chemicals),
                g: getRandomElement(chemicals),
                b: getRandomElement(chemicals),
            })),
        new MappedSprite(
            document.getElementsByClassName("grass-image")[0]! as HTMLImageElement,
            {
                r: getRandomElement(chemicals),
                g: getRandomElement(chemicals),
                b: getRandomElement(chemicals),
            }),
    );
}