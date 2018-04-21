export class SpectreComponent {
    constructor(
        public xshift: number,
        public xscale: number,
        public yscale: number,
    ) {

    }

    value(x: number) {
        return Math.pow(Math.E, -Math.pow((x - this.xshift) * this.xscale, 2)) * this.yscale;
    }
}

export class Spectre {
    constructor(
        public components: SpectreComponent[],
        public scale: number,
    ) {

    }

    value(x: number) {
        return this.components.reduce((acc, c) => acc + c.value(x), 0) * this.scale;
    }

    drawOnCtx(ctx: CanvasRenderingContext2D) {
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
}
