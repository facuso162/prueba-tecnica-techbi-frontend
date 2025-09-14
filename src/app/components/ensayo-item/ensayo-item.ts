import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ensayo-item',
  imports: [],
  template: `
    <li>
      <div
        class="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg hover:shadow sm:p-4"
      >
        <div>
          <h3 class="font-medium sm:text-lg">{{ nombre }}</h3>
          <p class="font-light">{{ fecha }}</p>
        </div>
        <div class="flex gap-2 self-end">
          <button
            class="bg-indigo-500 text-white px-4 py-2 font-medium rounded-lg flex items-center gap-2 hover:bg-indigo-700"
            (click)="ver.emit(codigo)"
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
              class="lucide lucide-pencil-icon lucide-pencil"
            >
              <path
                d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
              />
              <path d="m15 5 4 4" />
            </svg>
            <span class="hidden sm:inline">Ver</span>
          </button>
          <button
            class="bg-rose-500 text-white px-4 py-2 font-medium rounded-lg flex items-center gap-2 hover:bg-rose-700"
            (click)="borrar.emit(codigo)"
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
            <span class="hidden sm:inline">Borrar</span>
          </button>
        </div>
      </div>
    </li>
  `,
})
export class EnsayoItem {
  @Input() codigo!: number;
  @Input() nombre!: string;
  @Input() fecha!: string;

  @Output() ver = new EventEmitter<number>();
  @Output() borrar = new EventEmitter<number>();
}
