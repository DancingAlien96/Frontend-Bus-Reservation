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

export const MY_FORMATS = {
	parse: {
		dateInput: 'LL'
	},
	display: {
		dateInput: 'LL',
		monthYearLabel: 'MMM YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'MMMM YYYY'
	}
};

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
		NgxMatTimepickerModule
	],
	templateUrl: './formulario-solicitud.component.html',
	styleUrls: ['./formulario-solicitud.component.css'],
	providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-GT' }, provideMomentDateAdapter(MY_FORMATS)]
})
export default class FormularioSolicitudComponent {
	solicitud!: SolicitudPostInterface;
	vehiculos: VehiculoInterface[] = [];
	formSubmit: FormGroup;

	constructor(
		private fb: FormBuilder,
		private vs: VehiculoService,
		private sps: SolicitudesService,
		private _snackBar: MatSnackBar,
		private cookies: CookieService
	) {
		this.formSubmit = this.fb.group({
			nombreSolicitante: [null, Validators.required],
			destino: [null, [Validators.required, Validators.maxLength(150)]],
			diligencia: [null, Validators.required],
			entrega: new FormControl<Date | null>(null, Validators.required),
			devolucion: new FormControl<Date | null>(null, Validators.required),
			horaEntrega: [null, Validators.required],
			horaDevolucion: [null, Validators.required],
			vehiculo: [null, Validators.required],
			conPiloto: ['0', Validators.required]
		});
	}

	onSubmit() {
		const usuarioStorage = sessionStorage.getItem('usuario');
		const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;

		if (usuario) {
			// Quita el atributo 'ROL' de usuario
			delete usuario.ROL;
		}

		if (this.formSubmit.valid) {
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
				NOMBRE_PILOTO: null,
				ESTADO: 0,
				MODIFICABLE: true,
				MOTIVO_RECHAZO: null,
				ENTREGADO: false,
				DEVUELTO: false
			};

			this.sps.postSolicitud(this.solicitud).subscribe((resp) => {
				if (resp) {
					this.openSnackBar(2);
					this.formSubmit.reset();
				}
			});
		} else {
			this.openSnackBar(1);
		}
	}

	ngOnInit() {
		this.vs.getVehiculos().subscribe((data) => {
			this.vehiculos = data;
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

	combinarFechaHora(fecha: Date, hora: string): Date {
		const fechaConHora = new Date(fecha);
		fechaConHora.setHours(parseInt(hora.split(':')[0]));
		fechaConHora.setMinutes(parseInt(hora.split(':')[1]));
		fechaConHora.setSeconds(0);
		fechaConHora.setMilliseconds(0);

		return fechaConHora;
	}
}
