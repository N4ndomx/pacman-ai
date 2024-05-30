import { HttpClient } from "@angular/common/http";
import { DIRECTION } from "src/app/canvas/Dir.enum";
import { GhoststepsService } from "src/app/services/ghoststeps.service";
import { TableroService } from "src/app/services/tablero.service";

export class Ghost {
    private ghostImage: HTMLImageElement = new Image();
    private frameCount: number;
    private currentFrame = 1;

    constructor(
        private x: number,
        private y: number,
        private tail_x: number,
        private tail_y: number,
        private width: number,
        private height: number,
        private canvas: HTMLCanvasElement,
        private tablero: TableroService,
        private ctx: CanvasRenderingContext2D,
    ) {
        this.ghostImage.src = 'assets/img/ghost.png'
        this.frameCount = 7;
        this.currentFrame = 1;
        setInterval(() => {
            this.changeAnimation();
        }, 100);
    }

    async moveProcess(ghostservi: GhoststepsService) {
        this.logPosition(); // Para depuración
        const init = {
            x: this.getMapX(),
            y: this.getMapY()
        };
        const fin = {
            x: 1,
            y: 1
        };
        const nextPosition = await ghostservi.getNextPositionFromAPI(init, fin);
        console.log(`Sig posicion en MAP: ${nextPosition?.x}, ${nextPosition?.y}`);
        if (nextPosition) {
            const mc = this.mapToCanvasCoordinates(nextPosition.x, nextPosition.y);
            console.log(`Converted canvas coordinates: x=${mc.x}, y=${mc.y}`);
            this.x = mc.x;
            this.y = mc.y;
        }
        if (this.checkCollisions()) {
            console.log("Collision detected!");
            return;
        }
        if (this.x + this.width > this.canvas.width) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = this.canvas.width - this.width;
        }
    }

    checkCollisions() {
        let isCollided = false;
        if (
            this.tablero.map[parseInt((this.y / this.tablero.oneBlockSize).toString())][parseInt((this.x / this.tablero.oneBlockSize).toString())] == 1 ||
            this.tablero.map[parseInt((this.y / this.tablero.oneBlockSize + 0.9999).toString())][parseInt((this.x / this.tablero.oneBlockSize).toString())] == 1 ||
            this.tablero.map[parseInt((this.y / this.tablero.oneBlockSize).toString())][parseInt((this.x / this.tablero.oneBlockSize + 0.9999).toString())] == 1 ||
            this.tablero.map[parseInt((this.y / this.tablero.oneBlockSize + 0.9999).toString())][parseInt((this.x / this.tablero.oneBlockSize + 0.9999).toString())] == 1
        ) {
            isCollided = true;
        }
        return isCollided;
    }

    changeAnimation() {
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    draw() {
        this.ctx.save();
        this.ctx.drawImage(
            this.ghostImage,
            this.tail_x, this.tail_y,
            124,
            116,
            this.x,
            this.y,
            this.width,
            this.height
        );
        this.ctx.restore();
    }

    logPosition() {
        const mapX = this.getMapX();
        const mapY = this.getMapY();

        console.log(`Position in pixels: x=${this.x}, y=${this.y}`);
        console.log(`Position in map: mapX=${mapX}, mapY=${mapY}`);
    }

    getMapX(): number {
        return Math.floor(this.y / this.tablero.oneBlockSize);
    }

    getMapY(): number {
        return Math.floor(this.x / this.tablero.oneBlockSize);
    }

    mapToCanvasCoordinates(mapX: number, mapY: number): { x: number, y: number } {
        const canvasX = mapX * this.tablero.oneBlockSize;
        const canvasY = mapY * this.tablero.oneBlockSize;
        console.log("Traducción : " + "X=" + canvasY + ", Y=" + canvasX);
        return { x: canvasY, y: canvasX };
    }
}

export let findValidGhostPosition = (map: number[][], oneBlockSize: number) => {
    let validPositionFound = false;
    let x, y;
    while (!validPositionFound) {
        x = Math.floor(Math.random() * (map[0].length - 2) + 1) * oneBlockSize;
        y = Math.floor(Math.random() * (map.length - 2) + 1) * oneBlockSize;
        if (
            map[parseInt((y / oneBlockSize).toString())][parseInt((x / oneBlockSize).toString())] != 1 &&
            map[parseInt(((y - oneBlockSize) / oneBlockSize).toString())][parseInt((x / oneBlockSize).toString())] != 1 &&
            map[parseInt(((y + oneBlockSize) / oneBlockSize).toString())][parseInt((x / oneBlockSize).toString())] != 1 &&
            map[parseInt((y / oneBlockSize).toString())][parseInt(((x - oneBlockSize) / oneBlockSize).toString())] != 1 &&
            map[parseInt((y / oneBlockSize).toString())][parseInt(((x + oneBlockSize) / oneBlockSize).toString())] != 1
        ) {
            validPositionFound = true;
        }
    }
    return { x, y };
};
