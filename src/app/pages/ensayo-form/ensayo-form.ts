import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EnsayoService } from '../../services/ensayo.service';

@Component({
  selector: 'app-ensayo-form',
  imports: [],
  template: `<main class="bg-gray-50 p-4 flex flex-col gap-4 min-h-lvh max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold">Crear ensayo</h1>
      <form class="flex flex-col gap-4">
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
              <div class="bg-gray-50 p-4 rounded-lg flex gap-2 justify-between items-center">
                <div class="flex flex-col gap-2">
                  <p class="flex flex-col gap-1">
                    <span class="text-gray-600">Descripcion:</span>
                    <span class="font-medium">{{ prueba.descripcion }}</span>
                  </p>
                  <p class="flex flex-col gap-1">
                    <span class="text-gray-600">Valor:</span>
                    <span class="font-medium">{{ prueba.valor }}</span>
                  </p>
                </div>

                <button
                  class="self-start hover:bg-red-50 rounded-lg transition-colors p-2 text-red-500"
                  (click)="eliminarPrueba($index)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-trash2-icon lucide-trash-2"
                  >
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
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
      </form>
    </main>
    @if (modalAgregarPruebaAbierto()) {
    <div
      (click)="[limpiarCamposNuevaPrueba(), cerrarModalCreacionPrueba()]"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        (click)="$event.stopPropagation()"
        class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 flex flex-col gap-6"
      >
        <h2 class="text-xl font-bold">Agregar prueba</h2>
        <!-- Formulario modal -->
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-4">
            <label class="font-medium text-gray-800 text-sm" for="">Descripción</label>
            <input
              [value]="nuevaPruebaDescripcion()"
              (input)="nuevaPruebaDescripcion.set($any($event.target).value)"
              class="placeholder:text-gray-500 px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="text"
              placeholder="Ej: Medir resistencia..."
            />
          </div>
          <div class="flex flex-col gap-4">
            <label class="font-medium text-gray-800 text-sm" for="">Valor prueba</label>
            <input
              [value]="nuevaPruebaValor()"
              (input)="nuevaPruebaValor.set($any($event.target).value)"
              class="placeholder:text-gray-500 px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="number"
              placeholder="Ej: 42"
            />
          </div>
        </div>
        <!-- Botones -->
        <div class="flex items-center justify-end gap-2">
          <button
            (click)="[limpiarCamposNuevaPrueba(), cerrarModalCreacionPrueba()]"
            class="bg-gray-50 text-gray-800 px-6 py-3 font-medium rounded-lg border border-gray-300 hover:bg-gray-200 mr-4"
          >
            Cancelar
          </button>
          <button
            [disabled]="!puedeAgregarPrueba()"
            (click)="[agregarPrueba(), limpiarCamposNuevaPrueba(), cerrarModalCreacionPrueba()]"
            class="bg-green-500 text-white px-6 py-3 font-medium rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
          >
            Agregar prueba
          </button>
        </div>
      </div>
    </div>
    } @if (errorToastMessage() !== null) {
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
      <h3>Ensayo creado con exito</h3>
      <p class="font-light">{{ successToastMessage() }}</p>
    </div>
    }`,
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

  abrirModalCreacionPrueba() {
    this.modalAgregarPruebaAbierto.set(true);
  }

  cerrarModalCreacionPrueba() {
    this.modalAgregarPruebaAbierto.set(false);
  }

  nuevaPruebaDescripcion = signal('');
  nuevaPruebaValor = signal<number | null>(null);

  limpiarCamposNuevaPrueba() {
    this.nuevaPruebaDescripcion.set('');
    this.nuevaPruebaValor.set(null);
  }

  puedeAgregarPrueba = computed(
    () => this.nuevaPruebaDescripcion().trim().length > 0 && this.nuevaPruebaValor() !== null
  );

  agregarPrueba() {
    this.pruebas.update((pruebas) => [
      ...pruebas,
      { descripcion: this.nuevaPruebaDescripcion(), valor: this.nuevaPruebaValor()! },
    ]);
  }

  eliminarPrueba(i: number) {
    this.pruebas.update((pruebas) => pruebas.filter((_, index) => index !== i));
  }

  volver() {
    this.router.navigate(['/']);
  }

  puedeCrearEnsayo = computed(
    () =>
      this.nombre().trim().length > 0 &&
      this.formula().trim().length > 0 &&
      this.descripcion().trim().length > 0
  );

  crear() {
    const nuevoEnsayo = {
      nombre: this.nombre(),
      formula: this.formula(),
      descripcion: this.descripcion(),
      pruebas: this.pruebas(),
    };

    this.ensayoService.create(nuevoEnsayo).subscribe({
      next: () => {
        this.successToastMessage.set(
          'Toque el boton volver para regresar al inicio y ver el ensayo.'
        );
        setTimeout(() => this.successToastMessage.set(null), 3000);
        this.limpiarFormulario();
      },
      error: (err) => {
        this.errorToastMessage.set(err.error.message || 'Error desconocido');
        setTimeout(() => this.errorToastMessage.set(null), 3000);
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
