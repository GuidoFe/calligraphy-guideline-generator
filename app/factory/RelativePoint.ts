export class RelativePoint {
    origin = {x: 0, y: 0}
    setOrigin(x: number, y: number) {
        this.origin = {x: x, y: y};
    }
    get(rel: {x: number, y: number}): {x: number, y: number} {
        return {
            x: this.origin.x + rel.x,
            y: this.origin.y + rel.y,
        }
    }

}
