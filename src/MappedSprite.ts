import { Chemical } from "./Chemical";
import { Spectre } from "./Spectre";
import { Vision } from "./Vision";
import * as debug from "./debug";

export class MappedSprite {
    constructor(
        public source: HTMLImageElement,
        public chemicalMap: {
            r: Chemical | undefined,
            g: Chemical | undefined,
            b: Chemical | undefined,
        },
    ) {

    }

    price = 0;
    lastCtx: CanvasRenderingContext2D | undefined;

    drawOnCtx(
        ctx: CanvasRenderingContext2D,
        vision: Vision,
    ) {
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
                norm += 255-a;

                imageData.data[index + 0] = Math.min(vision.r
                    ? (this.chemicalMap.r
                            ? Math.round(vision.map.get(vision.r)!.get(this.chemicalMap.r)! * r / 255)
                            : 0) / 3
                        + (this.chemicalMap.g
                            ? Math.round(vision.map.get(vision.r)!.get(this.chemicalMap.g)! * r / 255)
                            : 0) / 3
                        + (this.chemicalMap.b
                            ? Math.round(vision.map.get(vision.r)!.get(this.chemicalMap.b)! * r / 255)
                            : 0) / 3
                    : 0, 1) * 255;
                imageData.data[index + 1] = Math.min(vision.g
                    ? (this.chemicalMap.r
                            ? Math.round(vision.map.get(vision.g)!.get(this.chemicalMap.r)! * g / 255)
                            : 0) / 3
                        + (this.chemicalMap.g
                            ? Math.round(vision.map.get(vision.g)!.get(this.chemicalMap.g)! * g / 255)
                            : 0) / 3
                        + (this.chemicalMap.b
                            ? Math.round(vision.map.get(vision.g)!.get(this.chemicalMap.b)! * g / 255)
                            : 0) / 3
                    : 0, 1) * 255;
                imageData.data[index + 2] = Math.min(vision.b
                    ? (this.chemicalMap.r
                            ? Math.round(vision.map.get(vision.b)!.get(this.chemicalMap.r)! * b / 255)
                            : 0) / 3
                        + (this.chemicalMap.g
                            ? Math.round(vision.map.get(vision.b)!.get(this.chemicalMap.g)! * b / 255)
                            : 0) / 3
                        + (this.chemicalMap.b
                            ? Math.round(vision.map.get(vision.b)!.get(this.chemicalMap.b)! * b / 255)
                            : 0) / 3
                    : 0, 1) * 255;
                imageData.data[index + 3] = a;
            }
        }

        ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);

        this.price = Math.floor(fullPrice / norm / 500 * 10) / 10;
            
        if (debug.drawPriceOverFlowers) {
            ctx.font = "40px arial";
            ctx.fillStyle = "rgba(0, 0, 0, .8)";
            ctx.fillRect(10, 10, ctx.canvas.width - 10, 40);
            ctx.fillStyle = this.price > 0 ? "lime" : "red";
            ctx.fillText(this.price.toFixed(1), 10, 40);
        }
    }
}
