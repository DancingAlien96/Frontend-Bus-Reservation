import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import FormularioSolicitudComponent from './components/formulario-solicitud/formulario-solicitud.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './shared/guards/auth.guard';
import { authLoginGuard } from './shared/guards/auth-login.guard';


export const routes: Routes = [
	{ path: '', loadComponent: () => HomeComponent, title: 'Home', canActivate:[authGuard]},
	{ path: '', redirectTo: '', pathMatch: 'full' },
	{ path: 'form-solicitud', loadComponent: () => FormularioSolicitudComponent, title: 'Nueva de Solicitud' , canActivate:[authGuard]},
	{ path: 'login', loadComponent: () => LoginComponent, title: 'Login', canActivate:[authLoginGuard]  }
	
];
