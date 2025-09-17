import { Component, Input, Output, EventEmitter } from '@angular/core';

export type PruebaItemData = {
  descripcion: string;
  valor: number;
  codigo: number;
};

@Component({
  selector: 'app-prueba-item',
  imports: [],
  template: `
    <div class="bg-gray-50 p-4 rounded-lg flex gap-2 justify-between items-center">
      <div class="flex flex-col gap-2">
        <p class="flex flex-col gap-1">
          <span class="text-gray-600">Descripción:</span>
          <span class="font-medium">{{ prueba.descripcion }}</span>
        </p>
        <p class="flex flex-col gap-1">
          <span class="text-gray-600">Valor:</span>
          <span class="font-medium">{{ prueba.valor }}</span>
        </p>
      </div>

      <button
        class="self-start hover:bg-red-50 rounded-lg transition-colors p-2 text-red-500"
        (click)="onBorrar($event)"
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
  `,
})
export class PruebaItem {
  @Input() prueba!: PruebaItemData;

  @Output() borrar = new EventEmitter<number>();

  onBorrar(event: MouseEvent) {
    event.stopPropagation(); // evita que el click burbujee hacia padres
    this.borrar.emit(this.prueba.codigo);
  }
}
