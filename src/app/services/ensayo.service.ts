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

type ApiResponse = { success: true; data: Ensayo[] } | { success: false; message: string };

@Injectable({ providedIn: 'root' })
export class EnsayoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/ensayos';

  getAll(): Observable<Ensayo[]> {
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

  // getById() - todo

  // create() - todo

  // update() - todo

  // delete() - todo
}
