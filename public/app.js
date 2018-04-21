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
                value(x) {
                    return Math.pow(Math.E, -Math.pow((x - this.xshift) * this.xscale, 2)) * this.yscale;
                }
            };
            exports_1("SpectreComponent", SpectreComponent);
            Spectre = class Spectre {
                constructor(components, scale) {
                    this.components = components;
                    this.scale = scale;
                }
                value(x) {
                    return this.components.reduce((acc, c) => acc + c.value(x), 0) * this.scale;
                }
                drawOnCtx(ctx) {
                    const w = ctx.canvas.width;
                    const h = ctx.canvas.height;
                    const step = 2 / w;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    for (let x = -1; x < 1; x += step) {
                        ctx.lineTo((x + 1) / step, h - h * this.value(x));
                    }
                    ctx.strokeStyle = "white";
                    ctx.stroke();
                }
            };
            exports_1("Spectre", Spectre);
        }
    };
});
System.register("Chemical", [], function (exports_2, context_2) {
    var __moduleName = context_2 && context_2.id;
    var Chemical;
    return {
        setters: [],
        execute: function () {
            Chemical = class Chemical {
                constructor(spectre, price) {
                    this.spectre = spectre;
                    this.price = price;
                }
            };
            exports_2("Chemical", Chemical);
        }
    };
});
System.register("utils/misc", [], function (exports_3, context_3) {
    var __moduleName = context_3 && context_3.id;
    function isVisible(elt) {
        const style = window.getComputedStyle(elt);
        return (style.width !== null && +style.width !== 0)
            && (style.height !== null && +style.height !== 0)
            && (style.opacity !== null && +style.opacity !== 0)
            && style.display !== "none"
            && style.visibility !== "hidden";
    }
    exports_3("isVisible", isVisible);
    function adjust(x, ...applyAdjustmentList) {
        for (const applyAdjustment of applyAdjustmentList) {
            applyAdjustment(x);
        }
        return x;
    }
    exports_3("adjust", adjust);
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    exports_3("getRandomElement", getRandomElement);
    function setPixel(imageData, x, y, r, g, b, a = 255) {
        const offset = (x * imageData.width + y) * 4;
        imageData.data[offset + 0] = r;
        imageData.data[offset + 1] = g;
        imageData.data[offset + 2] = b;
        imageData.data[offset + 3] = a;
    }
    exports_3("setPixel", setPixel);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("main", ["Chemical", "Spectre"], function (exports_4, context_4) {
    var __moduleName = context_4 && context_4.id;
    function coneCell1(x) {
        return Math.pow(Math.E, -Math.pow(x * 3, 2));
    }
    var Chemical_1, Spectre_1, canvasLeft, ctxLeft, width, height, canvasRight, ctxRight, canvasConeCells, ctxConeCells, ch1, chemicals, coneCells, sourceImage;
    return {
        setters: [
            function (Chemical_1_1) {
                Chemical_1 = Chemical_1_1;
            },
            function (Spectre_1_1) {
                Spectre_1 = Spectre_1_1;
            }
        ],
        execute: function () {
            canvasLeft = document.getElementById("canvas-left");
            ctxLeft = canvasLeft.getContext("2d");
            canvasLeft.width = canvasLeft.clientWidth;
            canvasLeft.height = canvasLeft.clientHeight;
            ctxLeft.imageSmoothingEnabled = false;
            width = canvasLeft.width;
            height = canvasLeft.height;
            canvasRight = document.getElementById("canvas-right");
            ctxRight = canvasRight.getContext("2d");
            canvasRight.width = canvasRight.clientWidth;
            canvasRight.height = canvasRight.clientHeight;
            ctxRight.imageSmoothingEnabled = false;
            canvasConeCells = document.getElementById("canvas-coneCells");
            ctxConeCells = canvasConeCells.getContext("2d");
            canvasConeCells.width = canvasConeCells.clientWidth;
            canvasConeCells.height = canvasConeCells.clientHeight;
            ctxConeCells.imageSmoothingEnabled = false;
            ch1 = new Chemical_1.Chemical(new Spectre_1.Spectre([
                new Spectre_1.SpectreComponent(0.3, 5, 0.5),
                new Spectre_1.SpectreComponent(-0.5, 10, 0.25),
                new Spectre_1.SpectreComponent(-1, 1, 0.25),
            ], 1), 0);
            chemicals = [];
            for (let i = 1; i <= 5; i++) {
                const components = Array.from({ length: Math.round(Math.random() * 5 + 1) }, () => new Spectre_1.SpectreComponent((Math.random() - .5) * 2, 0.5 + Math.random() * 10, 1 / (.25 + Math.random())));
                let max = -Infinity;
                for (let x = -1; x <= 1; x += .01) {
                    const fx = components.reduce((acc, c) => acc + c.value(x), 0);
                    if (fx > max) {
                        max = fx;
                    }
                }
                const chemical = new Chemical_1.Chemical(new Spectre_1.Spectre(components, 1 / max), Math.round((Math.random() - .5) * 5));
                chemicals.push(chemical);
                const ci1 = document.getElementById(`chemical-info-${i}`);
                const ci1c = ci1.getElementsByClassName("chemical-spectre")[0];
                ci1c.width = ci1c.clientWidth;
                ci1c.height = ci1c.clientHeight;
                const ci1cctx = ci1c.getContext("2d");
                chemical.spectre.drawOnCtx(ci1cctx);
                const ci1p = ci1.getElementsByClassName("chemical-value")[0];
                ci1p.innerText = chemical.price.toString();
            }
            coneCells = [];
            for (let i = 1; i <= 5; i++) {
                const components = Array.from({ length: Math.round(Math.random() * 5 + 1) }, () => new Spectre_1.SpectreComponent((Math.random() - .5) * 2, 0.5 + Math.random() * 10, 1 / (.25 + Math.random())));
                let max = -Infinity;
                for (let x = -1; x <= 1; x += .01) {
                    const fx = components.reduce((acc, c) => acc + c.value(x), 0);
                    if (fx > max) {
                        max = fx;
                    }
                }
                const coneCell = new Spectre_1.Spectre(components, 1 / max);
                coneCells.push(coneCell);
                const ci1 = document.getElementById(`coneCell-info-${i}`);
                const ci1c = ci1.getElementsByClassName("chemical-spectre")[0];
                ci1c.width = ci1c.clientWidth;
                ci1c.height = ci1c.clientHeight;
                const ci1cctx = ci1c.getContext("2d");
                coneCell.drawOnCtx(ci1cctx);
                ci1c.addEventListener("click", ev => {
                    function coneCell1_vs_chemical(i, x) {
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
            sourceImage = document.getElementById("source-image");
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
        }
    };
});
//# sourceMappingURL=app.js.map