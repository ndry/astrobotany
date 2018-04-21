import { adjust, getRandomElement, setPixel } from "./utils/misc";
import { Chemical } from "./Chemical";
import { Spectre, SpectreComponent } from "./Spectre";

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

function coneCell1(x: number): number {
    return Math.pow(Math.E, -Math.pow(x * 3, 2));
}

const ch1 = new Chemical(new Spectre([
    new SpectreComponent(0.3, 5, 0.5),
    new SpectreComponent(-0.5, 10, 0.25),
    new SpectreComponent(-1, 1, 0.25),
], 1), 0);

const chemicals: Chemical[] = [];

for (let i = 1; i <= 5; i++) {
    const components = Array.from({length: Math.round(Math.random() * 5 + 1)}, () => new SpectreComponent(
        (Math.random() - .5) * 2,
        0.5 + Math.random() * 10,
        1 / (.25 + Math.random()),
    ));
    let max = -Infinity;
    for (let x = -1; x <= 1; x += .01) {
        const fx = components.reduce((acc, c) => acc + c.value(x), 0);
        if (fx > max) {
            max = fx;
        }
    }
    const chemical = new Chemical(new Spectre(components, 1 / max), Math.round((Math.random() - .5) * 5));
    chemicals.push(chemical);

    const ci1 = document.getElementById(`chemical-info-${i}`) as HTMLDivElement;
    const ci1c = ci1.getElementsByClassName("chemical-spectre")[0] as HTMLCanvasElement;
    ci1c.width = ci1c.clientWidth;
    ci1c.height = ci1c.clientHeight;
    const ci1cctx = ci1c.getContext("2d")!;
    chemical.spectre.drawOnCtx(ci1cctx);
    const ci1p = ci1.getElementsByClassName("chemical-value")[0] as HTMLDivElement;
    ci1p.innerText = chemical.price.toString();
}

const coneCells: Spectre[] = [];

for (let i = 1; i <= 5; i++) {
    const components = Array.from({length: Math.round(Math.random() * 5 + 1)}, () => new SpectreComponent(
        (Math.random() - .5) * 2,
        0.5 + Math.random() * 10,
        1 / (.25 + Math.random()),
    ));
    let max = -Infinity;
    for (let x = -1; x <= 1; x += .01) {
        const fx = components.reduce((acc, c) => acc + c.value(x), 0);
        if (fx > max) {
            max = fx;
        }
    }
    const coneCell = new Spectre(components, 1 / max);
    coneCells.push(coneCell);

    const ci1 = document.getElementById(`coneCell-info-${i}`) as HTMLDivElement;
    const ci1c = (ci1.getElementsByClassName("chemical-spectre")[0] as HTMLCanvasElement)!;
    ci1c.width = ci1c.clientWidth;
    ci1c.height = ci1c.clientHeight;
    const ci1cctx = ci1c.getContext("2d")!;
    coneCell.drawOnCtx(ci1cctx);

    ci1c.addEventListener("click", ev => {
        function coneCell1_vs_chemical(i: number, x: number): number {
            return coneCell.value(x) * chemicals[i].spectre.value(x);
        }

        let coneCell1_vs_chemical1_acc = 0;
        for (let s = 0; s < 255; s++) {
            coneCell1_vs_chemical1_acc += coneCell1_vs_chemical(0, (s - 128) / 128);
        }
        let coneCell1_vs_chemical2_acc = 0;
        for (let s = 0; s < 255; s++) {
            coneCell1_vs_chemical2_acc += coneCell1_vs_chemical(1, (s - 128) / 128);
        }
        let coneCell1_vs_chemical3_acc = 0;
        for (let s = 0; s < 255; s++) {
            coneCell1_vs_chemical3_acc += coneCell1_vs_chemical(2, (s - 128) / 128);
        }

        ctxRight.drawImage(sourceImage, 0, 0);
        const imageData = ctxRight.getImageData(0, 0, width, height);

        for (let j = 0; j < imageData.width; j++) {
            for (let i = 0; i < imageData.height; i++) {
                const index = (i * imageData.width + j) * 4;
                const r = imageData.data[index + 0];
                const g = imageData.data[index + 1];
                const b = imageData.data[index + 2];
                const a = imageData.data[index + 3];

                const k = (r + g + b) / 3;

                imageData.data[index + 0] = Math.round(coneCell1_vs_chemical1_acc * r / 255);
                imageData.data[index + 1] = Math.round(coneCell1_vs_chemical1_acc * r / 255);
                imageData.data[index + 2] = Math.round(coneCell1_vs_chemical1_acc * r / 255);
                imageData.data[index + 3] = 255;
            }
        }

        ctxRight.putImageData(imageData, 0, 0, 0, 0, width, height);

    });
}

