import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';

export interface Prueba {
  descripcion: string;
  valor: string;
}

@Component({
  selector: 'app-prueba-add-modal',
  imports: [],
  template: `
    @if (abierto) {
    <div
      (click)="onCancelar()"
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
              [value]="prueba().descripcion"
              (input)="onDescripcionChange($any($event.target).value)"
              class="placeholder:text-gray-500 px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="text"
              placeholder="Ej: Medir resistencia..."
            />
          </div>
          <div class="flex flex-col gap-4">
            <label class="font-medium text-gray-800 text-sm" for="">Valor prueba</label>
            <input
              [value]="prueba().valor"
              (input)="onValorChange($any($event.target).value)"
              class="placeholder:text-gray-500 px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="number"
              placeholder="Ej: 42"
            />
          </div>
        </div>
        <!-- Botones -->
        <div class="flex items-center justify-end gap-2">
          <button
            (click)="onCancelar()"
            class="bg-gray-50 text-gray-800 px-6 py-3 font-medium rounded-lg border border-gray-300 hover:bg-gray-200 mr-4"
          >
            Cancelar
          </button>
          <button
            [disabled]="!puedeAgregarPrueba()"
            (click)="onConfirmar()"
            class="bg-green-500 text-white px-6 py-3 font-medium rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
          >
            Agregar prueba
          </button>
        </div>
      </div>
    </div>
    }
  `,
})
export class PruebaAddModal {
  @Input() abierto = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() agregar = new EventEmitter<{ descripcion: string; valor: number }>();

  prueba = signal<Prueba>({ descripcion: '', valor: '' });

  puedeAgregarPrueba = computed(
    () => this.prueba().descripcion.trim().length > 0 && this.prueba().valor.trim().length > 0
  );

  onDescripcionChange(nuevaDescripcion: string) {
    this.prueba.update((p) => ({ ...p, descripcion: nuevaDescripcion }));
  }

  onValorChange(nuevoValor: string) {
    const valorParsed = Number(nuevoValor);

    if (isNaN(valorParsed)) return;

    this.prueba.update((p) => ({ ...p, valor: nuevoValor }));
  }

  onCancelar() {
    this.resetear();
    this.cerrar.emit();
  }

  onConfirmar() {
    const pruebaParsed = {
      descripcion: this.prueba().descripcion.trim(),
      valor: Number(this.prueba().valor!),
    };

    if (this.puedeAgregarPrueba()) {
      this.agregar.emit(pruebaParsed);
      this.resetear();
    }
  }

  private resetear() {
    this.prueba.set({
      descripcion: '',
      valor: '',
    });
  }
}
