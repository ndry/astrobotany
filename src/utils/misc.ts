export function isVisible(elt: Element): boolean {
    const style = window.getComputedStyle(elt);
    return (style.width !== null && +style.width !== 0)
        && (style.height !== null && +style.height !== 0)
        && (style.opacity !== null && +style.opacity !== 0)
        && style.display !== "none"
        && style.visibility !== "hidden";
}

export function adjust<T>(
    x: T,
    ...applyAdjustmentList: Array<((x: T) => void)>,
): T {
    for (const applyAdjustment of applyAdjustmentList) {
        applyAdjustment(x);
    }
    return x;
}

export function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export function setPixel(imageData: ImageData, x: number, y: number, r: number, g: number, b: number, a: number = 255) {
    const offset = (x * imageData.width + y) * 4;
    imageData.data[offset + 0] = r;
    imageData.data[offset + 1] = g;
    imageData.data[offset + 2] = b;
    imageData.data[offset + 3] = a;
}