// const coneCellSImageData = ctxConeCells.getImageData(0, 0, canvasConeCells.width, canvasConeCells.height);
// for (let j = 0; j < 255; j++) {
//     const i = 255 - Math.round(255 * coneCell1((j - 128) / 128));

//     const index = (i * coneCellSImageData.width + j) * 4;
//     const r = coneCellSImageData.data[index + 0];
//     const g = coneCellSImageData.data[index + 1];
//     const b = coneCellSImageData.data[index + 2];
//     const a = coneCellSImageData.data[index + 3];

//     coneCellSImageData.data[index + 0] = 255;
//     // coneCellSImageData.data[index + 1] = 0;
//     // coneCellSImageData.data[index + 2] = 0;
//     coneCellSImageData.data[index + 3] = 255;
// }
// for (let j = 0; j < 255; j++) {
//     const i = 255 - Math.round(255 * coneCell1_vs_chemical1((j - 128) / 128));

//     const index = (i * coneCellSImageData.width + j) * 4;
//     const r = coneCellSImageData.data[index + 0];
//     const g = coneCellSImageData.data[index + 1];
//     const b = coneCellSImageData.data[index + 2];
//     const a = coneCellSImageData.data[index + 3];

//     // coneCellSImageData.data[index + 0] = 255;
//     // coneCellSImageData.data[index + 1] = 255;
//     coneCellSImageData.data[index + 2] = 255;
//     coneCellSImageData.data[index + 3] = 255;
// }
// ctxConeCells.putImageData(coneCellSImageData, 0, 0, 0, 0, canvasConeCells.width, canvasConeCells.height);

const sourceImage = document.getElementById("source-image") as HTMLImageElement;

// ctxLeft.drawImage(sourceImage, 0, 0);

// const imageData = ctxLeft.getImageData(0, 0, width, height);

// for (let j = 0; j < imageData.width; j++) {
//     for (let i = 0; i < imageData.height; i++) {
//         const index = (i * imageData.width + j) * 4;
//         const r = imageData.data[index + 0];
//         const g = imageData.data[index + 1];
//         const b = imageData.data[index + 2];
//         const a = imageData.data[index + 3];

//         const k = (r + g + b) / 3;

//         imageData.data[index + 0] = k;
//         imageData.data[index + 1] = k;
//         imageData.data[index + 2] = k;
//         imageData.data[index + 3] = 255;
//     }
// }

// ctxLeft.putImageData(imageData, 0, 0, 0, 0, width, height);

// const imageData1 = ctxLeft.getImageData(0, 0, width, height);

// for (let j = 0; j < imageData.width; j++) {
//     for (let i = 0; i < imageData.height; i++) {
//         const index = (i * imageData.width + j) * 4;
//         const r = imageData1.data[index + 0];
//         const g = imageData1.data[index + 1];
//         const b = imageData1.data[index + 2];
//         const a = imageData1.data[index + 3];

//         const k = Math.round(coneCell1_vs_chemical1_acc * r / 255);

//         imageData1.data[index + 0] = k;
//         imageData1.data[index + 1] = k;
//         imageData1.data[index + 2] = k;
//         imageData1.data[index + 3] = 255;
//     }
// }

// ctxRight.putImageData(imageData1, 0, 0, 0, 0, width, height);

ch1.spectre.drawOnCtx(ctxConeCells);
