import { Spectre } from "./Spectre";
import { Vision } from "./Vision";

export class Chemical {
    constructor(
        public spectre: Spectre,
        public price: number,
    ) {

    }

    // view
    drawOnCtx(ctx: CanvasRenderingContext2D, vision: Vision) {
        this.spectre.drawOnCtx(ctx, 
            `rgba(${vision.r ? Math.round(255 * vision.map.get(vision.r)!.get(this)!) : 0},`
            + `${vision.g ? Math.round(255 * vision.map.get(vision.g)!.get(this)!) : 0},`
            + `${vision.b ? Math.round(255 * vision.map.get(vision.b)!.get(this)!) : 0})`);
    }
}
