import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ensayo, EnsayoService } from '../../services/ensayo.service';
// import { EnsayoService } from '../services/ensayo.service';
// import { Ensayo } from '../models/ensayo.model';

@Component({
  selector: 'app-ensayo-edit-form',
  imports: [],
  template: `
    <main class="bg-gray-50 p-4 flex flex-col gap-4 min-h-lvh max-w-4xl mx-auto">
      @if (cargando()) {
      <h1 class="text-2xl font-bold">Cargando...</h1>
      <p class="text-gray-500">Por favor, espere mientras se carga el ensayo.</p>
      } @if (error() !== null) {
      <h1 class="text-2xl font-bold">Error</h1>
      <p class="text-red-500">{{ error() }}</p>
      } @if (ensayo() !== null) {
      <h1 class="text-2xl font-bold">{{ ensayo()!.nombre }}</h1>
      <section class="flex flex-col gap-4">
        <div class="flex flex-col gap-4">
          <label class="font-medium text-gray-800 text-sm" for="">Nombre ensayo</label>
          <input
            [value]="ediciones().nombre ?? ensayo()!.nombre"
            (input)="onNombreChange($any($event.target).value)"
            class="placeholder:text-gray-500 px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            type="text"
            placeholder="Ingresa el nombre del ensayo"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-800 text-sm" for="">Fórmula</label>
          <input
            [value]="ediciones().formula ?? ensayo()!.formula"
            (input)="onFormulaChange($any($event.target).value)"
            class="placeholder:text-gray-500 px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            type="text"
            placeholder="Ingresa la fórmula"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-800 text-sm" for="">Descripción</label>
          <textarea
            [value]="ediciones().descripcion ?? ensayo()!.descripcion"
            (input)="onDescripcionChange($any($event.target).value)"
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
            @if (pruebasEdicion().length === 0) {
            <p class="text-gray-500 text-center">No hay pruebas agregadas.</p>
            } @else { @for (prueba of pruebasEdicion(); track $index) {

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
                  (click)="onPruebaEliminada(prueba.codigo)"
                  class="self-start hover:bg-red-50 rounded-lg transition-colors p-2 text-red-500"
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
            [disabled]="!puedeEditar()"
            (click)="descartarCambios()"
            class="bg-gray-50 text-gray-800 px-6 py-3 font-medium rounded-lg border border-gray-300 hover:bg-gray-200 mr-4 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
          >
            Descartar cambios
          </button>
          <button
            (click)="editar()"
            [disabled]="!puedeEditar()"
            type="button"
            class="bg-green-500 text-white px-6 py-3 font-medium rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
          >
            Editar
          </button>
        </div>
      </section>
      }
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
              [value]="nuevaPrueba().descripcion"
              (input)="onPruebaDescripcionChange($any($event.target).value)"
              class="placeholder:text-gray-500 px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="text"
              placeholder="Ej: Medir resistencia..."
            />
          </div>
          <div class="flex flex-col gap-4">
            <label class="font-medium text-gray-800 text-sm" for="">Valor prueba</label>
            <input
              [value]="nuevaPrueba().valor"
              (input)="onPruebaValorChange($any($event.target).value)"
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
          <!-- onPruebaAgregada({
            descripcion: nuevaPruebaDescripcion(),
            valor: nuevaPruebaValor()!
          }), -->
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
      <h3>Ensayo editado con exito</h3>
      <p class="font-light">{{ successToastMessage() }}</p>
    </div>
    }
  `,
})
export class EnsayoEditForm {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ensayoService: EnsayoService
  ) {}

  ensayo = signal<Ensayo | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);

  ediciones = signal<{
    nombre?: string;
    descripcion?: string;
    formula?: string;
    pruebasACrear?: {
      descripcion: string;
      valor: number;
    }[];
    pruebasAEliminar?: number[];
  }>({});

  pruebasEdicion = signal<
    {
      codigo: number;
      codigoEnsayo: number;
      descripcion: string;
      valor: number;
    }[]
  >([]);

  puedeEditar = computed(() => Object.keys(this.ediciones()).length > 0);

  modalAgregarPruebaAbierto = signal(false);

  nuevaPrueba = signal<{ descripcion: string; valor: string }>({
    descripcion: '',
    valor: '',
  });

  // nuevaPruebaDescripcion = signal('');
  // nuevaPruebaValor = signal<number | null>(null);

  // puedeAgregarPrueba = computed(
  //   () => this.nuevaPruebaDescripcion().trim().length > 0 && this.nuevaPruebaValor() !== null
  // );

  puedeAgregarPrueba = computed(
    () =>
      this.nuevaPrueba().descripcion.trim().length > 0 && this.nuevaPrueba().valor.trim().length > 0
  );

  errorToastMessage = signal<string | null>(null);
  successToastMessage = signal<string | null>(null);

  onPruebaDescripcionChange(nuevaDescripcionPrueba: string) {
    this.nuevaPrueba.update((np) => ({ ...np, descripcion: nuevaDescripcionPrueba }));
  }

  onPruebaValorChange(nuevoValorPrueba: string) {
    const nuevoValorPruebaParsed = Number(nuevoValorPrueba);

    if (isNaN(nuevoValorPruebaParsed)) return;

    this.nuevaPrueba.update((np) => ({ ...np, valor: nuevoValorPrueba }));
  }

  ngOnInit() {
    const codigo = Number(this.route.snapshot.paramMap.get('codigo'));

    if (isNaN(codigo) || !codigo) {
      this.error.set('Código de ensayo inválido');
      this.cargando.set(false);
      return;
    }

    this.ensayoService.getById(codigo).subscribe({
      next: (data) => {
        this.ensayo.set(data);
        this.cargando.set(false);
        this.pruebasEdicion.set(
          data.pruebas.map((pruebasOriginales) => ({ ...pruebasOriginales }))
        );
        this.ediciones.set({});
      },
      error: (err) => {
        this.error.set(err.error.message || 'Error desconocido');
        this.cargando.set(false);
        this.ediciones.set({});
      },
    });
  }

  onNombreChange(nuevoValor: string) {
    const original = this.ensayo()!.nombre;

    // el valor editado resulto igual que el original,
    // se toma como que no se edito
    if (nuevoValor === original) {
      this.ediciones.update((e) => {
        // si el objeto esta vacio se devuelve
        if (!this.puedeEditar()) return e;
        // se saca la propiedad nombre de las ediciones
        const { nombre, ...edicionesRestantes } = e;
        return edicionesRestantes;
      });
      return;
    }

    // si hay cambios, setear en ediciones
    this.ediciones.update((e) => ({ ...e, nombre: nuevoValor }));
  }

  onFormulaChange(nuevoValor: string) {
    const original = this.ensayo()!.formula;

    if (nuevoValor === original) {
      this.ediciones.update((e) => {
        if (!this.puedeEditar()) return e;

        const { formula, ...edicionesRestantes } = e;
        return edicionesRestantes;
      });
      return;
    }

    this.ediciones.update((e) => ({ ...e, formula: nuevoValor }));
  }

  onDescripcionChange(nuevoValor: string) {
    const original = this.ensayo()!.descripcion;

    if (nuevoValor === original) {
      this.ediciones.update((e) => {
        if (!this.puedeEditar()) return e;

        const { descripcion, ...edicionesRestantes } = e;
        return edicionesRestantes;
      });
      return;
    }

    this.ediciones.update((e) => ({ ...e, descripcion: nuevoValor }));
  }

  agregarPrueba() {
    const tempId = -Math.floor(Math.random() * 1000000);

    const pruebaAAgregar = {
      descripcion: this.nuevaPrueba().descripcion,
      valor: Number(this.nuevaPrueba().valor),
    };

    this.ediciones.update((e) => ({
      ...e,
      pruebasACrear: e.pruebasACrear ? [...e.pruebasACrear, pruebaAAgregar] : [pruebaAAgregar],
    }));

    this.pruebasEdicion.update((pe) => [
      ...pe,
      {
        ...pruebaAAgregar,
        codigo: tempId,
        codigoEnsayo: this.ensayo()!.codigo,
      },
    ]);
  }

  onPruebaEliminada(codigoPrueba: number) {
    const prueba = this.pruebasEdicion().find((p) => p.codigo === codigoPrueba);
    if (!prueba) return;

    this.pruebasEdicion.update((pe) => pe.filter((p) => p.codigo !== codigoPrueba));

    if (prueba.codigo > 0) {
      // era original → marcar en pruebasAEliminar
      this.ediciones.update((e) => ({
        ...e,
        pruebasAEliminar: e.pruebasAEliminar
          ? [...e.pruebasAEliminar, codigoPrueba]
          : [codigoPrueba],
      }));
    } else {
      // era nueva (id temporal) → quitar de pruebasACrear
      this.ediciones.update((e) => ({
        ...e,
        pruebasACrear: e.pruebasACrear?.filter(
          (pc) => !(pc.descripcion === prueba.descripcion && pc.valor === prueba.valor)
        ),
      }));
    }

    this.limpiarEdicionesPruebasSiNoHayCambios();
  }

  private limpiarEdicionesPruebasSiNoHayCambios() {
    const originales = this.ensayo()!.pruebas;
    const actuales = this.pruebasEdicion();

    const iguales =
      originales.length === actuales.length &&
      actuales.every((p) =>
        originales.some(
          (o) => o.codigo === p.codigo && o.descripcion === p.descripcion && o.valor === p.valor
        )
      );

    if (iguales) {
      this.ediciones.update((e) => {
        if (!this.puedeEditar()) return e;

        const { pruebasACrear, pruebasAEliminar, ...edicionesRestantes } = e;
        return edicionesRestantes;
      });
    }
  }

  descartarCambios() {
    this.ediciones.set({});
    this.pruebasEdicion.set(this.ensayo()!.pruebas);
  }

  volver() {
    this.router.navigate(['/']);
  }

  editar() {
    if (!this.ensayo()) return;

    const codigo = this.ensayo()!.codigo;
    const payload = this.ediciones();

    if (!this.puedeEditar()) return; // no hay cambios

    this.ensayoService.update(codigo, payload).subscribe({
      next: (ensayoActualizado) => {
        this.ensayo.set(ensayoActualizado);
        this.pruebasEdicion.set(ensayoActualizado.pruebas.map((p) => ({ ...p })));
        this.ediciones.set({});
        this.successToastMessage.set('Los cambios ya han sido aplicados.');
        setTimeout(() => this.successToastMessage.set(null), 3000);
      },
      error: (err) => {
        this.errorToastMessage.set(err.error.message || 'Error desconocido');
        setTimeout(() => this.errorToastMessage.set(null), 3000);
      },
    });
  }

  abrirModalCreacionPrueba() {
    this.modalAgregarPruebaAbierto.set(true);
  }

  cerrarModalCreacionPrueba() {
    this.modalAgregarPruebaAbierto.set(false);
  }

  limpiarCamposNuevaPrueba() {
    this.nuevaPrueba.set({
      descripcion: '',
      valor: '',
    });
  }
}
