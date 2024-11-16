import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SolicitudesService } from '../../shared/services/solicitudes.service';
import { SolicitudesInterfaces } from '../../shared/interfaces/solicitudes.interface';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { PaginatorService } from '../../shared/services/paginator.service';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { DateFormatPipe } from '../../shared/pipes/date-time-format.pipe';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../shared/utils/date-format.utils';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComunicationService } from '../../shared/services/comunication.service';
import { AlertaEliminadoComponent } from '../alerta-eliminado/alerta-eliminado.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
	providers: [
		{ provide: MatPaginatorIntl, useClass: PaginatorService }, // Proveedor personalizado
		{ provide: MAT_DATE_LOCALE, useValue: 'es-GT' },
		provideMomentDateAdapter(MY_FORMATS)
	],
	selector: 'app-solicitudes-table',
	styleUrl: './solicitudes-table.component.css',
	templateUrl: './solicitudes-table.component.html',
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
		ReactiveFormsModule,
		MatDatepickerModule,
		MatButtonModule,
		MatIconModule,
		RouterLink
	]
})
export class SolicitudesTableComponent implements AfterViewInit {
	estadoActivoTab!: number; // Puedes inicializarlo con el valor de tu tab "Todas"

	mostrarColumnaEstado!: boolean;
	private updateSubscription!: Subscription;
	trashActive!: boolean;

	savedstate: string | null = null;
	idUsuario!: number;
	filtradoFechas: boolean = false;
	solicitudesFiltradas: boolean = false;
	refresh!: boolean;
	rol!: number;
	tabIndex = 0;
	displayedColumns: string[] = [
		'ID_SOLICITUD',
		'FECHA_CREACION',
		'FECHA_HORA_ENTREGA',
		'FECHA_HORA_DEVOLUCION',
		'NOMBRE_SOLICITANTE',
		'ESTADO'
	];
	dataSource!: MatTableDataSource<SolicitudesInterfaces>;
	formSearch: FormGroup;
	datePipe: DatePipe = new DatePipe('ES');

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

	constructor(
		private solicitudesService: SolicitudesService,
		private dialog: MatDialog,
		private cdr: ChangeDetectorRef,
		private fb: FormBuilder,
		private comunicacionService: ComunicationService,
		private toast: MatSnackBar
	) {
		this.formSearch = this.fb.group({
			inicio: new FormControl<Date | null>(null, Validators.required),
			fin: new FormControl<Date | null>(null, Validators.required)
		});
		this.formSearch.controls['fin'].disable();
	}

