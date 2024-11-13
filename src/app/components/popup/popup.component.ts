import { PersonalService } from './../../shared/services/personal.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { VehiculoService } from '../../shared/services/vehiculo.service';
import { BitacoraCondicionesInterface, SolicitudesInterfaces, VehiculoInterface } from '../../shared/interfaces';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { EstadosInterface } from '../../shared/interfaces/options.interface';
import { CombustiblePipe } from '../../shared/pipes/condiciones.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SolicitudesService } from '../../shared/services/solicitudes.service';
import { DateFormatPipe } from '../../shared/pipes/date-time-format.pipe';
import { PdfSolicitudComponent } from '../../shared/pdf/pdf-solicitud.component';
import { PdfFECVComponent } from '../../shared/pdf/pdf-fecv.component';
import { PdfFDCVComponent } from '../../shared/pdf/pdf-fdcv.component';
import { ComunicationService } from '../../shared/services/comunication.service';
import { AlertaComponent } from '../alerta/alerta.component';
@Component({
	selector: 'app-popup',
	standalone: true,
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatButtonModule,
		MatDialogContent,
		MatDialogActions,
		MatDialogClose,
		RouterModule,
		MatChipsModule,
		MatCardModule,
		MatIcon,
		MatSelectModule,
		CombustiblePipe,
		MatProgressBarModule,
		ReactiveFormsModule,
		MatButtonModule
	],
	templateUrl: './popup.component.html',
	styleUrl: './popup.component.css',
	providers: [DateFormatPipe]
})
export class PopupComponent {
	señal!: boolean;
	estadoLabel!: string;
	numero!: number;
	formSubmit: FormGroup;
	areaTexto = new FormControl('', [Validators.required, Validators.minLength(10)]);
	idUsuario!: number;
	actualEstado!: number;
	motivo: string | null = null;
	usuarioSession: any;
	usuario: any | null = null;
	eSolicitante = false;
	eBoton = false;
	estadoTemporal!: number;
	areaJustificacion = false;
	idRol!: number;
	vehiculo?: VehiculoInterface;
	condiciones?: BitacoraCondicionesInterface;
	selected: number = 1;
	haySolicitudes: boolean = false;
	estados: EstadosInterface[] = [
		{ id: 0, estado: 'Pendiente' },
		{ id: 1, estado: 'Aprobada' },
		{ id: 2, estado: 'Rechazada' },
		{ id: 3, estado: 'Finalizada' },
		{ id: 4, estado: 'Eliminada' },
		{ id: 5, estado: 'Anulada' }
	];

	estadosPendiente: EstadosInterface[] = [
		{ id: 0, estado: 'Pendiente' },
		{ id: 1, estado: 'Aprobada' },
		{ id: 2, estado: 'Rechazada' }
	];

	estadosAprobada: EstadosInterface[] = [
		{ id: 1, estado: 'Aprobada' },
		{ id: 3, estado: 'Finalizada' },
		{ id: 5, estado: 'Anulada' }
	];

	currentPage: number = 1;
	constructor(
		public dialogRef: MatDialogRef<any>,
		@Inject(MAT_DIALOG_DATA)
		public data: SolicitudesInterfaces,
		private toast: MatSnackBar,
		private vehiculoService: VehiculoService,
		private personalService: PersonalService,
		private solicitudesService: SolicitudesService,
		private datePipe: DateFormatPipe,
		private router: Router,
		private fb: FormBuilder,
		private comunicacionService: ComunicationService,
		private dialog: MatDialog
	) {
		this.usuarioSession = localStorage.getItem('usuario');
		this.usuario = JSON.parse(this.usuarioSession);
		this.idRol = this.usuario.ID_ROL;
		this.estadoTemporal = data.ESTADO;
		//console.log(this.estadoTemporal);
		this.getDisponibilidad();
		this.numero = 25;

		this.formSubmit = this.fb.group({
			motivo: [null, [Validators.required, Validators.maxLength(250)]],
			estadoNuevo: [data.ESTADO, [Validators.required]]
		});
	}

	pageAndDetails(pagenumber: number, idVehiculo: number): void {
		this.currentPage = pagenumber;

		this.vehiculoService.getVehiculo(idVehiculo).subscribe((res) => {
			this.vehiculo = res;
			this.condiciones = res.BITACORA_CONDICIONES;
		});
	}

	page(pagenumber: number): void {
		this.currentPage = pagenumber;
	}

