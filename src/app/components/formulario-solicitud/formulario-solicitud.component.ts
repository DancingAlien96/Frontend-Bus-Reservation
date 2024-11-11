import { Component, Injectable, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { VehiculoInterface, SolicitudPostInterface } from '../../shared/interfaces';
import { VehiculoService } from '../../shared/services/vehiculo.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SolicitudesService } from '../../shared/services/solicitudes.service';
import { MatIconModule } from '@angular/material/icon';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import 'moment/locale/es';
import { CookieService } from 'ngx-cookie-service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { min, noop } from 'rxjs';
import { MY_FORMATS } from '../../shared/utils/date-format.utils';
import { Router } from '@angular/router';
import { AlertaComponent } from '../alerta/alerta.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-formulario-solicitud',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		CommonModule,
		ReactiveFormsModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatRadioModule,
		MatSelectModule,
		MatButtonModule,
		MatIconModule,
		NgxMatTimepickerModule,
		MatCardModule,
		MatDividerModule
	],
	templateUrl: './formulario-solicitud.component.html',
	styleUrls: ['./formulario-solicitud.component.css'],
	providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-GT' }, provideMomentDateAdapter(MY_FORMATS)]
})
export default class FormularioSolicitudComponent {
	solicitud!: SolicitudPostInterface;
	vehiculos: VehiculoInterface[] = [];
	formSubmit: FormGroup;
	minHoraDevolucion = '0:00';

	constructor(
		private fb: FormBuilder,
		private vs: VehiculoService,
		private sps: SolicitudesService,
		private _snackBar: MatSnackBar,
		private router: Router,
		private dialog: MatDialog
	) {
		this.formSubmit = this.fb.group({
			nombreSolicitante: [null, [Validators.required, Validators.maxLength(150)]],
			destino: [null, [Validators.required, Validators.maxLength(200)]],
			diligencia: [null, [Validators.required, Validators.maxLength(200)]],
			entrega: new FormControl<Date | null>(null, Validators.required),
			devolucion: new FormControl<Date | null>(null, Validators.required),
			horaEntrega: [null, Validators.required],
			horaDevolucion: [null, Validators.required],
			vehiculo: [null, Validators.required],
			conPiloto: ['1', Validators.required],
			nombrePiloto: [null, [Validators.maxLength(150), Validators.required]]
		});
		this.formSubmit.controls['devolucion'].disable();
		this.formSubmit.controls['horaDevolucion'].disable();
	}

	onSubmit() {
		const usuarioStorage = localStorage.getItem('usuario');
		const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;

		if (usuario) {
			// Quita el atributo 'ROL' de usuario
			delete usuario.ROL;
		}

		if (this.formSubmit.valid) {
			const dialogRef = this.dialog.open(AlertaComponent, {
				width: '400px',
				data: {
					title: 'Advertencia',
					message: '¿Está seguro de enviar la solicitud?',
					type: 1
				}
			});

			dialogRef.afterClosed().subscribe((result) => {
				this.solicitud = this.solicitud || {};
				const entregaFecha = this.formSubmit.get('entrega')?.value;
				const devolucionFecha = this.formSubmit.get('devolucion')?.value;
				const horaEntrega = this.formSubmit.get('horaEntrega')?.value;
				const horaDevolucion = this.formSubmit.get('horaDevolucion')?.value;
				const timestampEntrega = this.combinarFechaHora(entregaFecha, horaEntrega);
				const timestampDevolucion = this.combinarFechaHora(devolucionFecha, horaDevolucion);

				const vehiculo = this.formSubmit.get('vehiculo')?.value;
				delete vehiculo.BITACORA_CONDICIONES;

				this.solicitud.VEHICULO = vehiculo;
				this.solicitud.USUARIO = usuario;

				this.solicitud.SOLICITUD = {
					ID_USUARIO: this.solicitud.USUARIO.ID_USUARIO,
					ID_VEHICULO: this.solicitud.VEHICULO.ID_VEHICULO,
					NOMBRE_SOLICITANTE: this.formSubmit.get('nombreSolicitante')?.value,
					DESTINO: this.formSubmit.get('destino')?.value,
					DILIGENCIA: this.formSubmit.get('diligencia')?.value,
					FECHA_CREACION: new Date().toJSON(),
					FECHA_HORA_ENTREGA: new Date(timestampEntrega).toJSON(),
					FECHA_HORA_DEVOLUCION: new Date(timestampDevolucion).toJSON(),
					CON_PILOTO: this.formSubmit.get('conPiloto')?.value,
					NOMBRE_PILOTO: this.formSubmit.get('nombrePiloto')?.value,
					ESTADO: 0,
					MODIFICABLE: true,
					MOTIVO_RECHAZO: ' ',
					ENTREGADO: false,
					DEVUELTO: false
				};

				this.sps.postSolicitud(this.solicitud).subscribe({
					next: (resp) => {
						if (resp) {
							this.openSnackBar(2);
							this.formSubmit.disable();
							this.router.navigate(['/solicitudes']);
						}
					},
					error: (err) => {
						// Muestra el diálogo de error en caso de fallo en la API o en la conexión
						this.dialog.open(AlertaComponent, {
							width: '400px',
							data: {
								title: 'Error',
								message: 'Hubo un problema al procesar la solicitud. Por favor, intenta de nuevo.',
								type: 0
							}
						});
					}
				});
			});
		} else {
			const dialogRef = this.dialog.open(AlertaComponent, {
				width: '400px',
				data: {
					title: 'Error',
					message: 'Faltan campos por completar',
					type: 0
				}
			});
		}
	}

