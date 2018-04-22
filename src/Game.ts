import { Planet } from "./Planet";
import { getRandomElement } from "./utils/misc";

export class Game {
    public totalTime = 0;
    public timeLeft = 10;
    public gameOver = false;
    public timerId: number;

    public flowerScale = .3;

    public flowers: HTMLCanvasElement[] = [];

    public gameField = document.getElementById("gameField") as HTMLDivElement;

    constructor (
        public planet: Planet,
    ) {
        const canvasTerrain = document.getElementById("terrain") as HTMLCanvasElement;
        const ctxTerrain = canvasTerrain.getContext("2d")!;
        
        canvasTerrain.width = canvasTerrain.clientWidth;
        canvasTerrain.height = canvasTerrain.clientHeight;
        
        ctxTerrain.imageSmoothingEnabled = false;
    
        for (let x = 0; x < canvasTerrain.width; x += planet.grass.lastCtx!.canvas.width * this.flowerScale) {
            for (let y = 0; y < canvasTerrain.height; y += planet.grass.lastCtx!.canvas.height * this.flowerScale) {
                ctxTerrain.drawImage(
                    planet.grass.lastCtx!.canvas,
                    0, 0,
                    planet.grass.lastCtx!.canvas.width, 
                    planet.grass.lastCtx!.canvas.height,
                    x, y,
                    planet.grass.lastCtx!.canvas.width * this.flowerScale, 
                    planet.grass.lastCtx!.canvas.height * this.flowerScale,
                )
            }        
        }

        const dt = 0.05;
        this.timerId = setInterval(() => {
            this.timeLeft -= dt;
            if (this.timeLeft < 0) {
                this.timeLeft = 0;
                this.gameOver = true;
                clearInterval(this.timerId);
            } else {
                this.totalTime += dt;
                if (Math.random() < 1 * dt) {
                    this.addFlower();
                }
            }
            this.renderStats();
        }, dt * 1000);
        for (let i = 0; i < 15; i++) {
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
        timeLeftLabel.style.color = this.timeLeft < 5 ? "red" : "white"
        if (this.timeLeft < 5) {
            timeLeftLabel.style.fontSize = (40 - (this.timeLeft * 10) % 5) + "px";
        }

        const goatPlain = document.getElementById("goat-plain-ingame") as HTMLImageElement;
        const goatSpace = document.getElementById("goat-space-ingame") as HTMLImageElement;
        const goatSpace2 = document.getElementById("goat-space2-ingame") as HTMLImageElement;

        goatPlain.style.display = this.timeLeft < 5 ? "none" : "block";        
        goatSpace.style.display = this.timeLeft < 5
            ? (Math.round(this.timeLeft * 5) % 2 ? "block" : "none")
            : "none";
        goatSpace2.style.display = this.timeLeft < 5
            ? (Math.round(this.timeLeft * 5) % 2 ? "none" : "block")
            : "none";
    }

    addFlower() {
        
        
        const flower = getRandomElement(this.planet.flowers);
        const left = 2 + Math.random() * (this.gameField.clientWidth - flower.source.width * this.flowerScale - 4);
        const top = 2 + Math.random() * (this.gameField.clientHeight - flower.source.height * this.flowerScale - 4);
        
        const canvas = document.createElement("canvas");
        this.gameField.appendChild(canvas);
        this.flowers.push(canvas);
        canvas.style.position = "absolute";
        canvas.style.left = left + "px";
        canvas.style.top = top + "px";
        canvas.width = flower.source.width * this.flowerScale;
        canvas.height = flower.source.height * this.flowerScale;
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
                this.gameField.appendChild(bonusLabel);
                let c = 0;
                const anim = setInterval(() => {
                    c++;
                    bonusLabel.style.top = ev.layerY + top - c * 3 + "px";
                    bonusLabel.style.left = ev.layerX + left + c + "px";
                    bonusLabel.style.opacity = (1 - c / 20).toString();
                    if (c > 20) {
                        clearInterval(anim);
                        this.gameField.removeChild(bonusLabel);
                    }
                }, 50);
                this.gameField.removeChild(canvas);
                this.flowers = this.flowers.filter(f => f !== canvas);
            }
        });

    }

    kill() {
        clearInterval(this.timerId);
        for (const f of this.flowers) {
            this.gameField.removeChild(f);
        }
        this.flowers = [];
    }
}
