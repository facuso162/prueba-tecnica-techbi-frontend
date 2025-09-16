import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export type Ensayo = {
  codigo: number;
  nombre: string;
  descripcion: string;
  formula: string;
  fechaCreacion: string;
  pruebas: {
    descripcion: string;
    codigo: number;
    valor: number;
    codigoEnsayo: number;
  }[];
};

type ApiResponse = { success: true; data: any } | { success: false; message: string };

@Injectable({ providedIn: 'root' })
export class EnsayoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/ensayos';

  getAll(): Observable<Ensayo[]> {
    // Aca data es un array de ensayos
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      map((res) => {
        if ('success' in res) {
          if (res.success) {
            return res.data;
          }
          throw new Error(res.message);
        }
        throw new Error('Error desconocido');
      })
    );
  }

  getById(codigo: number): Observable<Ensayo> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${codigo}`).pipe(
      map((res) => {
        if ('success' in res) {
          if (res.success) {
            return res.data;
          }
          throw new Error(res.message);
        }
        throw new Error('Error desconocido');
      })
    );
  }

  create(nuevoEnsayo: {
    nombre: string;
    descripcion: string;
    formula: string;
    pruebas: { descripcion: string; valor: number }[];
  }): Observable<Ensayo> {
    // Aca data es un objeto con la estructura del nuevo ensayo
    return this.http.post<ApiResponse>(this.apiUrl, nuevoEnsayo).pipe(
      map((res) => {
        if ('success' in res) {
          if (res.success) {
            return res.data;
          }
          throw new Error(res.message);
        }
        throw new Error('Error desconocido');
      })
    );
  }

  delete(codigo: number): Observable<void> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${codigo}`).pipe(
      map((res) => {
        if ('success' in res) {
          if (res.success) {
            return;
          }
          throw new Error(res.message);
        }
        throw new Error('Error desconocido');
      })
    );
  }

  update(
    codigo: number,
    data: {
      nombre?: string;
      descripcion?: string;
      formula?: string;
      pruebasACrear?: { descripcion: string; valor: number }[];
      pruebasAEliminar?: number[];
    }
  ): Observable<Ensayo> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${codigo}`, data).pipe(
      map((res) => {
        if ('success' in res) {
          if (res.success) {
            return res.data;
          }
          throw new Error(res.message);
        }
        throw new Error('Error desconocido');
      })
    );
  }
}