	ngOnInit() {
		this.vs.getVehiculos().subscribe((data) => {
			const vehiculosFiltrados = data.filter((vehiculo) => vehiculo.ESTADO === 0);
			this.vehiculos = vehiculosFiltrados;
		});
	}

	openSnackBar(messagetype: number) {
		const config = new MatSnackBarConfig();
		let message: string = '';
		switch (messagetype) {
			case 1:
				config.panelClass = 'ErrorSnackBar';
				message = 'Error: debe completar los campos';
				break;
			case 2:
				config.panelClass = 'OkSnackBar';
				message = 'Solicitud enviada correctamente';
				break;
			default:
				config.panelClass = 'ErrorSnackBar';
				message = 'Ha ocurrido un error';
				break;
		}
		config.horizontalPosition = 'center';
		config.verticalPosition = 'bottom';
		config.duration = 3000;

		this._snackBar.open(message, 'cerrar', config);
	}

	onRadioButtonChange(event: any) {
		if (event.value === '0') {
			this.formSubmit.get('nombrePiloto')?.setValue(null);
			this.formSubmit.get('nombrePiloto')?.disable();
			this.formSubmit.get('nombrePiloto')?.clearValidators();
		} else {
			this.formSubmit.get('nombrePiloto')?.enable();
			this.formSubmit.get('nombrePiloto')?.setValidators([Validators.required]);
		}
	}

	onDateHourChange() {
		const entrega = this.formSubmit.controls['entrega'].value;
		const horaEntrega = this.formSubmit.controls['horaEntrega'].value;
		const entregaValid = this.formSubmit.controls['entrega'].valid;
		const horaEntregaValid = this.formSubmit.controls['horaEntrega'].valid;

		if (entrega && horaEntrega && entregaValid && horaEntregaValid) {
			this.formSubmit.controls['devolucion'].enable();
			this.formSubmit.controls['devolucion'].reset();
			this.formSubmit.controls['devolucion'].setValidators([
				Validators.required,
				Validators.min(this.formSubmit.controls['entrega'].value)
			]);

			this.formSubmit.controls['horaDevolucion'].enable();
			this.formSubmit.controls['horaDevolucion'].reset();
		} else {
			this.formSubmit.controls['devolucion'].disable();
			this.formSubmit.controls['horaDevolucion'].disable();
		}
	}

	onDevDateHourChange() {
		const devolucionMoment = this.formSubmit.controls['devolucion'].value;
		const devolucion = new Date(devolucionMoment);

		const entregaMoment = this.formSubmit.controls['entrega'].value;
		const entrega = new Date(entregaMoment);

		if (devolucion.getTime() == entrega.getTime()) {
			this.formSubmit.controls['horaDevolucion'].setValidators([
				Validators.required,
				Validators.min(this.formSubmit.controls['horaEntrega'].value)
			]);
			this.minHoraDevolucion = this.formSubmit.controls['horaEntrega'].value;
		} else {
			this.formSubmit.controls['horaDevolucion'].setValidators([Validators.required]);
			this.minHoraDevolucion = '0:00';
		}
	}

	combinarFechaHora(fecha: Date, hora: string): Date {
		const fechaConHora = new Date(fecha);
		fechaConHora.setHours(parseInt(hora.split(':')[0]));
		fechaConHora.setMinutes(parseInt(hora.split(':')[1]));
		fechaConHora.setSeconds(0);
		fechaConHora.setMilliseconds(0);

		return fechaConHora;
	}

	myDateFilter = (d: Date | null): boolean => {
		const minDate = this.formSubmit.controls['entrega'].value;
		// Prevent dates before minDate from being selected.
		return d ? d >= minDate : false;
	};
}
