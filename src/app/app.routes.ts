import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import FormularioSolicitudComponent from './components/formulario-solicitud/formulario-solicitud.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './shared/guards/auth.guard';
import { authLoginGuard } from './shared/guards/auth-login.guard';
import { VehiculosComponent } from './pages/vehiculos/vehiculos.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import FormularioEntregaComponent from './pages/formulario-entrega/formulario-entrega.component';

export const routes: Routes = [
	{
		path: 'home',
		loadComponent: () => HomeComponent,
		title: 'SISVEC',
		canActivate: [authGuard]
	},
	{ path: '', redirectTo: 'home', pathMatch: 'full' }, // Corregido

	{
		path: 'form-solicitud',
		loadComponent: () => FormularioSolicitudComponent,
		title: 'Nueva de Solicitud',
		canActivate: [authGuard]
	},
	{ path: 'login', loadComponent: () => LoginComponent, title: 'Login', canActivate: [authLoginGuard] },
	{ path: 'vehiculos', loadComponent: () => VehiculosComponent, title: 'Vehículos', canActivate: [authGuard] },
	{ path: 'solicitudes', loadComponent: () => SolicitudesComponent, title: 'Solicitudes', canActivate: [authGuard] },
	{
		path: 'form-entrega',
		loadComponent: () => FormularioEntregaComponent,
		title: 'Formulario de Entrega y Control de Vehículo',
		canActivate: [authGuard]
	},
	{ path: '**', redirectTo: '' }
];
