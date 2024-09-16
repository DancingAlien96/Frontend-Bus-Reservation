import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import FormularioSolicitudComponent from './components/formulario-solicitud/formulario-solicitud.component';

export const routes: Routes = [
	{ path: '', loadComponent: () => HomeComponent, title: 'Home' },
	{ path: '', redirectTo: '', pathMatch: 'full' },
	{ path: 'form-solicitud', loadComponent: () => FormularioSolicitudComponent, title: 'Nueva de Solicitud' }
];
