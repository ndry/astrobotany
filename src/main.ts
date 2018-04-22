import { adjust, getRandomElement, setPixel } from "./utils/misc";
import { Chemical } from "./Chemical";
import { Spectre, SpectreComponent } from "./Spectre";
import { Planet } from "./Planet";
import { MappedSprite } from "./MappedSprite";
import { Game } from "./Game";
import { generateRandomPlanet } from "./generator";
import * as debug from "./debug";

if (!debug.showFlowersOnPage) {
    const flowersContainer = document.getElementById("flowers")!;
    flowersContainer.style.display = "none";
}

const gameScreen = document.getElementById("gameScreen")!;
gameScreen.style.display = "none";

function renderSpectres(planet: Planet) {
    planet.ensureVisionMap();

    const flowerChromes = document.getElementsByClassName("flower-chrome");

    for (let i = 0; i < planet.flowers.length; i++) {
        const s = planet.flowers[i];

        const c = flowerChromes[i] as HTMLCanvasElement;
        c.width = c.clientWidth;
        c.height = c.clientHeight;
        const cctx = c.getContext("2d")!;

        s.drawOnCtx(cctx, planet.vision);
    }

    for (let i = 1; i <= 5; i++) {
        const chemical = planet.chemicals[i - 1];
    
        const ci1 = document.getElementById(`chemical-info-${i}`) as HTMLDivElement;
        const ci1c = ci1.getElementsByClassName("chemical-spectre")[0] as HTMLCanvasElement;
        ci1c.width = ci1c.clientWidth;
        ci1c.height = ci1c.clientHeight;
        const ci1cctx = ci1c.getContext("2d")!;
        chemical.drawOnCtx(ci1cctx, planet.vision);
        const ci1p = ci1.getElementsByClassName("chemical-value")[0] as HTMLDivElement;
        ci1p.innerText = chemical.price.toString();
    }

    for (let i = 1; i <= 10; i++) {
        const coneCell1 = planet.coneCells[i - 1];
    
        const ci1 = document.getElementById(`coneCell-info-${i}`) as HTMLDivElement;
        const ci1c = (ci1.getElementsByClassName("chemical-spectre")[0] as HTMLCanvasElement)!;
        ci1c.width = ci1c.clientWidth;
        ci1c.height = ci1c.clientHeight;
        const ci1cctx = ci1c.getContext("2d")!;
        coneCell1.drawOnCtx(ci1cctx, `rgba(${coneCell1 === planet.vision.r ? 255 : 0},`
            + `${coneCell1 === planet.vision.g ? 255 : 0},`
            + `${coneCell1 === planet.vision.b ? 255 : 0}, 1)`);
    }
}

for (const e of Array.from(document.getElementsByClassName("color-choice-radio"))) {
    e.addEventListener("click", ev => {
        const el = ev.srcElement as HTMLInputElement;
        const coneCell = el.value === "0"
            ? undefined
            : planet.coneCells[(+el.value) - 1];
        switch (el.name) {
            case "red-choice": {
                planet.vision.r = coneCell;
                break;
            }
            case "green-choice": {
                planet.vision.g = coneCell;
                break;
            }
            case "blue-choice": {
                planet.vision.b = coneCell;
                break;
            }
        }
        renderSpectres(planet);
    })
}


let planet = generateRandomPlanet();
renderSpectres(planet);

const rerollBtn = document.getElementById("reroll") as HTMLButtonElement;
rerollBtn.addEventListener("click", ev => {
    planet = generateRandomPlanet();
    renderSpectres(planet);

    for (const e of Array.from(document.getElementsByClassName("color-choice-radio-reset"))) {
        const r = e as HTMLInputElement;
        r.checked = true;
    }
});



const startBtn = document.getElementById("startGame") as HTMLButtonElement;
startBtn.addEventListener("click", ev => {
    const canvasTerrain = document.getElementById("terrain") as HTMLCanvasElement;
    const ctxTerrain = canvasTerrain.getContext("2d")!;
    
    canvasTerrain.width = canvasTerrain.clientWidth;
    canvasTerrain.height = canvasTerrain.clientHeight;
    
    ctxTerrain.imageSmoothingEnabled = false;

    ctxTerrain.fillStyle = "#F0A0D0";
    ctxTerrain.fillRect(0, 0, canvasTerrain.width, canvasTerrain.height);

    const game = new Game(planet);
});


