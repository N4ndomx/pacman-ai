import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GhoststepsService {
  map!: number[][];
  private apiUrl = 'http://localhost:8000';
  constructor(private http: HttpClient) { }

  // async getNextPositionFromAPI(init: { x: number, y: number }, fin: { x: number, y: number }): Promise<{ x: number, y: number } | null> {
  //   try {
  //     const response: any = await this.http.post(this.apiUrl + '/a-star', {
  //       mapa: this.map,
  //       inicio: init,
  //       fin: fin
  //     }).toPromise();
  //     return response;
  //   } catch (error) {
  //     console.error('Error fetching next position from API', error);
  //     return null;
  //   }
  // }

  async getNextPositionFromAPI(init: { x: number, y: number }, fin: { x: number, y: number }): Promise<{ x: number, y: number } | null> {
    const body = {
      mapa: this.map,
      inicio: [init.x, init.y],
      final: [fin.x, fin.y]
    }
    // console.log(JSON.stringify(body))
    try {
      const response: any = await this.http.post(this.apiUrl + '/a-star', body, {
        headers: {
          'Content-Type': 'application/json'
        },
      }).toPromise();
      const paso: number[] = response.camino[1]
      const err = {
        x: paso[0],
        y: paso[1]
      }
      return err;
    } catch (error) {
      console.error('Error fetching next position from API', error);
      return null;
    }
  }
}