	onBuscarPorFechas() {
		const inicio = this.datePipe.transform(this.formSearch.value.inicio, 'yyyy-MM-dd');
		const fin = this.datePipe.transform(this.formSearch.value.fin, 'yyyy-MM-dd');
		if (this.rol == 1) {
			this.solicitudesService.getSolicitudesByDate(inicio, fin).subscribe((data) => {
				const solicitudesNoEliminadas = data.filter((solicitud) => solicitud.ESTADO !== 4);
				this.dataSource = new MatTableDataSource(solicitudesNoEliminadas); // Asigna los datos al dataSource
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
				this.solicitudesFiltradas = true;
				this.dataSource.filterPredicate = (solicitudesNoEliminadas: SolicitudesInterfaces, filter: string) => {
					let estadoLabel = this.getEstadoLabel(solicitudesNoEliminadas.ESTADO);

					const dataStr =
						`${solicitudesNoEliminadas.ID_SOLICITUD} ${solicitudesNoEliminadas.VEHICULO.PLACA}  ${solicitudesNoEliminadas.VEHICULO.MARCA}  ${solicitudesNoEliminadas.VEHICULO.COLOR}  ${solicitudesNoEliminadas.VEHICULO.TIPO} ${solicitudesNoEliminadas.FECHA_CREACION} ${solicitudesNoEliminadas.FECHA_HORA_ENTREGA} ${solicitudesNoEliminadas.FECHA_HORA_DEVOLUCION} ${solicitudesNoEliminadas.NOMBRE_SOLICITANTE} ${estadoLabel}`.toLowerCase();

					return dataStr.includes(filter.trim().toLowerCase());
				};
			});
		}
		if (this.rol == 3) {
			this.solicitudesService.getSolicitudesByDate(inicio, fin).subscribe((data) => {
				const solicitudesAprobadasYFinalizadas = data.filter(
					(solicitud) => solicitud.ESTADO === 1 || solicitud.ESTADO == 3
				);

				this.dataSource = new MatTableDataSource(solicitudesAprobadasYFinalizadas); // Asigna los datos al dataSource
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
				this.solicitudesFiltradas = true;
				this.dataSource.filterPredicate = (data: SolicitudesInterfaces, filter: string) => {
					let estadoLabel = this.getEstadoLabel(data.ESTADO);

					const dataStr =
						`${data.ID_SOLICITUD} ${data.VEHICULO.PLACA}  ${data.VEHICULO.MARCA}  ${data.VEHICULO.COLOR}  ${data.VEHICULO.TIPO} ${data.FECHA_CREACION} ${data.FECHA_HORA_ENTREGA} ${data.FECHA_HORA_DEVOLUCION} ${data.NOMBRE_SOLICITANTE} ${estadoLabel}`.toLowerCase();

					return dataStr.includes(filter.trim().toLowerCase());
				};
			});
		}
		if (this.rol == 2) {
			this.solicitudesService.getSolicitudesByDateAndUser(inicio, fin, this.idUsuario).subscribe((data) => {
				this.dataSource = new MatTableDataSource(data); // Asigna los datos al dataSource
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
				this.solicitudesFiltradas = true;
				this.dataSource.filterPredicate = (data: SolicitudesInterfaces, filter: string) => {
					let estadoLabel = this.getEstadoLabel(data.ESTADO);

					const dataStr =
						`${data.ID_SOLICITUD} ${data.VEHICULO.PLACA}  ${data.VEHICULO.MARCA}  ${data.VEHICULO.COLOR}  ${data.VEHICULO.TIPO} ${data.FECHA_CREACION} ${data.FECHA_HORA_ENTREGA} ${data.FECHA_HORA_DEVOLUCION} ${data.NOMBRE_SOLICITANTE} ${estadoLabel}`.toLowerCase();

					return dataStr.includes(filter.trim().toLowerCase());
				};
			});
		}
	}

	ngAfterViewInit() {
		this.getAllRequest();
		this.cdr.detectChanges();
		this.tabGroup.selectedIndex = 0;
	}

	ngOnDestroy() {
		if (this.updateSubscription) {
			this.updateSubscription.unsubscribe();
		}
	}

	filterByTab(index: number) {
		switch (index) {
			case 0: // todas
				this.dataSource.filter = '';
				break;
			case 1: // aprobadas
				this.dataSource.filter = 'aprobada';
				break;
			case 2: // finalizadas
				this.dataSource.filter = 'finalizada';
				break;
			case 3: // pendientes
				this.dataSource.filter = 'pendiente';
				break;
			case 4: // rechazadas
				this.dataSource.filter = 'rechazada';
				break;
			case 5: //eliminadas
				this.dataSource.filter = 'anulada';
				break;
			default:
				this.dataSource.filter = '';
				break;
		}
		this.tabIndex = index;
	}

	getEstadoLabel(estado: number): string {
		let estadoLabel = '';
		switch (estado) {
			case 0:
				estadoLabel = 'Pendiente';
				break;
			case 1:
				estadoLabel = 'Aprobada';
				break;
			case 2:
				estadoLabel = 'Rechazada';
				break;
			case 3:
				estadoLabel = 'Finalizada';
				break;
			case 4:
				estadoLabel = 'Eliminada';
				break;
			case 5:
				estadoLabel = 'Anulada';
				break;
			default:
				estadoLabel = 'Desconocido';
		}

		// Aquí guardamos el estado en la variable
		this.savedstate = estadoLabel;
		return estadoLabel;
	}

