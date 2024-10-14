import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLink, RouterOutlet } from '@angular/router';
import { OptionInterface } from '../../shared/interfaces/options.interface';
import { LoginService } from '../../shared/services/login.service';
import { AuthService } from '../../shared/services/auth.service';

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
		RouterLink
	]
})
export class NavigationComponent {
	private breakpointObserver = inject(BreakpointObserver);
	menuOption: OptionInterface[] = [];
	constructor(private authService: AuthService) {
		this.menuOption.push({
			idoption: 0,
			name: 'Inicio',
			icon: 'home',
			rute: 'home'
		});
		this.menuOption.push({
			idoption: 1,
			name: 'Solicitudes',
			icon: 'list',
			rute: 'solicitudes'
		});
		this.menuOption.push({
			idoption: 2,
			name: 'Formulario de solicitud',
			icon: 'assignment',
			rute: 'form-solicitud'
		});
		this.menuOption.push({
			idoption: 3,
			name: 'Vehiculos',
			icon: 'directions_car',
			rute: 'vehiculos'
		});

		this.menuOption.push({
			idoption: 4,
			name: 'Cerrar Sesion',
			icon: 'logout',
			rute: null
		});
	}
	whenClick(item: any) {
		if (item == 4) {
			this.authService.logOut();
		}
	}
	isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
		map((result) => result.matches),
		shareReplay()
	);
}
