import { adjust, getRandomElement, setPixel } from "./utils/misc";
import { Chemical } from "./Chemical";
import { Spectre, SpectreComponent } from "./Spectre";
import { generateRandomSpectre } from "./generateRandomSpectre";
import { Planet } from "./Planet";
import { MappedSprite } from "./MappedSprite";

const canvasLeft = document.getElementById("canvas-left") as HTMLCanvasElement;
const ctxLeft = canvasLeft.getContext("2d")!;

canvasLeft.width = canvasLeft.clientWidth;
canvasLeft.height = canvasLeft.clientHeight;

ctxLeft.imageSmoothingEnabled = false;

const width = canvasLeft.width;
const height = canvasLeft.height;

const canvasRight = document.getElementById("canvas-right") as HTMLCanvasElement;
const ctxRight = canvasRight.getContext("2d")!;

canvasRight.width = canvasRight.clientWidth;
canvasRight.height = canvasRight.clientHeight;

ctxRight.imageSmoothingEnabled = false;

const canvasConeCells = document.getElementById("canvas-coneCells") as HTMLCanvasElement;
const ctxConeCells = canvasConeCells.getContext("2d")!;

canvasConeCells.width = canvasConeCells.clientWidth;
canvasConeCells.height = canvasConeCells.clientHeight;

ctxConeCells.imageSmoothingEnabled = false;

const planet = (() => {
    const chemicals = Array.from(
        {length: 5},
        () => new Chemical(generateRandomSpectre(), Math.round((Math.random() - .5) * Math.random() * Math.random() * 30)));

    return new Planet(
        chemicals,
        Array.from(
            {length: 5},
            () => generateRandomSpectre()),
        Array.from(document.getElementsByClassName("flower-image"))
            .map(e => new MappedSprite(
                e as HTMLImageElement,
                {
                    r: getRandomElement(chemicals),
                    g: getRandomElement(chemicals),
                    b: getRandomElement(chemicals),
                })),
        );
})();

for (let i = 1; i <= 5; i++) {
    const chemical = planet.chemicals[i - 1];

    const ci1 = document.getElementById(`chemical-info-${i}`) as HTMLDivElement;
    const ci1c = ci1.getElementsByClassName("chemical-spectre")[0] as HTMLCanvasElement;
    ci1c.width = ci1c.clientWidth;
    ci1c.height = ci1c.clientHeight;
    const ci1cctx = ci1c.getContext("2d")!;
    chemical.drawOnCtx(ci1cctx, {
        r: undefined,
        g: undefined,
        b: undefined,
        map: planet.coneCellChemicalMap
    });
    const ci1p = ci1.getElementsByClassName("chemical-value")[0] as HTMLDivElement;
    ci1p.innerText = chemical.price.toString();
}

for (let i = 1; i <= 5; i++) {
    const coneCell = planet.coneCells[i - 1];

    const ci1 = document.getElementById(`coneCell-info-${i}`) as HTMLDivElement;
    const ci1c = (ci1.getElementsByClassName("chemical-spectre")[0] as HTMLCanvasElement)!;
    ci1c.width = ci1c.clientWidth;
    ci1c.height = ci1c.clientHeight;
    const ci1cctx = ci1c.getContext("2d")!;
    coneCell.drawOnCtx(ci1cctx);

    ci1c.addEventListener("click", ev => {
        planet.mapConeCell(coneCell);

        const flowerChromes =  document.getElementsByClassName("flower-chrome");

        for (let i = 0; i < planet.flowers.length; i++) {
            const s = planet.flowers[i];

            const c = flowerChromes[i] as HTMLCanvasElement;
            c.width = c.clientWidth;
            c.height = c.clientHeight;
            const cctx = c.getContext("2d")!;

            s.drawOnCtx(cctx, {
                r: coneCell,
                g: undefined,
                b: undefined,
                map: planet.coneCellChemicalMap
            });
        }

        for (let i = 1; i <= 5; i++) {
            const chemical = planet.chemicals[i - 1];
        
            const ci1 = document.getElementById(`chemical-info-${i}`) as HTMLDivElement;
            const ci1c = ci1.getElementsByClassName("chemical-spectre")[0] as HTMLCanvasElement;
            ci1c.width = ci1c.clientWidth;
            ci1c.height = ci1c.clientHeight;
            const ci1cctx = ci1c.getContext("2d")!;
            chemical.drawOnCtx(ci1cctx, {
                r: coneCell,
                g: undefined,
                b: undefined,
                map: planet.coneCellChemicalMap
            });
            const ci1p = ci1.getElementsByClassName("chemical-value")[0] as HTMLDivElement;
            ci1p.innerText = chemical.price.toString();
        }

        for (let i = 1; i <= 5; i++) {
            const coneCell1 = planet.coneCells[i - 1];
        
            const ci1 = document.getElementById(`coneCell-info-${i}`) as HTMLDivElement;
            const ci1c = (ci1.getElementsByClassName("chemical-spectre")[0] as HTMLCanvasElement)!;
            ci1c.width = ci1c.clientWidth;
            ci1c.height = ci1c.clientHeight;
            const ci1cctx = ci1c.getContext("2d")!;
            coneCell1.drawOnCtx(ci1cctx, coneCell1 === coneCell ? `rgba(255, 0, 0, 1)` : `rgba(0, 0, 0, 1)`);
        }
    });
}
