import { Ghost } from "./ghost";
import { DIRECTION } from "src/app/canvas/Dir.enum";

export class Ghost2 extends Ghost {
    override getCenter(): void {
        var map = this.tablero.map
        this.y = ((Math.floor(map.length / 2)) * this.tablero.oneBlockSize)
        this.x = ((Math.floor(map[0].length / 2) + 1) * this.tablero.oneBlockSize)
        this.pathQueue = []
    }

    override async preloadPathQueue(): Promise<void> {
        while (this.pathQueue.length < 8) { // Maintain a buffer of 5 positions
            const init = this.pathQueue.length > 0 ? this.pathQueue[this.pathQueue.length - 1] : { x: this.getMapY(), y: this.getMapX() };
            var pacman_x = this.pacman.getMapX();
            var pacman_y = this.pacman.getMapY();
            switch (this.pacman.direction) {
                case DIRECTION.DIRECTION_RIGHT:
                    if (this.tablero.map[pacman_y][pacman_x + 1] != 1) {
                        pacman_x += 1
                    }
                    //console.log("DERECHA", pacman_y, pacman_x+1)//this.tablero.map[pacman_y][pacman_x-1])
                    break;
                case DIRECTION.DIRECTION_UP:
                    if (this.tablero.map[pacman_y - 1][pacman_x] != 1) {
                        pacman_y -= 1
                    }
                    //console.log("ARRIBA", this.tablero.map[pacman_y-1][pacman_x])
                    break;
                case DIRECTION.DIRECTION_LEFT:
                    if (this.tablero.map[pacman_y][pacman_x - 1] != 1) {
                        pacman_x -= 1
                    }
                    //console.log("IZQUIERDA", this.tablero.map[pacman_y][pacman_x-1])
                    break;
                default:
                    if (this.tablero.map[pacman_y + 1][pacman_x] != 1) {
                        pacman_y += 1
                    }
                //console.log("ABAJO", this.tablero.map[pacman_y+1][pacman_x])
            }
            const fin = { x: pacman_y, y: pacman_x };
            const nextPosition = await this.ghostser.getNextPositionFromAPI(init, fin);
            if (nextPosition) {
                this.pathQueue.push(nextPosition);
            }
        }
    }
}