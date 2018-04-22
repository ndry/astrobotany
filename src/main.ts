import { adjust, getRandomElement, setPixel } from "./utils/misc";
import { Chemical } from "./Chemical";
import { Spectre, SpectreComponent } from "./Spectre";
import { generateRandomSpectre } from "./generateRandomSpectre";
import { Planet } from "./Planet";
import { MappedSprite } from "./MappedSprite";

const planet = (() => {
    const chemicals = Array.from(
        {length: 5},
        (v, k) => new Chemical(generateRandomSpectre(), Math.sign(k - 2) * Math.pow(k - 2, 2)));

    return new Planet(
        chemicals,
        Array.from(
            {length: 10},
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

function renderSpectres() {
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
        renderSpectres();
    })
}

renderSpectres();

class Game {
    public totalTime = 0;
    public timeLeft = 10;
    public gameOver = false;
    public timerId: number;

    constructor (
        public planet: Planet,
    ) {
        const dt = 0.1;
        this.timerId = setInterval(() => {
            this.timeLeft -= dt;
            if (this.timeLeft < 0) {
                this.gameOver = true;
                clearInterval(this.timerId);
            } else {
                this.totalTime += dt;
                if (Math.random() < 0.75 * dt) {
                    this.addFlower();
                }
            }
            this.renderStats();
        }, dt * 1000);
        for (let i = 0; i < 10; i++) {
            this.addFlower();
        }
        this.renderStats();
    }

    renderStats() {
        const gameOverLabel = document.getElementById("gameOver-label") as HTMLLabelElement;
        gameOverLabel.style.display = this.gameOver ? "block" : "none";
        const totalTimeLabel = document.getElementById("totalTime-label") as HTMLLabelElement;
        totalTimeLabel.innerText = this.totalTime.toFixed(1);
        const timeLeftLabel = document.getElementById("timeLeft-label") as HTMLLabelElement;
        timeLeftLabel.innerText = this.timeLeft.toFixed(1);
    }

    addFlower() {
        const flowerScale = .5;

        const gameField = document.getElementById("gameField") as HTMLDivElement;
        const canvas = document.createElement("canvas");
        gameField.appendChild(canvas);
        canvas.style.position = "absolute";
        const top = Math.random() * gameField.clientHeight;
        const left = Math.random() * gameField.clientWidth;
        canvas.style.left = left + "px";
        canvas.style.top = top + "px";
        const flower = getRandomElement(planet.flowers);
        canvas.width = flower.source.width * flowerScale;
        canvas.height = flower.source.height * flowerScale;
        canvas.style.zIndex = "10";
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(flower.lastCtx!.canvas,
            0, 0, canvas.width, canvas.height);
        canvas.addEventListener("click", ev => {
            if (!this.gameOver) {
                this.timeLeft += flower.price;
                const bonusLabel = document.createElement("label");
                bonusLabel.classList.add("bonus-label");
                if (flower.price > 0) {
                    bonusLabel.classList.add("positive-bonus-label");
                } else {
                    bonusLabel.classList.add("negative-bonus-label");
                }
                bonusLabel.innerText = flower.price.toFixed(1);
                bonusLabel.style.position = "absolute";
                bonusLabel.style.left = ev.layerX + left + "px";
                bonusLabel.style.top = ev.layerY + top + "px";
                bonusLabel.style.zIndex = "5";
                gameField.appendChild(bonusLabel);
                let c = 0;
                const anim = setInterval(() => {
                    c++;
                    bonusLabel.style.top = ev.layerY + top - c * 3 + "px";
                    bonusLabel.style.left = ev.layerX + left + c + "px";
                    bonusLabel.style.opacity = (1 - c / 20).toString();
                    if (c > 20) {
                        clearInterval(anim);
                        gameField.removeChild(bonusLabel);
                    }
                }, 50);
                gameField.removeChild(canvas);
                
            }
        });

    }
}


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


