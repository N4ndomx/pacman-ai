import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Ball } from '../game/models/bal';
import { Pacman } from '../game/models/pacman';
import { TableroService } from '../services/tablero.service';
import { DIRECTION } from './Dir.enum';
import { findValidGhostPosition, Ghost } from '../game/models/ghost';
import { GhoststepsService } from '../services/ghoststeps.service';
import { ghostImageLocations } from './Ghost.tails';
import { Ghost2 } from '../game/models/ghost2';
import { Ghost3 } from '../game/models/ghost3';
import { Ghost4 } from '../game/models/ghost4';
import { timer } from 'rxjs';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {

  @ViewChild('canvasElement', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pacmanElement ', { static: false })
  pacmanimg!: HTMLElement;
  ball!: Ball
  private ctx!: CanvasRenderingContext2D;
  pacman!: Pacman
  ghost!: Ghost
  ghost2!: Ghost
  ghost3!: Ghost
  ghost4!: Ghost
  scoreReady: boolean = false;
  lives: number = 3;
  scoreTemp=0;
  fps: number = 10;
  interval:any;

  constructor(
    // private ballService: BallServiceService,
    private tableroService: TableroService,
    private ghostservi: GhoststepsService) {
    this.setupEventListeners()
  }

  async ngAfterViewInit() {

    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.ctx.fillStyle = this.tableroService.wallInnerColor
    await this.tableroService.getMapAPI()


    // this.pacman = new Pacman(0, 0, 20, 20, 2, this.canvas.nativeElement, this.tableroService, this.ctx);
    this.pacman = new Pacman(
      this.tableroService.oneBlockSize,
      this.tableroService.oneBlockSize,
      this.tableroService.oneBlockSize,
      this.tableroService.oneBlockSize,
      this.tableroService.oneBlockSize / 3,
      this.canvas.nativeElement,
      this.tableroService,
      this.ctx,
    );
    this.scoreReady = true
    
    this.ghost = new Ghost(
      //pos.x ?? 0,
      //pos.y ?? 0,
      ghostImageLocations[0].x,
      ghostImageLocations[0].y,
      this.tableroService.oneBlockSize,
      this.tableroService.oneBlockSize,
      this.canvas.nativeElement,
      this.tableroService, this.ctx,
      this.pacman, this.ghostservi
    )

    this.ghost2 = new Ghost2(
      // pos.x ?? 0,
      // pos.y ?? 0,
      ghostImageLocations[1].x,
      ghostImageLocations[1].y,
      this.tableroService.oneBlockSize,
      this.tableroService.oneBlockSize,
      this.canvas.nativeElement,
      this.tableroService, this.ctx,
      this.pacman, this.ghostservi
    )


    this.ghost3 = new Ghost3(
      // pos.x ?? 0,
      // pos.y ?? 0,
      ghostImageLocations[2].x,
      ghostImageLocations[2].y,
      this.tableroService.oneBlockSize,
      this.tableroService.oneBlockSize,
      this.canvas.nativeElement,
      this.tableroService, this.ctx,
      this.pacman, this.ghostservi
    )

    this.ghost4 = new Ghost4(
      // pos.x ?? 0,
      // pos.y ?? 0,
      ghostImageLocations[3].x,
      ghostImageLocations[3].y,
      this.tableroService.oneBlockSize,
      this.tableroService.oneBlockSize,
      this.canvas.nativeElement,
      this.tableroService, this.ctx,
      this.pacman, this.ghostservi
    )
    this.scoreTemp+=this.tableroService.bolitas_ganar();
    this.pacman.setGhosts([this.ghost, this.ghost2, this.ghost3, this.ghost4]);
    this.startInterval();
  }

  startInterval(){
    this.interval=setInterval(async() => await this.updateAndDraw(), 1000 / this.fps);
  }

  stopInterval(){
    clearInterval(this.interval);
  }





  async updateAndDraw() {
    // try {
    //   // Enviar la posición actual de la pelota a la API
    //   const response = await this.ballService.updateBallPosition({
    //     x: this.ball.x,
    //     y: this.ball.y
    //   }).toPromise();

    //   // Actualizar la posición de la pelota con la respuesta de la API
    //   this.ball.x = response!.x;
    //   this.ball.y = response!.y;

    //   // Limpia el canvas
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // Dibujar el tablero
    this.drawTablero();
    //   // Dibujar la pelota en la nueva posición
    //   this.ball.draw();
    // } catch (error) {
    //   console.error('Error updating ball position:', error);
    // }


    // Actualiza la posición y dibuja la pelota
    // this.ball.procesoMover(this.ballService, this.canvas);
    // this.ball.update(this.canvas.nativeElement)
    this.pacman.moveProcess()
    let collision=this.pacman.checkGhostCollision()
    if(collision){
      this.stopInterval()
      this.lives-=1
      if (this.lives>0){
        this.pacman.lossUp()
        this.startInterval()
      }else{
        window.alert('Haz perdido!!');
      }
    }
    this.pacman.eat(this.tableroService.map)
    timer(2000).subscribe(async ()=>{
      if(this.pacman.getScore()==this.scoreTemp){
        this.stopInterval()
        await this.tableroService.getMapAPI()
        this.pacman.lossUp()
        this.scoreTemp+=this.tableroService.bolitas_ganar();
        this.startInterval()
      }
    })
    this.pacman.draw()
    this.ghost.moveProcess()
    this.ghost.draw()

    this.ghost2.moveProcess()
    this.ghost2.draw()
    this.ghost3.moveProcess()
    this.ghost3.draw()
    this.ghost4.moveProcess()
    this.ghost4.draw()

  }



  private drawTablero(): void {
    const blockSize = this.tableroService.oneBlockSize;
    const map = this.tableroService.map;

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        const x = j * blockSize;
        const y = i * blockSize;

        // Dibujar paredes
        if (map[i][j] === 1) {
          this.ctx.fillStyle = 'blue';
          this.ctx.fillRect(x, y, blockSize, blockSize);
        }
        // Dibujar puntos
        else if (map[i][j] === 2) {
          this.ctx.fillStyle = 'yellow';
          this.ctx.beginPath();
          this.ctx.arc(x + blockSize / 2, y + blockSize / 2, blockSize / 4, 0, Math.PI * 2);
          this.ctx.fill();
        }
        // Dibujar superpuntos (si es necesario)
        // else if (map[i][j] === 3) {
        //   this.ctx.fillStyle = 'white';
        //   this.ctx.beginPath();
        //   this.ctx.arc(x + blockSize / 2, y + blockSize / 2, blockSize / 3, 0, Math.PI * 2);
        //   this.ctx.fill();
        // }
      }
    }
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', (event) => {
      this.handleKeyDown(event);
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'w':
        this.pacman.setNextDirection(DIRECTION.DIRECTION_UP);
        break;
      case 'a':
        this.pacman.setNextDirection(DIRECTION.DIRECTION_LEFT);
        break;
      case 's':
        this.pacman.setNextDirection(DIRECTION.DIRECTION_BOTTOM);
        break;
      case 'd':
        this.pacman.setNextDirection(DIRECTION.DIRECTION_RIGHT);
        break;
    }
  }

  reinicio() {
    location.reload();
  }

}



