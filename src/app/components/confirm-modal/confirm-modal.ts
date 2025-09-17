import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
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
        <h2 class="text-xl font-bold">{{ titulo }}</h2>
        <p>{{ mensaje }}</p>

        <div class="flex items-center justify-end gap-2">
          <button
            (click)="onCancelar()"
            class="bg-gray-50 text-gray-800 px-6 py-3 font-medium rounded-lg border border-gray-300 hover:bg-gray-200 mr-4"
          >
            {{ textoCancelar }}
          </button>
          <button
            (click)="onConfirmar()"
            class="bg-red-500 text-white px-6 py-3 font-medium rounded-lg flex items-center gap-2 hover:bg-red-700"
          >
            {{ textoConfirmar }}
          </button>
        </div>
      </div>
    </div>
    }
  `,
})
export class ConfirmModal {
  @Input() abierto = false;
  @Input() titulo = 'Confirmar acción';
  @Input() mensaje = '¿Estás seguro?';
  @Input() textoCancelar = 'Cancelar';
  @Input() textoConfirmar = 'Confirmar';

  @Output() cancelar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<void>();

  onCancelar() {
    this.cancelar.emit();
  }

  onConfirmar() {
    this.confirmar.emit();
  }
}
