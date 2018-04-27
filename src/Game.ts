import { Planet } from "./Planet";
import { getRandomElement } from "./utils/misc";

export class Game {
    static flowerScale = .5;
    static initialTimeLeft = 20;
    static initialFlowerCount = 15;
    static flowerSpawnPerSecond = 1.5;

    static maxTotalTime = +(localStorage.getItem("maxTotalTime") || Game.initialTimeLeft);

    public totalTime = 0;
    public timeLeft = Game.initialTimeLeft;
    public gameOver = false;
    public timerId: number;


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
    
        for (let x = 0; x < canvasTerrain.width; x += planet.grass.lastCtx!.canvas.width * Game.flowerScale) {
            for (let y = 0; y < canvasTerrain.height; y += planet.grass.lastCtx!.canvas.height * Game.flowerScale) {
                ctxTerrain.drawImage(
                    planet.grass.lastCtx!.canvas,
                    0, 0,
                    planet.grass.lastCtx!.canvas.width, 
                    planet.grass.lastCtx!.canvas.height,
                    x, y,
                    planet.grass.lastCtx!.canvas.width * Game.flowerScale, 
                    planet.grass.lastCtx!.canvas.height * Game.flowerScale,
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
                if (this.totalTime > Game.maxTotalTime) {
                    Game.maxTotalTime = this.totalTime;
                    localStorage.setItem("maxTotalTime", Game.maxTotalTime.toString());
                }
                if (Math.random() < Game.flowerSpawnPerSecond * dt) {
                    this.addFlower();
                }
            }
            this.renderStats();
        }, dt * 1000);
        for (let i = 0; i < Game.initialFlowerCount; i++) {
            this.addFlower();
        }
        this.renderStats();
    }

    gameOverLabel = document.getElementById("gameOver-label") as HTMLLabelElement;
    maxTotalTimeLabel = document.getElementById("maxTotalTime-label") as HTMLLabelElement;
    totalTimeLabel = document.getElementById("totalTime-label") as HTMLLabelElement;
    timeLeftLabel = document.getElementById("timeLeft-label") as HTMLLabelElement;
        
    renderStats() {
        this.gameOverLabel.style.display = this.gameOver ? "block" : "none";
        this.maxTotalTimeLabel.innerText = Game.maxTotalTime.toFixed(1);
        this.totalTimeLabel.innerText = this.totalTime.toFixed(1);
        this.totalTimeLabel.style.color = (this.totalTime === Game.maxTotalTime) ? "lime" : "white";
        this.timeLeftLabel.innerText = this.timeLeft.toFixed(1);
        this.timeLeftLabel.style.color = this.timeLeft < 5 ? "red" : "white"
        if (this.timeLeft < 5) {
            this.timeLeftLabel.style.fontSize = (40 - (this.timeLeft * 10) % 5) + "px";
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
        const left = 2 + Math.random() * (this.gameField.clientWidth - flower.source.width * Game.flowerScale - 4);
        const top = 2 + Math.random() * (this.gameField.clientHeight - flower.source.height * Game.flowerScale - 4);
        
        const canvas = document.createElement("canvas");
        this.gameField.appendChild(canvas);
        this.flowers.push(canvas);
        canvas.classList.add("flower-canvas");
        canvas.style.left = left + "px";
        canvas.style.top = top + "px";
        canvas.width = flower.source.width * Game.flowerScale;
        canvas.height = flower.source.height * Game.flowerScale;
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
                const bonusLabelX = ev.offsetX + left;
                const bonusLabelY = ev.offsetY + top;
                bonusLabel.style.left = bonusLabelX + "px";
                bonusLabel.style.top = bonusLabelY + "px";
                this.gameField.appendChild(bonusLabel);
                let c = 0;
                const anim = setInterval(() => {
                    c++;
                    bonusLabel.style.left = bonusLabelX - c * 3 + "px";
                    bonusLabel.style.top = bonusLabelY + c + "px";
                    bonusLabel.style.opacity = (1 - c / 20).toString();
                    if (c > 20) {
                        clearInterval(anim);
                        this.gameField.removeChild(bonusLabel);
                    }
                }, 50);
                canvas.remove();
                this.flowers = this.flowers.filter(f => f !== canvas);
            }
        });
        setTimeout(() => {
            if (!this.gameOver) {
                canvas.remove();
                this.flowers = this.flowers.filter(f => f !== canvas);
            }
        }, 1000 / Game.flowerSpawnPerSecond * 30 * (1 + Math.random()));
    }

    kill() {
        clearInterval(this.timerId);
        for (const f of this.flowers) {
            this.gameField.removeChild(f);
        }
        this.flowers = [];
    }
}
