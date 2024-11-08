import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { PaginatorService } from '../../shared/services/paginator.service';
import { MatTabsModule } from '@angular/material/tabs';
import { DateFormatPipe } from '../../shared/pipes/date-time-format.pipe';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { UsuarioInterface } from '../../shared/interfaces/usuario.interface';
import { UsuariosService } from '../../shared/services/usuarios.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioActivoPipe } from '../../shared/pipes/user.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PopupUsuarioComponent } from '../popup-usuario/popup-usuario.component';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
	providers: [
		{ provide: MatPaginatorIntl, useClass: PaginatorService } // Proveedor personalizado
	],
	selector: 'app-usuarios-table',
	styleUrl: './usuarios-table.component.css',
	templateUrl: './usuarios-table.component.html',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatTabsModule,
		DateFormatPipe,
		MatCardModule,
		CommonModule,
		MatDividerModule,
		MatIconModule,
		MatButtonModule,
		UsuarioActivoPipe,
		MatTooltipModule,
		RouterLink
	]
})
export class UsuariosTableComponent implements AfterViewInit {
	savedstate: string | null = null;
	idUsuario!: number;
	rol!: number;
	tabIndex = 0;
	displayedColumns: string[] = ['ID_USUARIO', 'USERNAME', 'NOMBRE_COMPLETO', 'CORREO', 'ROL', 'ESTADO'];
	dataSource!: MatTableDataSource<UsuarioInterface>;

	private updateSubscription!: Subscription;

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(private usuariosService: UsuariosService, private dialog: MatDialog, private cdr: ChangeDetectorRef) {}

	ngAfterViewInit() {
		this.getAllUsers();
		this.cdr.detectChanges();
		this.updateSubscription = this.usuariosService.getUpdateObservable().subscribe(() => {
			this.getAllUsers();
		});
	}

	ngOnDestroy() {
		if (this.updateSubscription) {
			this.updateSubscription.unsubscribe();
		}
	}

	getAllUsers() {
		const usuarioSession = localStorage.getItem('usuario');
		const usuario = JSON.parse(usuarioSession!);
		this.idUsuario = usuario.ID_USUARIO;

		if (usuarioSession != null) {
			this.usuariosService.getUsuarios().subscribe((data) => {
				//excluye el usuario actual logueado
				data = data.filter((usuario) => usuario.ID_USUARIO != this.idUsuario);

				this.dataSource = new MatTableDataSource(data); // Asigna los datos al dataSource
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;

				this.dataSource.filterPredicate = (data: UsuarioInterface, filter: string) => {
					//	let estadoLabel = this.getEstadoLabel(data.ESTADO);

					const dataStr =
						`${data.ID_USUARIO} ${data.NOMBRE_COMPLETO} ${data.USERNAME} ${data.CORREO} ${data.ROL.NOMBRE}`.toLowerCase();

					return dataStr.includes(filter.trim().toLowerCase());
				};
			});
		}
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	openDialog(row: UsuarioInterface) {
		this.dialog.open(PopupUsuarioComponent, {
			width: '80%',
			data: row
		});
	}
}
