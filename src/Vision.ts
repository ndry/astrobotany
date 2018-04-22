import { Spectre } from "./Spectre";
import { Chemical } from "./Chemical";

export interface Vision {
    r: Spectre | undefined,
    g: Spectre | undefined,
    b: Spectre | undefined,
    map: WeakMap<Spectre, WeakMap<Chemical, number>>
}
