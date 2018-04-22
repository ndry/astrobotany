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
System.register("generateRandomSpectre", ["Spectre"], function (exports_4, context_4) {
    var __moduleName = context_4 && context_4.id;
    function generateRandomSpectre() {
        const components = Array.from({ length: Math.round(Math.random() * 2 + 1) }, () => new Spectre_1.SpectreComponent((Math.random() - .5) * 2, 0.5 + (1 - Math.random() * Math.random()) * 10, 1 / (.25 + Math.random())));
        let max = -Infinity;
        for (let x = -1; x <= 1; x += .01) {
            const fx = components.reduce((acc, c) => acc + c.intensivity(x), 0);
            if (fx > max) {
                max = fx;
            }
        }
        return new Spectre_1.Spectre(components, 1 / max);
    }
    exports_4("generateRandomSpectre", generateRandomSpectre);
    var Spectre_1;
    return {
        setters: [
            function (Spectre_1_1) {
                Spectre_1 = Spectre_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("utils/misc", [], function (exports_5, context_5) {
    var __moduleName = context_5 && context_5.id;
    function isVisible(elt) {
        const style = window.getComputedStyle(elt);
        return (style.width !== null && +style.width !== 0)
            && (style.height !== null && +style.height !== 0)
            && (style.opacity !== null && +style.opacity !== 0)
            && style.display !== "none"
            && style.visibility !== "hidden";
    }
    exports_5("isVisible", isVisible);
    function adjust(x, ...applyAdjustmentList) {
        for (const applyAdjustment of applyAdjustmentList) {
            applyAdjustment(x);
        }
        return x;
    }
    exports_5("adjust", adjust);
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    exports_5("getRandomElement", getRandomElement);
    function setPixel(imageData, x, y, r, g, b, a = 255) {
        const offset = (x * imageData.width + y) * 4;
        imageData.data[offset + 0] = r;
        imageData.data[offset + 1] = g;
        imageData.data[offset + 2] = b;
        imageData.data[offset + 3] = a;
    }
    exports_5("setPixel", setPixel);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("MappedSprite", [], function (exports_6, context_6) {
    var __moduleName = context_6 && context_6.id;
    var MappedSprite;
    return {
        setters: [],
        execute: function () {
            MappedSprite = class MappedSprite {
                constructor(source, chemicalMap) {
                    this.source = source;
                    this.chemicalMap = chemicalMap;
                    this.price = 0;
                }
                drawOnCtx(ctx, vision) {
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
                            imageData.data[index + 0] = Math.min(vision.r
                                ? (this.chemicalMap.r
                                    ? Math.round(vision.map.get(vision.r).get(this.chemicalMap.r) * r / 255)
                                    : 0) / 3
                                    + (this.chemicalMap.g
                                        ? Math.round(vision.map.get(vision.r).get(this.chemicalMap.g) * r / 255)
                                        : 0) / 3
                                    + (this.chemicalMap.b
                                        ? Math.round(vision.map.get(vision.r).get(this.chemicalMap.b) * r / 255)
                                        : 0) / 3
                                : 0, 1) * 255;
                            imageData.data[index + 1] = Math.min(vision.g
                                ? (this.chemicalMap.r
                                    ? Math.round(vision.map.get(vision.g).get(this.chemicalMap.r) * g / 255)
                                    : 0) / 3
                                    + (this.chemicalMap.g
                                        ? Math.round(vision.map.get(vision.g).get(this.chemicalMap.g) * g / 255)
                                        : 0) / 3
                                    + (this.chemicalMap.b
                                        ? Math.round(vision.map.get(vision.g).get(this.chemicalMap.b) * g / 255)
                                        : 0) / 3
                                : 0, 1) * 255;
                            imageData.data[index + 2] = Math.min(vision.b
                                ? (this.chemicalMap.r
                                    ? Math.round(vision.map.get(vision.b).get(this.chemicalMap.r) * b / 255)
                                    : 0) / 3
                                    + (this.chemicalMap.g
                                        ? Math.round(vision.map.get(vision.b).get(this.chemicalMap.g) * b / 255)
                                        : 0) / 3
                                    + (this.chemicalMap.b
                                        ? Math.round(vision.map.get(vision.b).get(this.chemicalMap.b) * b / 255)
                                        : 0) / 3
                                : 0, 1) * 255;
                            imageData.data[index + 3] = a;
                        }
                    }
                    ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
                    this.price = Math.floor(fullPrice / norm);
                    ctx.font = "20px arial";
                    ctx.fillStyle = this.price > 0 ? "green" : "red";
                    ctx.fillText(this.price.toString(), 0, 30);
                }
            };
            exports_6("MappedSprite", MappedSprite);
        }
    };
});
System.register("Planet", [], function (exports_7, context_7) {
    var __moduleName = context_7 && context_7.id;
    function getConeChemicalMap(coneCell, chemical) {
        const step = .01;
        let acc = 0;
        for (let x = -1; x <= 1; x += step) {
            acc += coneCell.intensivity(x) * chemical.spectre.intensivity(x);
        }
        return acc;
    }
    exports_7("getConeChemicalMap", getConeChemicalMap);
    var Planet;
    return {
        setters: [],
        execute: function () {
            Planet = class Planet {
                constructor(chemicals, coneCells, flowers) {
                    this.chemicals = chemicals;
                    this.coneCells = coneCells;
                    this.flowers = flowers;
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
            exports_7("Planet", Planet);
        }
    };
});
System.register("main", ["utils/misc", "Chemical", "generateRandomSpectre", "Planet", "MappedSprite"], function (exports_8, context_8) {
    var __moduleName = context_8 && context_8.id;
    function renderSpectres() {
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
    var misc_1, Chemical_1, generateRandomSpectre_1, Planet_1, MappedSprite_1, planet, Game, startBtn;
    return {
        setters: [
            function (misc_1_1) {
                misc_1 = misc_1_1;
            },
            function (Chemical_1_1) {
                Chemical_1 = Chemical_1_1;
            },
            function (generateRandomSpectre_1_1) {
                generateRandomSpectre_1 = generateRandomSpectre_1_1;
            },
            function (Planet_1_1) {
                Planet_1 = Planet_1_1;
            },
            function (MappedSprite_1_1) {
                MappedSprite_1 = MappedSprite_1_1;
            }
        ],
        execute: function () {
            planet = (() => {
                const chemicals = Array.from({ length: 5 }, () => new Chemical_1.Chemical(generateRandomSpectre_1.generateRandomSpectre(), Math.round((Math.random() - .5) * Math.random() * Math.random() * 30)));
                return new Planet_1.Planet(chemicals, Array.from({ length: 10 }, () => generateRandomSpectre_1.generateRandomSpectre()), Array.from(document.getElementsByClassName("flower-image"))
                    .map(e => new MappedSprite_1.MappedSprite(e, {
                    r: misc_1.getRandomElement(chemicals),
                    g: misc_1.getRandomElement(chemicals),
                    b: misc_1.getRandomElement(chemicals),
                })));
            })();
            for (const e of Array.from(document.getElementsByClassName("color-choice-radio"))) {
                e.addEventListener("click", ev => {
                    const el = ev.srcElement;
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
                });
            }
            renderSpectres();
            Game = class Game {
                constructor(planet) {
                    this.planet = planet;
                    this.totalTime = 0;
                    this.timeLeft = 10;
                    this.gameOver = false;
                    const dt = 0.1;
                    this.timerId = setInterval(() => {
                        this.timeLeft -= dt;
                        if (this.timeLeft < 0) {
                            this.gameOver = true;
                            clearInterval(this.timerId);
                        }
                        else {
                            this.totalTime += dt;
                            if (Math.random() < 0.5 * dt) {
                                this.addFlower();
                            }
                        }
                        this.renderStats();
                    }, dt * 1000);
                    this.renderStats();
                }
                renderStats() {
                    const gameOverLabel = document.getElementById("gameOver-label");
                    gameOverLabel.style.display = this.gameOver ? "block" : "none";
                    const totalTimeLabel = document.getElementById("totalTime-label");
                    totalTimeLabel.innerText = this.totalTime.toFixed(1);
                    const timeLeftLabel = document.getElementById("timeLeft-label");
                    timeLeftLabel.innerText = this.timeLeft.toFixed(1);
                }
                addFlower() {
                    const gameField = document.getElementById("gameField");
                    const canvas = document.createElement("canvas");
                    canvas.style.position = "absolute";
                    canvas.style.left = Math.random() * gameField.clientWidth + "px";
                    canvas.style.top = Math.random() * gameField.clientHeight + "px";
                    const flower = misc_1.getRandomElement(planet.flowers);
                    canvas.width = flower.source.width;
                    canvas.height = flower.source.height;
                    const ctx = canvas.getContext("2d");
                    flower.drawOnCtx(ctx, planet.vision);
                    canvas.addEventListener("click", ev => {
                        if (!this.gameOver) {
                            this.timeLeft += flower.price / 500;
                            gameField.removeChild(canvas);
                        }
                    });
                    gameField.appendChild(canvas);
                }
            };
            startBtn = document.getElementById("startGame");
            startBtn.addEventListener("click", ev => {
                const canvasTerrain = document.getElementById("terrain");
                const ctxTerrain = canvasTerrain.getContext("2d");
                canvasTerrain.width = canvasTerrain.clientWidth;
                canvasTerrain.height = canvasTerrain.clientHeight;
                ctxTerrain.imageSmoothingEnabled = false;
                ctxTerrain.fillStyle = "#F0A0D0";
                ctxTerrain.fillRect(0, 0, canvasTerrain.width, canvasTerrain.height);
                const game = new Game(planet);
            });
        }
    };
});
//# sourceMappingURL=app.js.map