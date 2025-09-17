import { Component, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [],
  template: `@if (visible() && message) {
    <div
      class="fixed bottom-4 right-4 text-white px-4 py-2 rounded shadow flex flex-col gap-2"
      [class]="bgClass"
    >
      <h3 class="font-medium">{{ title }}</h3>
      <p class="font-light">{{ message }}</p>
    </div>
    }`,
})
export class Toast {
  @Input() type: 'success' | 'error' = 'success';
  @Input() message: string | null = null;

  @Output() closed = new EventEmitter<void>();

  visible = signal(false);

  private hideTimer: any = null;

  ngOnChanges(changes: SimpleChanges) {
    if ('message' in changes) {
      if (this.message) {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  private show() {
    // mostrar
    this.visible.set(true);

    // limpiar timer anterior si existe
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    // autohide después de 3s
    this.hideTimer = setTimeout(() => {
      this.visible.set(false);
      this.hideTimer = null;
      this.closed.emit(); // aviso al padre para que limpie su mensaje
    }, 3000);
  }

  private hide() {
    this.visible.set(false);
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  ngOnDestroy() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
  }

  get bgClass() {
    return this.type === 'success' ? 'bg-green-500' : 'bg-red-500';
  }

  get title() {
    return this.type === 'success' ? 'Operación exitosa' : 'Hubo un error';
  }
}
