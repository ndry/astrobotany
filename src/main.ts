import { adjust, getRandomElement, setPixel } from "./utils/misc";
import { Chemical } from "./Chemical";
import { Spectre, SpectreComponent } from "./Spectre";
import { Planet } from "./Planet";
import { MappedSprite } from "./MappedSprite";
import { Game } from "./Game";
import { generateRandomPlanet } from "./generator";
import * as debug from "./debug";

const startScreen =  document.getElementById("startScreen")!;
const flowersContainer = document.getElementById("flowers")!;
const gameScreen = document.getElementById("gameScreen")!;
const startBtn = document.getElementById("startGame") as HTMLButtonElement;

const splashScreen =  document.getElementById("splashScreen")!;

let splashCounter = 0;
const splashIntervalHandler = setInterval(() => {
    splashCounter++;
    splashScreen.style.opacity = (1 - splashCounter / 20).toString();
    startScreen.style.opacity = (splashCounter / 20).toString();
    if (splashCounter > 18) {
        clearInterval(splashIntervalHandler);
        splashScreen.remove();
    }
}, 50);


if (debug.showFlowersOnPage) {
    flowersContainer.style.display = "block";
}

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

    const grassChrome = document.getElementsByClassName("grass-chrome")[0] as HTMLCanvasElement; 
    grassChrome.width = grassChrome.clientWidth;
    grassChrome.height = grassChrome.clientHeight;
    const grassChromeCtx = grassChrome.getContext("2d")!;

    planet.grass.drawOnCtx(grassChromeCtx, planet.vision);

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

        ensureVisonSelected();
    })
}

function ensureVisonSelected() {
    if (planet.vision.r || planet.vision.g || planet.vision.b) {
        startBtn.disabled = false;
        startBtn.value = "Go!";
    } else {
        startBtn.disabled = true;
        startBtn.value = "Select some vision";
    }
}

let planet = generateRandomPlanet();
renderSpectres(planet);
ensureVisonSelected();

const rerollBtn = document.getElementById("reroll") as HTMLButtonElement;
rerollBtn.addEventListener("click", ev => {


    for (const el of Array.from(document.getElementsByClassName("startScreen-tohide"))) {
        const tohide = el as HTMLElement;
        tohide.style.display = "block";
    }
    gameScreen.style.display = "none";
    startBtn.value = "Go!";

    for (const e of Array.from(document.getElementsByClassName("color-choice-radio-reset"))) {
        const r = e as HTMLInputElement;
        r.checked = true;
    }

    planet = generateRandomPlanet();
    renderSpectres(planet);
    ensureVisonSelected();
});


let game: Game | undefined;
startBtn.addEventListener("click", ev => {
    for (const el of Array.from(document.getElementsByClassName("startScreen-tohide"))) {
        const tohide = el as HTMLElement;
        tohide.style.display = "none";
    }
    gameScreen.style.display = "block";
    startBtn.value = "Restart";
    if (game) {
        game.kill();
    }
    game = new Game(planet);
});


