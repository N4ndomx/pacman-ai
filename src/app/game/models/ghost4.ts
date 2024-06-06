import { Ghost } from "./ghost";
import { DIRECTION } from "src/app/canvas/Dir.enum";

export class Ghost4 extends Ghost {

    override getCenter(): void {
        var map = this.tablero.map
        this.y = ((Math.floor(map.length / 2)+1) * this.tablero.oneBlockSize)
        this.x = ((Math.floor(map[0].length / 2)) * this.tablero.oneBlockSize)
        this.pathQueue = []
    }


    override async preloadPathQueue(): Promise<void> {
        var option = 1;
        while (this.pacman.score < 30 && this.pathQueue.length < 15) {
            this.pathQueue.push({ x: (Math.floor(this.tablero.map.length / 2)), y: (Math.floor(this.tablero.map[0].length / 2)) - option });
            switch (option) {
                case 1:
                    option = 0;
                    break;
                case 0:
                    option = -1;
                    break;
                default:
                    option = 1;
            }
        }
        while (this.pathQueue.length < 3) { // Maintain a buffer of 5 positions
            const init = this.pathQueue.length > 0 ? this.pathQueue[this.pathQueue.length - 1] : { x: this.getMapY(), y: this.getMapX() };
            var pacman_x = this.pacman.getMapX();
            var pacman_y = this.pacman.getMapY();
            switch (this.pacman.direction) {
                case DIRECTION.DIRECTION_RIGHT:
                    for (var i = 0; i < 2; i++) {
                        if (this.tablero.map[pacman_y][pacman_x + 1] != 1) {
                            pacman_x += 1
                        } else {
                            break;
                        }
                    }
                    break;
                case DIRECTION.DIRECTION_UP:
                    for (var i = 0; i < 2; i++) {
                        if (this.tablero.map[pacman_y - 1][pacman_x] != 1) {
                            pacman_y -= 1
                        } else {
                            break;
                        }
                    }
                    break;
                case DIRECTION.DIRECTION_LEFT:
                    for (var i = 0; i < 2; i++) {
                        if (this.tablero.map[pacman_y][pacman_x - 1] != 1) {
                            pacman_x -= 1
                        } else {
                            break;
                        }
                    }
                    break;
                default:
                    for (var i = 0; i < 2; i++) {
                        if (this.tablero.map[pacman_y + 1][pacman_x] != 1) {
                            pacman_y += 1
                        } else {
                            break;
                        }
                    }
            }
            const fin = { x: pacman_y, y: pacman_x };
            const nextPosition = await this.ghostser.getNextPositionFromAPI(init, fin);
            if (nextPosition) {
                this.pathQueue.push(nextPosition);
            }

        }
    }
}