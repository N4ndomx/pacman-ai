import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BallServiceService {

  private apiUrl = 'http://localhost:8080/updatePosition'; // URL de la API

  constructor(private http: HttpClient) { }

  updateBallPosition(position: { x: number, y: number }): Observable<{ x: number, y: number }> {
    return this.http.post<{ x: number, y: number }>(this.apiUrl, position);
  }
}
