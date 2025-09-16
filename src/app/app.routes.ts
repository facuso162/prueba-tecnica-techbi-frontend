import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { EnsayoForm } from './pages/ensayo-form/ensayo-form';
import { EnsayoEditForm } from './pages/ensayo-edit-form/ensayo-edit-form';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'ensayo/nuevo', component: EnsayoForm },
  { path: 'ensayo/:codigo', component: EnsayoEditForm },
];
