import { Chemical } from "./Chemical";
import { Spectre } from "./Spectre";
import { MappedSprite } from "./MappedSprite";



export class Planet {
    coneCellChemicalMap = new WeakMap<Spectre, WeakMap<Chemical, number>>();

    constructor(
        public chemicals: Chemical[],
        public coneCells: Spectre[],
        public flowers: MappedSprite[],
    ) {

    }

    mapConeCell(coneCell: Spectre) {
        // assert coneCell in this.coneCells

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
        this.coneCellChemicalMap.set(coneCell, submap);
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