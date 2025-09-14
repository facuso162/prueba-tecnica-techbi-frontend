import { Component, signal, inject, OnInit } from '@angular/core';
import { EnsayoItem } from '../../components/ensayo-item/ensayo-item';
import { EnsayoService, Ensayo } from '../../services/ensayo.service';

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
    @if (toastMessage() !== null) {
    <div
      class="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow flex flex-col gap-4"
    >
      <h3 class="font-medium">Hubo un error</h3>
      <p class="font-light">{{ toastMessage() }}</p>
    </div>
    }
  </main>`,
})
export class Home {
  private ensayoService = inject(EnsayoService);

  ensayos = signal<Ensayo[]>([]); // estos deberian venir del backend
  toastMessage = signal<string | null>(null);

  ngOnInit() {
    this.ensayoService.getAll().subscribe({
      next: (data) => this.ensayos.set(data),
      error: (err) => {
        this.toastMessage.set(err.error.message || 'Error desconocido');
        setTimeout(() => this.toastMessage.set(null), 3000);
      },
    });
  }

  crearEnsayo() {
    console.log('Crear ensayo');
    // despues se cambia por this.router.navigate(['/ensayo/nuevo']);
  }

  verEnsayo(codigo: number) {
    console.log('Ver ensayo', codigo);
    // despues se cambia por this.router.navigate([`/ensayo/${codigo}`]);
  }

  borrarEnsayo(codigo: number) {
    console.log('Borrar ensayo', codigo);
    // esto deberia abrir un modal de confirmacion de borrado
  }
}
