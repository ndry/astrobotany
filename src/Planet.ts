import { Chemical } from "./Chemical";
import { Spectre } from "./Spectre";
import { MappedSprite } from "./MappedSprite";
import { Vision } from "./Vision";



export class Planet {
    vision: Vision = {
        r: undefined,
        g: undefined,
        b: undefined,
        map: new WeakMap<Spectre, WeakMap<Chemical, number>>(),
    }
    

    constructor(
        public chemicals: Chemical[],
        public coneCells: Spectre[],
        public flowers: MappedSprite[],
    ) {

    }

    mapConeCell(coneCell: Spectre) {
        // assert coneCell in this.coneCells
        if (this.vision.map.has(coneCell)) {
            return;
        }

        const submap = new WeakMap<Chemical, number>();
        let max = -Infinity;
        for (const chemical of this.chemicals) {
            const activation = getConeChemicalMap(coneCell, chemical);
            submap.set(chemical, activation);
            if (activation > max) {
                max = activation;
            }
        }
        for (const chemical of this.chemicals) {
            const activation = submap.get(chemical)!;
            submap.set(chemical, activation / max);
        }
        this.vision.map.set(coneCell, submap);
    }

    ensureVisionMap() {
        if (this.vision.r) { this.mapConeCell(this.vision.r); }
        if (this.vision.g) { this.mapConeCell(this.vision.g); }
        if (this.vision.b) { this.mapConeCell(this.vision.b); }
    }
}

export function getConeChemicalMap(coneCell: Spectre, chemical: Chemical) {
    const step = .01;
    let acc = 0;
    for (let x = -1; x <= 1; x += step) {
        acc += coneCell.intensivity(x) * chemical.spectre.intensivity(x);
    }
    return acc;
}