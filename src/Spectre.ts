
export class SpectreComponent {
    constructor(
        public xshift: number,
        public xscale: number,
        public yscale: number,
    ) {

    }

    intensivity(wavelength: number) {
        return Math.pow(Math.E, -Math.pow((wavelength - this.xshift) * this.xscale, 2)) * this.yscale;
    }
}

export class Spectre {
    constructor(
        public components: SpectreComponent[],
        public scale: number,
    ) {

    }

    intensivity(wavelength: number) {
        return this.components.reduce((acc, c) => acc + c.intensivity(wavelength), 0) * this.scale;
    }

    // view
    drawOnCtx(ctx: CanvasRenderingContext2D, fillStyle: string | undefined = undefined) {
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
}
