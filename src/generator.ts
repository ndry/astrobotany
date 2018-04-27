import { Spectre, SpectreComponent } from "./Spectre";
import { Chemical } from "./Chemical";
import { Planet } from "./Planet";
import { MappedSprite } from "./MappedSprite";
import { getRandomElement, shuffle } from "./utils/misc";

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
    const components = Array.from({length: Math.round(Math.random() * 2 + 1)}, () => new SpectreComponent(
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

    const shuffledFlowerImages = shuffle(Array.from(document.getElementsByClassName("flower-image")));
    const flowers: MappedSprite[] = [];
    for (let i = 0; i < Math.floor(shuffledFlowerImages.length / 2); i++) {
        const rgbIndices = {
            r: Math.floor(Math.random() * chemicals.length),
            g: Math.floor(Math.random() * chemicals.length),
            b: Math.floor(Math.random() * chemicals.length),
        }
        flowers.push(new MappedSprite(
            shuffledFlowerImages[i] as HTMLImageElement,
            {
                r: chemicals[rgbIndices.r],
                g: chemicals[rgbIndices.g],
                b: chemicals[rgbIndices.b],
            }
        ));
        flowers.push(new MappedSprite(
            shuffledFlowerImages[shuffledFlowerImages.length - 1 - i] as HTMLImageElement,
            {
                r: chemicals[chemicals.length - 1 - rgbIndices.r],
                g: chemicals[chemicals.length - 1 - rgbIndices.g],
                b: chemicals[chemicals.length - 1 - rgbIndices.b],
            }
        ));
    }

    return new Planet(
        chemicals,
        Array.from({length: 10}, () => generateRandomConeCellSpectre()), 
        flowers,
        new MappedSprite(
            document.getElementsByClassName("grass-image")[0]! as HTMLImageElement,
            ((array) => ({
                r: array[0],
                g: array[1],
                b: array[2],
            }))(shuffle(chemicals.slice(1, 4)))),
    );
}