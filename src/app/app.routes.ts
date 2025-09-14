import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { EnsayoForm } from './pages/ensayo-form/ensayo-form';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'ensayo/nuevo', component: EnsayoForm },
];