	getDisponibilidad() {
		const inicio = this.data.FECHA_HORA_ENTREGA;
		const fin = this.data.FECHA_HORA_DEVOLUCION;
		// Usando DatePipe para formatear las fechas a 'YYYY-MM-DD'
		const inicioFormatted = inicio.split('T')[0];
		const finFormatted = fin.split('T')[0];

		this.solicitudesService
			.getSolicitudesByDateAndVehicle(inicioFormatted, finFormatted, this.data.VEHICULO)
			.subscribe((data) => {
				//console.log(data);

				if (data.length > 0) {
					this.haySolicitudes = true;
				} else {
					this.haySolicitudes = false;
				}
			});
	}

	cambiarEstadoDeSolicitud(nuevoEstado: number) {
		let tipo = 1;
		let message = '¿Está seguro de cambiar el estado de la solicitud?';

		if (nuevoEstado == 2 || nuevoEstado == 5) {
			tipo = 3;
			message = '¿Está seguro de cambiar el estado de la solicitud? Escribe una justificación para realizar el cambio';
		}
		const dialogRef = this.dialog.open(AlertaComponent, {
			data: {
				title: 'Advertencia',
				message: message,
				type: tipo
			}
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (!result) {
				return;
			}

			if (tipo === 3) {
				this.motivo = result;
			}

			this.solicitudesService.actualizarEstado(this.data.ID_SOLICITUD, nuevoEstado, this.motivo || ' ').subscribe({
				next: (res) => {
					this.toast.open('Guardado', 'cerrar');
					this.comunicacionService.emitUpdate();
					this.dialogRef.close(true);
				},
				error: (err) => {
					this.dialog.open(AlertaComponent, {
						data: {
							title: 'Error',
							message: 'Hubo un problema al procesar. Por favor, intenta de nuevo.',
							type: 0
						}
					});
				}
			});
		});
	}

	save(): void {
		const config = new MatSnackBarConfig();
		config.horizontalPosition = 'center';
		config.verticalPosition = 'bottom';
		config.panelClass = 'OkSnackBar'; //tipo de snackbar
		config.duration = 3000;

		if (this.formSubmit.valid) {
			const dialogRef = this.dialog.open(AlertaComponent, {
				width: '400px',
				data: {
					title: 'Advertencia',
					message: '¿Está seguro de cambiar el estado de la solicitud?',
					type: 1
				}
			});

			dialogRef.afterClosed().subscribe((result) => {
				if (!result) {
					return;
				}
				this.solicitudesService
					.actualizarEstado(this.data.ID_SOLICITUD, this.estadoTemporal, this.motivo || ' ')
					.subscribe({
						next: (res) => {
							//console.log(res);
							this.toast.open('Guardado', 'cerrar', config);
							this.comunicacionService.emitUpdate();
							this.dialogRef.close(true);
						},
						error: (err) => {
							this.dialog.open(AlertaComponent, {
								width: '400px',
								data: {
									title: 'Error',
									message: 'Hubo un problema al procesar. Por favor, intenta de nuevo.',
									type: 0
								}
							});
						}
					});
			});
		} else {
			this.dialog.open(AlertaComponent, {
				width: '400px',
				data: {
					title: 'Error',
					message: 'Faltan campos por completar',
					type: 0
				}
			});

			this.formSubmit.markAllAsTouched();
		}
		/*
		console.log(this.data.ID_SOLICITUD);
		console.log(`el estado temporal es ${this.estadoTemporal}`);
		console.log(`el motivo es: ${this.motivo}`);*/
	}

	/**
	 *
	 */
	onPDF(): void {
		PdfSolicitudComponent.createPDF(this.data, this.personalService);
	}

	/**
	 *
	 * @param event  nuevo valor seleccionado
	 */
	selectedValueChanges(event: any) {
		//console.log(event.value);

		this.estadoTemporal = event.value;

		//console.log(this.estadoTemporal);
		this.eBoton = true;
		if (event.value == 2 || event.value == 5) {
			this.areaJustificacion = true;
			this.formSubmit.controls['motivo'].setValidators([Validators.required]);
			this.formSubmit.controls['motivo'].updateValueAndValidity();
		} else {
			this.areaJustificacion = false;
			this.formSubmit.controls['motivo'].setValidators(null);
			this.formSubmit.controls['motivo'].updateValueAndValidity();
		}
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
			default:
				estadoLabel = 'Desconocido';
		}
		return estadoLabel;
	}

	onFECV() {
		if (this.data.FECV == null) {
			this.router.navigate(['/form-entrega'], { state: { solicitud: this.data } });
			this.dialogRef.close();
		} else {
			PdfFECVComponent.createPDF(this.data.FECV, this.data.VEHICULO);
		}
	}

	onFDCV() {
		if (this.data.FDCV == null) {
			this.router.navigate(['/form-devolucion'], { state: { solicitud: this.data } });
			this.dialogRef.close();
		} else {
			PdfFDCVComponent.createPDF(this.data.FDCV, this.data.VEHICULO);
		}
	}
}
