System.register("Spectre", [], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    var SpectreComponent, Spectre;
    return {
        setters: [],
        execute: function () {
            SpectreComponent = class SpectreComponent {
                constructor(xshift, xscale, yscale) {
                    this.xshift = xshift;
                    this.xscale = xscale;
                    this.yscale = yscale;
                }
                intensivity(wavelength) {
                    return Math.pow(Math.E, -Math.pow((wavelength - this.xshift) * this.xscale, 2)) * this.yscale;
                }
            };
            exports_1("SpectreComponent", SpectreComponent);
            Spectre = class Spectre {
                constructor(components, scale) {
                    this.components = components;
                    this.scale = scale;
                }
                intensivity(wavelength) {
                    return this.components.reduce((acc, c) => acc + c.intensivity(wavelength), 0) * this.scale;
                }
                // view
                drawOnCtx(ctx, fillStyle = undefined) {
                    const w = ctx.canvas.width;
                    const h = ctx.canvas.height;
                    const step = 2 / w;
                    ctx.beginPath();
                    ctx.moveTo(0, h);
                    for (let x = -1; x < 1; x += step) {
                        ctx.lineTo((x + 1) / step, h - h * this.intensivity(x));
                    }
                    ctx.lineTo(w, h);
                    ctx.closePath();
                    if (fillStyle) {
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    ctx.strokeStyle = "white";
                    ctx.stroke();
                }
            };
            exports_1("Spectre", Spectre);
        }
    };
});
System.register("Vision", [], function (exports_2, context_2) {
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Chemical", [], function (exports_3, context_3) {
    var __moduleName = context_3 && context_3.id;
    var Chemical;
    return {
        setters: [],
        execute: function () {
            Chemical = class Chemical {
                constructor(spectre, price) {
                    this.spectre = spectre;
                    this.price = price;
                }
                // view
                drawOnCtx(ctx, vision) {
                    this.spectre.drawOnCtx(ctx, `rgba(${vision.r ? Math.round(255 * vision.map.get(vision.r).get(this)) : 0},`
                        + `${vision.g ? Math.round(255 * vision.map.get(vision.g).get(this)) : 0},`
                        + `${vision.b ? Math.round(255 * vision.map.get(vision.b).get(this)) : 0})`);
                }
            };
            exports_3("Chemical", Chemical);
        }
    };
});
System.register("debug", [], function (exports_4, context_4) {
    var __moduleName = context_4 && context_4.id;
    var drawPriceOverFlowers, showFlowersOnPage, version;
    return {
        setters: [],
        execute: function () {
            exports_4("drawPriceOverFlowers", drawPriceOverFlowers = false);
            exports_4("showFlowersOnPage", showFlowersOnPage = false);
            exports_4("version", version = "v3");
        }
    };
});
System.register("MappedSprite", ["debug"], function (exports_5, context_5) {
    var __moduleName = context_5 && context_5.id;
    var debug, MappedSprite;
    return {
        setters: [
            function (debug_1) {
                debug = debug_1;
            }
        ],
        execute: function () {
            MappedSprite = class MappedSprite {
                constructor(source, chemicalMap) {
                    this.source = source;
                    this.chemicalMap = chemicalMap;
                    this.flowerPriceFactor = 1 / 300;
                    this.price = 0;
                }
                drawOnCtx(ctx, vision) {
                    this.lastCtx = ctx;
                    ctx.canvas.width = this.source.width;
                    ctx.canvas.height = this.source.height;
                    ctx.drawImage(this.source, 0, 0);
                    const imageData = ctx.getImageData(0, 0, this.source.width, this.source.height);
                    let fullPrice = 0;
                    let norm = 0;
                    for (let j = 0; j < imageData.width; j++) {
                        for (let i = 0; i < imageData.height; i++) {
                            const index = (i * imageData.width + j) * 4;
                            const r = imageData.data[index + 0];
                            const g = imageData.data[index + 1];
                            const b = imageData.data[index + 2];
                            const a = imageData.data[index + 3];
                            fullPrice += ((this.chemicalMap.r ? this.chemicalMap.r.price * r : 0)
                                + (this.chemicalMap.g ? this.chemicalMap.g.price * g : 0)
                                + (this.chemicalMap.b ? this.chemicalMap.b.price * b : 0)) * a;
                            norm += 255 - a;
                            imageData.data[index + 0] = Math.round(Math.min(vision.r
                                ? (vision.map.get(vision.r).get(this.chemicalMap.r) * r / 255) / 3
                                    + (vision.map.get(vision.r).get(this.chemicalMap.g) * g / 255) / 3
                                    + (vision.map.get(vision.r).get(this.chemicalMap.b) * b / 255) / 3
                                : 0, 1) * 255);
                            imageData.data[index + 1] = Math.round(Math.min(vision.g
                                ? (vision.map.get(vision.g).get(this.chemicalMap.r) * r / 255) / 3
                                    + (vision.map.get(vision.g).get(this.chemicalMap.g) * g / 255) / 3
                                    + (vision.map.get(vision.g).get(this.chemicalMap.b) * b / 255) / 3
                                : 0, 1) * 255);
                            imageData.data[index + 2] = Math.round(Math.min(vision.b
                                ? (vision.map.get(vision.b).get(this.chemicalMap.r) * r / 255) / 3
                                    + (vision.map.get(vision.b).get(this.chemicalMap.g) * g / 255) / 3
                                    + (vision.map.get(vision.b).get(this.chemicalMap.b) * b / 255) / 3
                                : 0, 1) * 255);
                            imageData.data[index + 3] = a;
                        }
                    }
                    ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
                    this.price = Math.floor(fullPrice / norm * this.flowerPriceFactor * 10) / 10;
                    if (debug.drawPriceOverFlowers) {
                        ctx.font = "40px arial";
                        ctx.fillStyle = "rgba(0, 0, 0, .8)";
                        ctx.fillRect(10, 10, ctx.canvas.width - 10, 40);
                        ctx.fillStyle = this.price > 0 ? "lime" : "red";
                        ctx.fillText(this.price.toFixed(1), 10, 40);
                    }
                }
            };
            exports_5("MappedSprite", MappedSprite);
        }
    };
});
System.register("Planet", [], function (exports_6, context_6) {
    var __moduleName = context_6 && context_6.id;
    function getConeChemicalMap(coneCell, chemical) {
        const step = .01;
        let acc = 0;
        for (let x = -1; x <= 1; x += step) {
            acc += coneCell.intensivity(x) * chemical.spectre.intensivity(x);
        }
        return acc;
    }
    exports_6("getConeChemicalMap", getConeChemicalMap);
    var Planet;
    return {
        setters: [],
        execute: function () {
            Planet = class Planet {
                constructor(chemicals, coneCells, flowers, grass) {
                    this.chemicals = chemicals;
                    this.coneCells = coneCells;
                    this.flowers = flowers;
                    this.grass = grass;
                    this.vision = {
                        r: undefined,
                        g: undefined,
                        b: undefined,
                        map: new WeakMap(),
                    };
                }
                mapConeCell(coneCell) {
                    // assert coneCell in this.coneCells
                    if (this.vision.map.has(coneCell)) {
                        return;
                    }
                    const submap = new WeakMap();
                    let max = -Infinity;
                    for (const chemical of this.chemicals) {
                        const activation = getConeChemicalMap(coneCell, chemical);
                        submap.set(chemical, activation);
                        if (activation > max) {
                            max = activation;
                        }
                    }
                    for (const chemical of this.chemicals) {
                        const activation = submap.get(chemical);
                        submap.set(chemical, activation / max);
                    }
                    this.vision.map.set(coneCell, submap);
                }
                ensureVisionMap() {
                    if (this.vision.r) {
                        this.mapConeCell(this.vision.r);
                    }
                    if (this.vision.g) {
                        this.mapConeCell(this.vision.g);
                    }
                    if (this.vision.b) {
                        this.mapConeCell(this.vision.b);
                    }
                }
            };
            exports_6("Planet", Planet);
        }
    };
});
System.register("utils/misc", [], function (exports_7, context_7) {
    var __moduleName = context_7 && context_7.id;
    function isVisible(elt) {
        const style = window.getComputedStyle(elt);
        return (style.width !== null && +style.width !== 0)
            && (style.height !== null && +style.height !== 0)
            && (style.opacity !== null && +style.opacity !== 0)
            && style.display !== "none"
            && style.visibility !== "hidden";
    }
    exports_7("isVisible", isVisible);
    function adjust(x, ...applyAdjustmentList) {
        for (const applyAdjustment of applyAdjustmentList) {
            applyAdjustment(x);
        }
        return x;
    }
    exports_7("adjust", adjust);
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    exports_7("getRandomElement", getRandomElement);
    function shuffle(array) {
        let a = [...array];
        for (let i = a.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    exports_7("shuffle", shuffle);
    function setPixel(imageData, x, y, r, g, b, a = 255) {
        const offset = (x * imageData.width + y) * 4;
        imageData.data[offset + 0] = r;
        imageData.data[offset + 1] = g;
        imageData.data[offset + 2] = b;
        imageData.data[offset + 3] = a;
    }
    exports_7("setPixel", setPixel);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Game", ["utils/misc"], function (exports_8, context_8) {
    var __moduleName = context_8 && context_8.id;
    var misc_1, Game;
    return {
        setters: [
            function (misc_1_1) {
                misc_1 = misc_1_1;
            }
        ],
        execute: function () {
            Game = class Game {
                constructor(planet) {
                    this.planet = planet;
                    this.totalTime = 0;
                    this.timeLeft = Game.initialTimeLeft;
                    this.gameOver = false;
                    this.flowers = [];
                    this.gameField = document.getElementById("gameField");
                    this.gameOverLabel = document.getElementById("gameOver-label");
                    this.maxTotalTimeLabel = document.getElementById("maxTotalTime-label");
                    this.totalTimeLabel = document.getElementById("totalTime-label");
                    this.timeLeftLabel = document.getElementById("timeLeft-label");
                    const canvasTerrain = document.getElementById("terrain");
                    const ctxTerrain = canvasTerrain.getContext("2d");
                    canvasTerrain.width = canvasTerrain.clientWidth;
                    canvasTerrain.height = canvasTerrain.clientHeight;
                    ctxTerrain.imageSmoothingEnabled = false;
                    for (let x = 0; x < canvasTerrain.width; x += planet.grass.lastCtx.canvas.width * Game.flowerScale) {
                        for (let y = 0; y < canvasTerrain.height; y += planet.grass.lastCtx.canvas.height * Game.flowerScale) {
                            ctxTerrain.drawImage(planet.grass.lastCtx.canvas, 0, 0, planet.grass.lastCtx.canvas.width, planet.grass.lastCtx.canvas.height, x, y, planet.grass.lastCtx.canvas.width * Game.flowerScale, planet.grass.lastCtx.canvas.height * Game.flowerScale);
                        }
                    }
                    const dt = 0.05;
                    this.timerId = setInterval(() => {
                        this.timeLeft -= dt;
                        if (this.timeLeft < 0) {
                            this.timeLeft = 0;
                            this.gameOver = true;
                            clearInterval(this.timerId);
                        }
                        else {
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
                renderStats() {
                    this.gameOverLabel.style.display = this.gameOver ? "block" : "none";
                    this.maxTotalTimeLabel.innerText = Game.maxTotalTime.toFixed(1);
                    this.totalTimeLabel.innerText = this.totalTime.toFixed(1);
                    this.totalTimeLabel.style.color = (this.totalTime === Game.maxTotalTime) ? "lime" : "white";
                    this.timeLeftLabel.innerText = this.timeLeft.toFixed(1);
                    this.timeLeftLabel.style.color = this.timeLeft < 5 ? "red" : "white";
                    if (this.timeLeft < 5) {
                        this.timeLeftLabel.style.fontSize = (40 - (this.timeLeft * 10) % 5) + "px";
                    }
                    const goatPlain = document.getElementById("goat-plain-ingame");
                    const goatSpace = document.getElementById("goat-space-ingame");
                    const goatSpace2 = document.getElementById("goat-space2-ingame");
                    goatPlain.style.display = this.timeLeft < 5 ? "none" : "block";
                    goatSpace.style.display = this.timeLeft < 5
                        ? (Math.round(this.timeLeft * 5) % 2 ? "block" : "none")
                        : "none";
                    goatSpace2.style.display = this.timeLeft < 5
                        ? (Math.round(this.timeLeft * 5) % 2 ? "none" : "block")
                        : "none";
                }
                addFlower() {
                    const flower = misc_1.getRandomElement(this.planet.flowers);
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
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(flower.lastCtx.canvas, 0, 0, canvas.width, canvas.height);
                    canvas.addEventListener("click", ev => {
                        if (!this.gameOver) {
                            this.timeLeft += flower.price;
                            const bonusLabel = document.createElement("label");
                            bonusLabel.classList.add("bonus-label");
                            if (flower.price > 0) {
                                bonusLabel.classList.add("positive-bonus-label");
                            }
                            else {
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
            };
            Game.flowerScale = .5;
            Game.initialTimeLeft = 20;
            Game.initialFlowerCount = 15;
            Game.flowerSpawnPerSecond = 1.5;
            Game.maxTotalTime = +(localStorage.getItem("maxTotalTime") || Game.initialTimeLeft);
            exports_8("Game", Game);
        }
    };
});
System.register("generator", ["Spectre", "Chemical", "Planet", "MappedSprite", "utils/misc"], function (exports_9, context_9) {
    var __moduleName = context_9 && context_9.id;
    function generateRandomConeCellSpectre() {
        const components = Array.from({ length: Math.round(Math.random() * 2 + 1) }, () => new Spectre_1.SpectreComponent((Math.random() - .5) * 2, 0.5 + (1 - Math.random() * Math.random()) * 7, 1 / (.25 + Math.random())));
        let max = -Infinity;
        for (let x = -1; x <= 1; x += .01) {
            const fx = components.reduce((acc, c) => acc + c.intensivity(x), 0);
            if (fx > max) {
                max = fx;
            }
        }
        return new Spectre_1.Spectre(components, 1 / max);
    }
    exports_9("generateRandomConeCellSpectre", generateRandomConeCellSpectre);
    function generateRandomChemicalSpectre() {
        const components = Array.from({ length: Math.round(Math.random() * 2 + 1) }, () => new Spectre_1.SpectreComponent((Math.random() - .5) * 2, 0.5 + (1 - Math.random() * Math.random()) * 4, 1 / (.25 + Math.random())));
        let max = -Infinity;
        for (let x = -1; x <= 1; x += .01) {
            const fx = components.reduce((acc, c) => acc + c.intensivity(x), 0);
            if (fx > max) {
                max = fx;
            }
        }
        return new Spectre_1.Spectre(components, 1 / max);
    }
    exports_9("generateRandomChemicalSpectre", generateRandomChemicalSpectre);
    function generateRandomPlanet() {
        const chemicals = Array.from({ length: 5 }, (v, k) => new Chemical_1.Chemical(generateRandomChemicalSpectre(), Math.sign(k - 2) * Math.pow(k - 2, 2)));
        const shuffledFlowerImages = misc_2.shuffle(Array.from(document.getElementsByClassName("flower-image")));
        const flowers = [];
        for (let i = 0; i < Math.floor(shuffledFlowerImages.length / 2); i++) {
            const rgbIndices = {
                r: Math.floor(Math.random() * chemicals.length),
                g: Math.floor(Math.random() * chemicals.length),
                b: Math.floor(Math.random() * chemicals.length),
            };
            flowers.push(new MappedSprite_1.MappedSprite(shuffledFlowerImages[i], {
                r: chemicals[rgbIndices.r],
                g: chemicals[rgbIndices.g],
                b: chemicals[rgbIndices.b],
            }));
            flowers.push(new MappedSprite_1.MappedSprite(shuffledFlowerImages[shuffledFlowerImages.length - 1 - i], {
                r: chemicals[chemicals.length - 1 - rgbIndices.r],
                g: chemicals[chemicals.length - 1 - rgbIndices.g],
                b: chemicals[chemicals.length - 1 - rgbIndices.b],
            }));
        }
        return new Planet_1.Planet(chemicals, Array.from({ length: 10 }, () => generateRandomConeCellSpectre()), flowers, new MappedSprite_1.MappedSprite(document.getElementsByClassName("grass-image")[0], ((array) => ({
            r: array[0],
            g: array[1],
            b: array[2],
        }))(misc_2.shuffle(chemicals.slice(1, 4)))));
    }
    exports_9("generateRandomPlanet", generateRandomPlanet);
    var Spectre_1, Chemical_1, Planet_1, MappedSprite_1, misc_2;
    return {
        setters: [
            function (Spectre_1_1) {
                Spectre_1 = Spectre_1_1;
            },
            function (Chemical_1_1) {
                Chemical_1 = Chemical_1_1;
            },
            function (Planet_1_1) {
                Planet_1 = Planet_1_1;
            },
            function (MappedSprite_1_1) {
                MappedSprite_1 = MappedSprite_1_1;
            },
            function (misc_2_1) {
                misc_2 = misc_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("main", ["Game", "generator", "debug"], function (exports_10, context_10) {
    var __moduleName = context_10 && context_10.id;
    function renderSpectres(planet) {
        planet.ensureVisionMap();
        const flowerChromes = document.getElementsByClassName("flower-chrome");
        for (let i = 0; i < planet.flowers.length; i++) {
            const s = planet.flowers[i];
            const c = flowerChromes[i];
            c.width = c.clientWidth;
            c.height = c.clientHeight;
            const cctx = c.getContext("2d");
            s.drawOnCtx(cctx, planet.vision);
        }
        const grassChrome = document.getElementsByClassName("grass-chrome")[0];
        grassChrome.width = grassChrome.clientWidth;
        grassChrome.height = grassChrome.clientHeight;
        const grassChromeCtx = grassChrome.getContext("2d");
        planet.grass.drawOnCtx(grassChromeCtx, planet.vision);
        for (let i = 1; i <= 5; i++) {
            const chemical = planet.chemicals[i - 1];
            const ci1 = document.getElementById(`chemical-info-${i}`);
            const ci1c = ci1.getElementsByClassName("chemical-spectre")[0];
            ci1c.width = ci1c.clientWidth;
            ci1c.height = ci1c.clientHeight;
            const ci1cctx = ci1c.getContext("2d");
            chemical.drawOnCtx(ci1cctx, planet.vision);
            const ci1p = ci1.getElementsByClassName("chemical-value")[0];
            ci1p.innerText = chemical.price.toString();
        }
        for (let i = 1; i <= 10; i++) {
            const coneCell1 = planet.coneCells[i - 1];
            const ci1 = document.getElementById(`coneCell-info-${i}`);
            const ci1c = ci1.getElementsByClassName("chemical-spectre")[0];
            ci1c.width = ci1c.clientWidth;
            ci1c.height = ci1c.clientHeight;
            const ci1cctx = ci1c.getContext("2d");
            coneCell1.drawOnCtx(ci1cctx, `rgba(${coneCell1 === planet.vision.r ? 255 : 0},`
                + `${coneCell1 === planet.vision.g ? 255 : 0},`
                + `${coneCell1 === planet.vision.b ? 255 : 0}, 1)`);
        }
    }
    function ensureVisonSelected() {
        if (planet.vision.r || planet.vision.g || planet.vision.b) {
            startBtn.disabled = false;
            startBtn.value = "Go!";
        }
        else {
            startBtn.disabled = true;
            startBtn.value = "Select some vision";
        }
    }
    var Game_1, generator_1, debug, startScreen, flowersContainer, gameScreen, startBtn, versionLabel, splashScreen, splashCounter, splashIntervalHandler, planet, rerollBtn, game;
    return {
        setters: [
            function (Game_1_1) {
                Game_1 = Game_1_1;
            },
            function (generator_1_1) {
                generator_1 = generator_1_1;
            },
            function (debug_2) {
                debug = debug_2;
            }
        ],
        execute: function () {
            startScreen = document.getElementById("startScreen");
            flowersContainer = document.getElementById("flowers");
            gameScreen = document.getElementById("gameScreen");
            startBtn = document.getElementById("startGame");
            versionLabel = document.getElementById("version");
            splashScreen = document.getElementById("splashScreen");
            versionLabel.innerText = debug.version;
            splashCounter = 0;
            splashIntervalHandler = setInterval(() => {
                splashCounter++;
                splashScreen.style.opacity = (1 - splashCounter / 20).toString();
                startScreen.style.opacity = (splashCounter / 20).toString();
                if (splashCounter > 18) {
                    clearInterval(splashIntervalHandler);
                    splashScreen.remove();
                    startScreen.style.opacity = "1";
                }
            }, 50);
            if (debug.showFlowersOnPage) {
                flowersContainer.style.display = "block";
            }
            gameScreen.style.display = "none";
            for (const e of Array.from(document.getElementsByClassName("color-choice-radio"))) {
                e.addEventListener("click", ev => {
                    const el = ev.target;
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
                });
            }
            planet = generator_1.generateRandomPlanet();
            renderSpectres(planet);
            ensureVisonSelected();
            rerollBtn = document.getElementById("reroll");
            rerollBtn.addEventListener("click", ev => {
                for (const el of Array.from(document.getElementsByClassName("startScreen-tohide"))) {
                    const tohide = el;
                    tohide.style.display = "block";
                }
                gameScreen.style.display = "none";
                startBtn.value = "Go!";
                for (const e of Array.from(document.getElementsByClassName("color-choice-radio-reset"))) {
                    const r = e;
                    r.checked = true;
                }
                planet = generator_1.generateRandomPlanet();
                renderSpectres(planet);
                ensureVisonSelected();
            });
            startBtn.addEventListener("click", ev => {
                for (const el of Array.from(document.getElementsByClassName("startScreen-tohide"))) {
                    const tohide = el;
                    tohide.style.display = "none";
                }
                gameScreen.style.display = "block";
                startBtn.value = "Restart";
                if (game) {
                    game.kill();
                }
                game = new Game_1.Game(planet);
            });
        }
    };
});
//# sourceMappingURL=app.js.map