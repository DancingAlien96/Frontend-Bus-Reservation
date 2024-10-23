import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { OptionInterface } from '../../shared/interfaces/options.interface';
import { LoginService } from '../../shared/services/login.service';
import { AuthService } from '../../shared/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { UsuarioInterface } from '../../shared/interfaces/usuario.interface';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrl: './navigation.component.css',
	standalone: true,
	imports: [
		MatToolbarModule,
		MatButtonModule,
		MatSidenavModule,
		MatListModule,
		MatIconModule,
		AsyncPipe,
		RouterOutlet,
		RouterLink,
		UpperCasePipe
	]
})
export class NavigationComponent {
	private breakpointObserver = inject(BreakpointObserver);
	usuario!: UsuarioInterface;
	menuOption: OptionInterface[] = [];
	constructor(private authService: AuthService, private cookies: CookieService, private router: Router) {
		const usuarioSession = sessionStorage.getItem('usuario');

		if (usuarioSession != null) {
			this.usuario = JSON.parse(usuarioSession);
			const idRol = this.usuario.ROL.ID_ROL;

			this.menuOption.push({
				name: 'Inicio',
				icon: 'home',
				rute: 'home'
			});

			switch (idRol) {
				case 1:
					this.menuOption.push({
						name: 'Formulario de solicitud',
						icon: 'assignment',
						rute: 'form-solicitud'
					});

					this.menuOption.push({
						name: 'Solicitudes',
						icon: 'list',
						rute: 'solicitudes'
					});

					this.menuOption.push({
						name: 'Vehiculos',
						icon: 'directions_car',
						rute: 'vehiculos'
					});
					break;
				case 2:
					this.menuOption.push({
						name: 'Solicitudes',
						icon: 'list',
						rute: 'solicitudes'
					});

					this.menuOption.push({
						name: 'Formulario de solicitud',
						icon: 'assignment',
						rute: 'form-solicitud'
					});
					break;
				case 3:
					this.menuOption.push({
						name: 'Entregas',
						icon: 'list',
						rute: 'solicitudes'
					});

					this.menuOption.push({
						name: 'Vehiculos',
						icon: 'directions_car',
						rute: 'vehiculos'
					});
					break;
			}

			this.menuOption.push({
				name: 'Cerrar Sesion',
				icon: 'logout',
				rute: null
			});
		}
	}
	whenClick(item: any) {
		if (item == 'Cerrar Sesion') {
			this.authService.logOut();
		}
	}
	isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
		map((result) => result.matches),
		shareReplay()
	);
}
