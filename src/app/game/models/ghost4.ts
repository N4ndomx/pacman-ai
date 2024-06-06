import { TableroService } from "src/app/services/tablero.service";
import { Ghost } from "./ghost";
import { Pacman } from "./pacman";
import { GhoststepsService } from "src/app/services/ghoststeps.service";
import { DIRECTION } from "src/app/canvas/Dir.enum";

export class Ghost4 extends Ghost{

    override getCenter(tablero: TableroService): void {
        var map = tablero.map
        this.y = ((Math.floor(map.length/2))*20)
        this.x = ((Math.floor(map[0].length/2))*20)
    }


    override async preloadPathQueue(pacman: Pacman, ghostservi: GhoststepsService): Promise<void> {
        var option=1;
        while(pacman.score<30 && this.pathQueue.length < 15){
            this.pathQueue.push({x:(Math.floor(this.tablero.map.length/2)), y:(Math.floor(this.tablero.map[0].length/2))-option});
            switch(option){
                case 1:
                    option=0;
                    break;
                case 0:
                    option=-1;
                    break;
                default:
                    option=1;
            }
        }
        while (this.pathQueue.length < 3) { // Maintain a buffer of 5 positions
            const init = this.pathQueue.length > 0 ? this.pathQueue[this.pathQueue.length - 1] : { x: this.getMapX(), y: this.getMapY() };
            var pacman_x = pacman.getMapY();
            var pacman_y = pacman.getMapX();
            switch(pacman.direction){
                case DIRECTION.DIRECTION_RIGHT:
                    for(var i=0; i<2; i++){
                        if(this.tablero.map[pacman_y][pacman_x+1]!=1){
                            pacman_x+=1
                        }else{
                            break;
                        }
                    }
                    break;
                case DIRECTION.DIRECTION_UP:
                    for(var i=0; i<2; i++){
                        if(this.tablero.map[pacman_y-1][pacman_x]!=1){
                            pacman_y-=1
                        }else{
                            break;
                        }
                    }
                    break;
                case DIRECTION.DIRECTION_LEFT:
                    for(var i=0; i<2; i++){
                        if(this.tablero.map[pacman_y][pacman_x-1]!=1){
                            pacman_x-=1
                        }else{
                            break;
                        }
                    }
                    break;
                default:
                    for(var i=0; i<2; i++){
                        if(this.tablero.map[pacman_y+1][pacman_x]!=1){
                            pacman_y+=1
                        }else{
                            break;
                        }
                    }
            }
            const fin = { x: pacman_y, y: pacman_x };
            const nextPosition = await ghostservi.getNextPositionFromAPI(init, fin);
            if (nextPosition) {
                this.pathQueue.push(nextPosition);
            }
            
        }
    }
}