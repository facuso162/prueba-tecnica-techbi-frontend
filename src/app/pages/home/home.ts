import { Component, signal, inject, OnInit } from '@angular/core';
import { EnsayoItem } from '../../components/ensayo-item/ensayo-item';
import { EnsayoService, Ensayo } from '../../services/ensayo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [EnsayoItem],
  template: ` <main class="bg-gray-50 p-4 flex flex-col gap-4 min-h-lvh max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold">Gestión de ensayos</h1>
    <div>
      <button
        class="bg-green-500 text-white px-6 py-3 font-medium rounded-lg flex items-center gap-2 hover:bg-green-700"
        (click)="crearEnsayo()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-plus-icon lucide-plus"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        <span>Crear</span>
      </button>
    </div>
    <ul class="flex flex-col gap-2">
      @if (ensayos().length === 0) {
      <p class="text-gray-500">
        No hay ensayos disponibles. Cree uno haciendo click en el boton verde "+ Crear"
      </p>
      } @else { @for (ensayo of ensayos(); track ensayo.codigo) {
      <app-ensayo-item
        [codigo]="ensayo.codigo"
        [nombre]="ensayo.nombre"
        [fecha]="ensayo.fechaCreacion"
        (ver)="verEnsayo($event)"
        (borrar)="borrarEnsayo($event)"
      ></app-ensayo-item>
      } }
    </ul>
    @if (errorToastMessage() !== null) {
    <div
      class="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow flex flex-col gap-4"
    >
      <h3 class="font-medium">Hubo un error</h3>
      <p class="font-light">{{ errorToastMessage() }}</p>
    </div>
    } @if (successToastMessage() !== null) {
    <div
      class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow flex flex-col gap-4"
    >
      <h3 class="font-medium">Operación exitosa</h3>
      <p class="font-light">{{ successToastMessage() }}</p>
    </div>
    } @if (ensayoAEliminar() !== null) {
    <div
      (click)="cancelarBorrado()"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        (click)="$event.stopPropagation()"
        class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 flex flex-col gap-6"
      >
        <h2 class="text-xl font-bold">Confirmar eliminacion</h2>
        <p>
          ¿Estás seguro de que deseas borrar el ensayo
          <span class="font-semibold">{{ ensayoAEliminar()?.nombre }}</span
          >?
        </p>
        <!-- Botones -->
        <div class="flex items-center justify-end gap-2">
          <button
            (click)="cancelarBorrado()"
            class="bg-gray-50 text-gray-800 px-6 py-3 font-medium rounded-lg border border-gray-300 hover:bg-gray-200 mr-4"
          >
            Cancelar
          </button>
          <button
            (click)="confirmarBorrado()"
            class="bg-red-500 text-white px-6 py-3 font-medium rounded-lg flex items-center gap-2 hover:bg-red-700 "
          >
            Borrar ensayo
          </button>
        </div>
      </div>
    </div>
    }
  </main>`,
})
export class Home {
  private ensayoService = inject(EnsayoService);
  private router = inject(Router);

  ensayos = signal<Ensayo[]>([]);
  errorToastMessage = signal<string | null>(null);
  successToastMessage = signal<string | null>(null);

  ngOnInit() {
    this.ensayoService.getAll().subscribe({
      next: (data) => this.ensayos.set(data),
      error: (err) => {
        this.errorToastMessage.set(err.error.message || 'Error desconocido');
        setTimeout(() => this.errorToastMessage.set(null), 3000);
      },
    });
  }

  crearEnsayo() {
    this.router.navigate(['/ensayo/nuevo']);
  }

  verEnsayo(codigo: number) {
    this.router.navigate([`/ensayo/${codigo}`]);
  }

  ensayoAEliminar = signal<Ensayo | null>(null);

  borrarEnsayo(codigo: number) {
    const ensayo = this.ensayos().find((e) => e.codigo === codigo);

    if (!ensayo) return;

    this.ensayoAEliminar.set(ensayo);
  }

  confirmarBorrado() {
    const ensayo = this.ensayoAEliminar();

    if (!ensayo) return;

    this.ensayoService.delete(ensayo.codigo).subscribe({
      next: () => {
        this.ensayos.update((ensayos) => ensayos.filter((e) => e.codigo !== ensayo.codigo));
        this.ensayoAEliminar.set(null);
        this.successToastMessage.set('El ensayo fue eliminado correctamente');
        setTimeout(() => this.successToastMessage.set(null), 3000);
      },
      error: (err) => {
        this.ensayoAEliminar.set(null);
        this.errorToastMessage.set(err.error.message || 'Error desconocido');
        setTimeout(() => this.errorToastMessage.set(null), 3000);
      },
    });
  }

  cancelarBorrado() {
    this.ensayoAEliminar.set(null);
  }
}
