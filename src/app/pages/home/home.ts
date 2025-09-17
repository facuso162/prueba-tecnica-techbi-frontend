import { Component, signal, inject } from '@angular/core';
import { EnsayoItem } from '../../components/ensayo-item/ensayo-item';
import { EnsayoService, Ensayo } from '../../services/ensayo.service';
import { Router } from '@angular/router';
import { Toast } from '../../components/toast/toast';
import { ConfirmModal } from '../../components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-home',
  imports: [EnsayoItem, Toast, ConfirmModal],
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
    <app-confirm-modal
      [abierto]="ensayoAEliminar() !== null"
      [titulo]="'Confirmar eliminación'"
      [mensaje]="'¿Estás seguro de que deseas borrar el ensayo ' + ensayoAEliminar()?.nombre + '?'"
      [textoCancelar]="'Cancelar'"
      [textoConfirmar]="'Borrar ensayo'"
      (cancelar)="cancelarBorrado()"
      (confirmar)="confirmarBorrado()"
    ></app-confirm-modal>
  </main>`,
})
export class Home {
  private ensayoService = inject(EnsayoService);
  private router = inject(Router);

  ensayos = signal<Ensayo[]>([]);
  errorToastMessage = signal<string | null>(null);
  successToastMessage = signal<string | null>(null);

  ensayoAEliminar = signal<Ensayo | null>(null);

  ngOnInit() {
    this.ensayoService.getAll().subscribe({
      next: (data) => this.ensayos.set(data),
      error: (err) => {
        this.errorToastMessage.set(err.error.message || 'Error desconocido');
      },
    });
  }

  crearEnsayo() {
    this.router.navigate(['/ensayo/nuevo']);
  }

  verEnsayo(codigo: number) {
    this.router.navigate([`/ensayo/${codigo}`]);
  }

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
      },
      error: (err) => {
        this.ensayoAEliminar.set(null);
        this.errorToastMessage.set(err.error.message || 'Error desconocido');
      },
    });
  }

  cancelarBorrado() {
    this.ensayoAEliminar.set(null);
  }
}
