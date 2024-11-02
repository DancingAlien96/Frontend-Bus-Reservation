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
		MatDividerModule
	]
})
export class UsuariosTableComponent implements AfterViewInit {
	savedstate: string | null = null;
	idUsuario!: number;
	rol!: number;
	tabIndex = 0;
	displayedColumns: string[] = [
		'ID_USUARIO',
		'CUI',
		'NOMBRE_COMPLETO',

	];
	dataSource!: MatTableDataSource<UsuarioInterface>;

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private usuariosService:UsuariosService,
		private dialog: MatDialog,
		private cdr: ChangeDetectorRef
	) {}

	ngAfterViewInit() {
		this.getAllRequest();
		this.cdr.detectChanges();
	}


	getAllRequest() {
		const usuarioSession = sessionStorage.getItem('usuario');

		if (usuarioSession != null) {
			const usuario = JSON.parse(usuarioSession);
			const id = usuario.ID_USUARIO;
			this.rol = usuario.ROL.ID_ROL;
			this.idUsuario = usuario.ID_USUARIO;
			if (this.rol == 1) {
				this.usuariosService.getUsuarios().subscribe((data) => {
					this.dataSource = new MatTableDataSource(data); // Asigna los datos al dataSource
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;
					//console.log(data);

					this.dataSource.filterPredicate = (data: UsuarioInterface, filter: string) => {
					//	let estadoLabel = this.getEstadoLabel(data.ESTADO);

						const dataStr =
							`${data.ID_USUARIO} ${data.CUI} ${data.NOMBRE_COMPLETO}`.toLowerCase();

						return dataStr.includes(filter.trim().toLowerCase());
					};
				});
			}
		
		}
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	
}