	getAllRequest() {
		const usuarioSession = localStorage.getItem('usuario');

		if (usuarioSession != null) {
			const usuario = JSON.parse(usuarioSession);
			const id = usuario.ID_USUARIO;
			this.rol = usuario.ROL.ID_ROL;
			this.idUsuario = usuario.ID_USUARIO;
			if (this.rol == 1) {
				this.solicitudesService.getSolicitudes().subscribe((data) => {
					const solicitudesNoEliminadas = data.filter((solicitud) => solicitud.ESTADO !== 4);
					this.dataSource = new MatTableDataSource(solicitudesNoEliminadas); // Asigna los datos al dataSource
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;
					//console.log(data);

					this.dataSource.filterPredicate = (solicitudesNoEliminadas: SolicitudesInterfaces, filter: string) => {
						let estadoLabel = this.getEstadoLabel(solicitudesNoEliminadas.ESTADO);

						const dataStr =
							`${solicitudesNoEliminadas.ID_SOLICITUD} ${solicitudesNoEliminadas.VEHICULO.PLACA}  ${solicitudesNoEliminadas.VEHICULO.MARCA}  ${solicitudesNoEliminadas.VEHICULO.COLOR}  ${solicitudesNoEliminadas.VEHICULO.TIPO} ${solicitudesNoEliminadas.FECHA_CREACION} ${solicitudesNoEliminadas.FECHA_HORA_ENTREGA} ${solicitudesNoEliminadas.FECHA_HORA_DEVOLUCION} ${solicitudesNoEliminadas.NOMBRE_SOLICITANTE} ${estadoLabel}`.toLowerCase();

						return dataStr.includes(filter.trim().toLowerCase());
					};
				});
			}
			if (this.rol == 3) {
				this.solicitudesService.getSolicitudes().subscribe((data) => {
					const solicitudesAprobadas = data.filter((solicitud) => solicitud.ESTADO === 1 || solicitud.ESTADO == 3);

					this.dataSource = new MatTableDataSource(solicitudesAprobadas); // Asigna los datos al dataSource
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;
					//console.log(data);

					this.dataSource.filterPredicate = (data: SolicitudesInterfaces, filter: string) => {
						let estadoLabel = this.getEstadoLabel(data.ESTADO);

						const dataStr =
							`${data.ID_SOLICITUD} ${data.VEHICULO.PLACA}  ${data.VEHICULO.MARCA}  ${data.VEHICULO.COLOR}  ${data.VEHICULO.TIPO} ${data.FECHA_CREACION} ${data.FECHA_HORA_ENTREGA} ${data.FECHA_HORA_DEVOLUCION} ${data.NOMBRE_SOLICITANTE} ${estadoLabel}`.toLowerCase();

						return dataStr.includes(filter.trim().toLowerCase());
					};
				});
			}
			if (this.rol == 2) {
				this.solicitudesService.solicitudFiltrada(id).subscribe((data) => {
					this.dataSource = new MatTableDataSource(data); // Asigna los datos al dataSource
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;

					this.dataSource.filterPredicate = (data: SolicitudesInterfaces, filter: string) => {
						let estadoLabel = this.getEstadoLabel(data.ESTADO);

						const dataStr =
							`${data.ID_SOLICITUD} ${data.VEHICULO.PLACA}  ${data.VEHICULO.MARCA}  ${data.VEHICULO.COLOR}  ${data.VEHICULO.TIPO} ${data.FECHA_CREACION} ${data.FECHA_HORA_ENTREGA} ${data.FECHA_HORA_DEVOLUCION} ${data.NOMBRE_SOLICITANTE} ${estadoLabel}`.toLowerCase();

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

	openDialog(row: SolicitudesInterfaces) {
		const dialogRef = this.dialog.open(PopupComponent, {
			width: '80%',
			data: row
		});

		dialogRef.afterClosed().subscribe((estado) => {
			if (estado === true) {
				this, this.getAllRequest();
				this.tabGroup.selectedIndex = 0;
			}
		});
	}

	onDateFilter() {
		this.filtradoFechas = !this.filtradoFechas;
		if (!this.filtradoFechas && this.solicitudesFiltradas) {
			this.getAllRequest();
		}
	}

	onDateHourChange() {
		const inicio = this.formSearch.controls['inicio'].value;
		const inicioValid = this.formSearch.controls['inicio'].valid;

		if (inicio && inicioValid) {
			this.formSearch.controls['fin'].enable();
			this.formSearch.controls['fin'].reset();
			this.formSearch.controls['fin'].setValidators([
				Validators.required,
				Validators.min(this.formSearch.controls['inicio'].value)
			]);
		} else {
			this.formSearch.controls['fin'].disable();
		}
	}

	myDateFilter = (d: Date | null): boolean => {
		const minDate = this.formSearch.controls['inicio'].value;
		// Prevent dates before minDate from being selected.
		return d ? d >= minDate : false;
	};
}
