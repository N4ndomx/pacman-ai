import { TableroService } from "src/app/services/tablero.service";
import { Ghost } from "./ghost";
import { GhoststepsService } from "src/app/services/ghoststeps.service";
import { Pacman } from "./pacman";
import { DIRECTION } from "src/app/canvas/Dir.enum";

export class Ghost3 extends Ghost{
    override getCenter(): void {
        var map = this.tablero.map
        this.y = ((Math.floor(map.length/2)-1)*20)
        this.x = ((Math.floor(map[0].length/2)-1)*20)
        this.pathQueue=[]
    }

    override async preloadPathQueue(): Promise<void> {
        while (this.pathQueue.length < 3) { // Maintain a buffer of 5 positions
            const init = this.pathQueue.length > 0 ? this.pathQueue[this.pathQueue.length - 1] : { x: this.getMapX(), y: this.getMapY() };
            var pacman_x = this.pacman.getMapY();
            var pacman_y = this.pacman.getMapX();
            switch(this.pacman.direction){
                case DIRECTION.DIRECTION_RIGHT:
                    if(this.tablero.map[pacman_y][pacman_x+1]!=1){
                        pacman_x+=1
                    }
                    //console.log("DERECHA", pacman_y, pacman_x+1)//this.tablero.map[pacman_y][pacman_x-1])
                    break;
                case DIRECTION.DIRECTION_UP:
                    if(this.tablero.map[pacman_y-1][pacman_x]!=1){
                        pacman_y-=1
                    }
                    //console.log("ARRIBA", this.tablero.map[pacman_y-1][pacman_x])
                    break;
                case DIRECTION.DIRECTION_LEFT:
                    if(this.tablero.map[pacman_y][pacman_x-1]!=1){
                        pacman_x-=1
                    }
                    //console.log("IZQUIERDA", this.tablero.map[pacman_y][pacman_x-1])
                    break;
                default:
                    if(this.tablero.map[pacman_y+1][pacman_x]!=1){
                        pacman_y+=1
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