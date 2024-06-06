import { GhoststepsService } from "src/app/services/ghoststeps.service";
import { TableroService } from "src/app/services/tablero.service";
import { Pacman } from "./pacman";

export class Ghost {
    protected ghostImage: HTMLImageElement = new Image();
    protected frameCount: number;
    protected currentFrame = 1;
    protected moveSpeed: number;
    protected pathQueue: { x: number, y: number }[] = [];
    protected x:number=0;
    protected y:number=0;

    constructor(
        //private x: number,
        //private y: number,
        private tail_x: number,
        private tail_y: number,
        private width: number,
        private height: number,
        private canvas: HTMLCanvasElement,
        protected tablero: TableroService,
        private ctx: CanvasRenderingContext2D,
        protected pacman: Pacman,
        protected ghostser: GhoststepsService
    ) {
        this.ghostImage.src = 'assets/img/ghost.png';
        this.frameCount = 7;
        this.currentFrame = 1;

        this.moveSpeed = 3.7; // Velocidad de movimiento en píxeles por frame
        this.getCenter()

        setInterval(() => {
            this.changeAnimation();
        }, 100);

    }

    getCenter(){
        var map = this.tablero.map
        this.y = ((Math.floor(map.length/2))*this.tablero.oneBlockSize)
        this.x = ((Math.floor(map[0].length/2))*this.tablero.oneBlockSize)
        this.pathQueue=[]
    }

    async preloadPathQueue() {
        while (this.pathQueue.length < 3) { // Maintain a buffer of 5 positions
            const init = this.pathQueue.length > 0 ? this.pathQueue[this.pathQueue.length - 1] : { x: this.getMapX(), y: this.getMapY() };
            const fin = { x: this.pacman.getMapY(), y: this.pacman.getMapX() };
            const nextPosition = await this.ghostser.getNextPositionFromAPI(init, fin);
            if (nextPosition) {
                this.pathQueue.push(nextPosition);
            }
        }
    }

    async moveProcess() {
        if (this.pathQueue.length === 0) {
            await this.preloadPathQueue(); // Ensure the queue is preloaded
        }

        if (this.pathQueue.length > 0) {
            const nextTarget = this.pathQueue[0];
            const target = this.mapToCanvasCoordinates(nextTarget.x, nextTarget.y);
            const dx = target.x - this.x;
            const dy = target.y - this.y;

            if (Math.abs(dx) > this.moveSpeed) {
                this.x += Math.sign(dx) * this.moveSpeed;
            } else {
                this.x = target.x;
            }

            if (Math.abs(dy) > this.moveSpeed) {
                this.y += Math.sign(dy) * this.moveSpeed;
            } else {
                this.y = target.y;
            }

            if (this.x === target.x && this.y === target.y) {
                this.pathQueue.shift(); // Remove the reached position
            }

            if (this.x + this.width > this.canvas.width) {
                this.x = 0;
            } else if (this.x < 0) {
                this.x = this.canvas.width - this.width;
            }

            // Preload new positions if needed
            await this.preloadPathQueue();
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