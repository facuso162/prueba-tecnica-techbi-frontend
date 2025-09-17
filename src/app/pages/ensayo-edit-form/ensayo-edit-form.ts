import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ensayo, EnsayoService } from '../../services/ensayo.service';
import { Toast } from '../../components/toast/toast';
import { PruebaItem } from '../../components/prueba-item/prueba-item';
import { PruebaAddModal } from '../../components/prueba-add-modal/prueba-add-modal';

@Component({
  selector: 'app-ensayo-edit-form',
  imports: [Toast, PruebaItem, PruebaAddModal],
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
              <app-prueba-item
                [prueba]="{
                  descripcion: prueba.descripcion,
                  valor: prueba.valor,
                  codigo: prueba.codigo
                }"
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
    ></app-toast>
  `,
})
export class EnsayoEditForm {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ensayoService = inject(EnsayoService);

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

  errorToastMessage = signal<string | null>(null);
  successToastMessage = signal<string | null>(null);

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

  agregarPrueba(prueba: { descripcion: string; valor: number }) {
    const tempId = -Math.floor(Math.random() * 1000000);

    this.ediciones.update((e) => ({
      ...e,
      pruebasACrear: e.pruebasACrear ? [...e.pruebasACrear, prueba] : [prueba],
    }));

    this.pruebasEdicion.update((pe) => [
      ...pe,
      {
        ...prueba,
        codigo: tempId,
        codigoEnsayo: this.ensayo()!.codigo,
      },
    ]);
  }

  eliminarPrueba(codigoPrueba: number) {
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
      },
      error: (err) => {
        this.errorToastMessage.set(err.error.message || 'Error desconocido');
      },
    });
  }

  abrirModalCreacionPrueba() {
    this.modalAgregarPruebaAbierto.set(true);
  }

  cerrarModalCreacionPrueba() {
    this.modalAgregarPruebaAbierto.set(false);
  }
}
