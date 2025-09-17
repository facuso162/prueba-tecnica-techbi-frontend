import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EnsayoService } from '../../services/ensayo.service';
import { Toast } from '../../components/toast/toast';
import { PruebaItem } from '../../components/prueba-item/prueba-item';
import { PruebaAddModal } from '../../components/prueba-add-modal/prueba-add-modal';

@Component({
  selector: 'app-ensayo-form',
  imports: [Toast, PruebaItem, PruebaAddModal],
  template: `<main class="bg-gray-50 p-4 flex flex-col gap-4 min-h-lvh max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold">Crear ensayo</h1>
      <section class="flex flex-col gap-4">
        <div class="flex flex-col gap-4">
          <label class="font-medium text-gray-800 text-sm" for="">Nombre ensayo</label>
          <input
            [value]="nombre()"
            (input)="nombre.set($any($event.target).value)"
            class="placeholder:text-gray-500 px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            type="text"
            placeholder="Ingresa el nombre del ensayo"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-800 text-sm" for="">Fórmula</label>
          <input
            [value]="formula()"
            (input)="formula.set($any($event.target).value)"
            class="placeholder:text-gray-500 px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            type="text"
            placeholder="Ingresa la fórmula"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-800 text-sm" for="">Descripción</label>
          <textarea
            [value]="descripcion()"
            (input)="descripcion.set($any($event.target).value)"
            resizable="none"
            class=" placeholder:text-gray-500 px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            type="text"
            placeholder="Describe el ensayo..."
          ></textarea>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label class="font-medium text-gray-800 text-sm" for="">Pruebas</label>
            <button
              (click)="abrirModalCreacionPrueba()"
              class="bg-green-500 text-white px-6 py-3 font-medium rounded-lg flex items-center gap-2 hover:bg-green-700"
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
              <span>Agregar prueba</span>
            </button>
          </div>
          <ul class="p-2 border bg-white border-gray-300 rounded-lg min-h-32 gap-2 flex flex-col">
            @if (pruebas().length === 0) {
            <p class="text-gray-500 text-center">No hay pruebas agregadas.</p>
            } @else { @for (prueba of pruebas(); track $index) {

            <li>
              <app-prueba-item
                [prueba]="{ descripcion: prueba.descripcion, valor: prueba.valor, codigo: $index }"
                (borrar)="eliminarPrueba($event)"
              ></app-prueba-item>
            </li>
            } }
          </ul>
        </div>
        <div class="flex items-center justify-end gap-2">
          <button
            (click)="volver()"
            class="bg-gray-50 text-gray-800 px-6 py-3 font-medium rounded-lg border border-gray-300 hover:bg-gray-200 mr-4"
          >
            Volver
          </button>
          <button
            type="button"
            (click)="crear()"
            [disabled]="!puedeCrearEnsayo()"
            class="bg-green-500 text-white px-6 py-3 font-medium rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
          >
            Crear
          </button>
        </div>
      </section>
    </main>
    <app-prueba-add-modal
      [abierto]="modalAgregarPruebaAbierto()"
      (cerrar)="cerrarModalCreacionPrueba()"
      (agregar)="[agregarPrueba($event), cerrarModalCreacionPrueba()]"
    ></app-prueba-add-modal>
    <app-toast
      [type]="'error'"
      [message]="errorToastMessage()"
      (closed)="errorToastMessage.set(null)"
    ></app-toast>
    <app-toast
      [type]="'success'"
      [message]="successToastMessage()"
      (closed)="successToastMessage.set(null)"
    ></app-toast> `,
})
export class EnsayoForm {
  constructor(private router: Router, private ensayoService: EnsayoService) {}

  nombre = signal('');
  formula = signal('');
  descripcion = signal('');
  pruebas = signal<{ descripcion: string; valor: number }[]>([]);

  errorToastMessage = signal<string | null>(null);
  successToastMessage = signal<string | null>(null);

  modalAgregarPruebaAbierto = signal(false);

  puedeCrearEnsayo = computed(
    () =>
      this.nombre().trim().length > 0 &&
      this.formula().trim().length > 0 &&
      this.descripcion().trim().length > 0
  );

  abrirModalCreacionPrueba() {
    this.modalAgregarPruebaAbierto.set(true);
  }

  cerrarModalCreacionPrueba() {
    this.modalAgregarPruebaAbierto.set(false);
  }

  agregarPrueba(prueba: { descripcion: string; valor: number }) {
    this.pruebas.update((pruebas) => [...pruebas, prueba]);
  }

  eliminarPrueba(i: number) {
    this.pruebas.update((pruebas) => pruebas.filter((_, index) => index !== i));
  }

  volver() {
    this.router.navigate(['/']);
  }

  crear() {
    const nuevoEnsayo = {
      nombre: this.nombre(),
      formula: this.formula(),
      descripcion: this.descripcion(),
      pruebas: this.pruebas(),
    };

    this.ensayoService.create(nuevoEnsayo).subscribe({
      next: () => {
        this.successToastMessage.set('Ensayo creado con exito');
        this.limpiarFormulario();
      },
      error: (err) => {
        this.errorToastMessage.set(err.error.message || 'Error desconocido');
      },
    });
  }

  limpiarFormulario() {
    this.nombre.set('');
    this.formula.set('');
    this.descripcion.set('');
    this.pruebas.set([]);
  }
}
