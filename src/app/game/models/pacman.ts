import { DIRECTION } from "src/app/canvas/Dir.enum";
import { TableroService } from "src/app/services/tablero.service";

export class Pacman {
    private direction: DIRECTION
    private nextDirection: DIRECTION
    private frameCount: number
    private currentFrame = 1;
    private pacmanImage: HTMLImageElement = new Image();
    score: number = 0


    constructor(
        private x: number,
        private y: number,
        private width: number,
        private height: number,
        private speed: number,
        private canvas: HTMLCanvasElement,
        private tablero: TableroService,
        private ctx: CanvasRenderingContext2D,
    ) {
        this.pacmanImage.src = 'assets/img/animations.gif'
        this.direction = DIRECTION.DIRECTION_RIGHT;
        this.nextDirection = DIRECTION.DIRECTION_RIGHT;
        this.frameCount = 7;
        this.currentFrame = 1;
        setInterval(() => {
            this.changeAnimation();
        }, 10);
    }

    moveProcess() {
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            return;
        }
        if (this.x + this.width > this.canvas.width) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = this.canvas.width - this.width;
        }


        this.logPosition()

        //this.logMovement();
        //this.sendMovementsToAPI();
    }

    //logMovement() {
    //    this.movements.push({
    //        x: this.x,
    //        y: this.y,
    //        direction: this.direction
    //    });
    //}
    //


    logPosition() {
        const mapX = this.getMapX();
        const mapY = this.getMapY();
        const mapXRight = this.getMapXRightSide();
        const mapYRight = this.getMapYRightSide();

        // console.log(`Position in pixels: x=${this.x}, y=${this.y}`)aa;
        console.log(`Position in map: mapX=${mapX}, mapY=${mapY}`);
        console.log(`Right side position in map: mapXRight=${mapXRight}, mapYRight=${mapYRight}`);
    }


    eat(map: number[][],) {
        for (let i = 0; i < map.length + 1; i++) {
            for (let j = 0; j < map[0].length + 1; j++) {
                if (map[j][i] === 2 && this.getMapX() == j && this.getMapY() == i) {
                    map[j][i] = 0;
                    this.score++
                }
            }
        }
    }


    moveForwards() {
        switch (this.direction) {
            case DIRECTION.DIRECTION_RIGHT: this.x += this.speed; break;
            case DIRECTION.DIRECTION_UP: this.y -= this.speed; break;
            case DIRECTION.DIRECTION_LEFT: this.x -= this.speed; break;
            case DIRECTION.DIRECTION_BOTTOM: this.y += this.speed; break;
        }
    }

    moveBackwards() {
        switch (this.direction) {
            case DIRECTION.DIRECTION_RIGHT: this.x -= this.speed; break;
            case DIRECTION.DIRECTION_UP: this.y += this.speed; break;
            case DIRECTION.DIRECTION_LEFT: this.x += this.speed; break;
            case DIRECTION.DIRECTION_BOTTOM: this.y -= this.speed; break;
        }
    }

    alignToBlock() {
        this.x = Math.round(this.x / this.tablero.oneBlockSize) * this.tablero.oneBlockSize;
        this.y = Math.round(this.y / this.tablero.oneBlockSize) * this.tablero.oneBlockSize;
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

    // checkGhostCollision(ghosts) {
    //     for (let i = 0; i < ghosts.length; i++) {
    //         let ghost = ghosts[i];
    //         if (ghost.getMapX() == this.getMapX() && ghost.getMapY() == this.getMapY()) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    changeDirectionIfPossible() {
        if (this.direction == this.nextDirection) return;
        let tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
    }
    mapToCanvasCoordinates(mapX: number, mapY: number): { x: number, y: number } {
        const canvasX = mapX * this.tablero.oneBlockSize;
        const canvasY = mapY * this.tablero.oneBlockSize;
        console.log("Traducción : " + "X=" + canvasY + ", Y=" + canvasX);
        return { x: canvasY, y: canvasX };
    }

    getMapX(): number {
        return Math.floor(this.y / this.tablero.oneBlockSize);
    }

    getMapY(): number {
        return Math.floor(this.x / this.tablero.oneBlockSize);
    }
    getMapXRightSide() {
        return parseInt(((this.x * 0.99 + this.tablero.oneBlockSize) / this.tablero.oneBlockSize).toString());
    }

    getMapYRightSide() {
        return parseInt(((this.y * 0.99 + this.tablero.oneBlockSize) / this.tablero.oneBlockSize).toString());
    }

    changeAnimation() {
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }



    draw() {
        this.ctx.save();
        this.ctx.translate(this.x + this.tablero.oneBlockSize / 2, this.y + this.tablero.oneBlockSize / 2);
        this.ctx.rotate((this.direction * 90 * Math.PI) / 180);
        this.ctx.translate(-this.x - this.tablero.oneBlockSize / 2, -this.y - this.tablero.oneBlockSize / 2);
        this.ctx.drawImage(
            this.pacmanImage,
            (this.currentFrame - 1) * this.tablero.oneBlockSize,
            0,
            this.tablero.oneBlockSize,
            this.tablero.oneBlockSize,
            this.x,
            this.y,
            this.width,
            this.height
        );
        this.ctx.restore();
    }
    setNextDirection(direction: DIRECTION): void {

        this.nextDirection = direction;
    }
    getScore(): number {
        return this.score
    }
}

// Pacman.prototype.getNextPosition = function () {
//     switch (this.direction) {
//         case DIRECTION_LEFT: return { x: this.getMapX() - 1, y: this.getMapY() };
//         case DIRECTION_RIGHT: return { x: this.getMapX() + 1, y: this.getMapY() };
//         case DIRECTION_UP: return { x: this.getMapX(), y: this.getMapY() - 1 };
//         case DIRECTION_BOTTOM: return { x: this.getMapX(), y: this.getMapY() + 1 };
//         default: return { x: this.getMapX(), y: this.getMapY() };
//     }
// };
