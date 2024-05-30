import { ElementRef } from "@angular/core";
import { BallServiceService } from "../services/ball-service.service";

// Clase para la pelota
export class Ball {
    x: number;
    y: number;
    radius: number;
    color: string;
    dx: number;
    dy: number;
    ctx: CanvasRenderingContext2D

    constructor(x: number, y: number, radius: number, color: string, dx: number, dy: number, ctx: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = dx; // Velocidad en el eje x
        this.dy = dy; // Velocidad en el eje y
        this.ctx = ctx
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }

    update(canvas: HTMLCanvasElement) {
        // Verifica colisión con los bordes del canvas
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Actualiza la posición de la pelota
        this.x += this.dx;
        this.y += this.dy;

        // Dibuja la pelota en la nueva posición
        this.draw();
    }
    async procesoMover(ballService: BallServiceService, canvas: ElementRef<HTMLCanvasElement>) {
        try {
            // Enviar la posición actual de la pelota a la API
            const response = await ballService.updateBallPosition({
                x: this.x,
                y: this.y
            }).toPromise();

            // Actualizar la posición de la pelota con la respuesta de la API
            this.x = response!.x;
            this.y = response!.y;

            // Limpia el canvas
            this.ctx.clearRect(0, 0, canvas.nativeElement.width, canvas.nativeElement.height);

            // Dibujar la pelota en la nueva posición
            this.draw();
        } catch (error) {
            console.error('Error updating ball position:', error);
        }
    }
}

