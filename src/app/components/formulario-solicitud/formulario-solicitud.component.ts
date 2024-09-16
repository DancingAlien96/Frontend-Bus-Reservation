import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule, Time } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { VehiculoInterface, SolicitudPostInterface } from '../../shared/interfaces';
import { VehiculoService } from '../../shared/services/vehiculo.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SolicitudesService } from '../../shared/services/solicitudes.service';

@Component({
	selector: 'app-formulario-solicitud',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		CommonModule,
		ReactiveFormsModule,
		MatDatepickerModule,
		MatRadioModule,
		MatNativeDateModule,
		MatSelectModule,
		MatButtonModule
	],
	templateUrl: './formulario-solicitud.component.html',
	styleUrls: ['./formulario-solicitud.component.css'],
	providers: [provideNativeDateAdapter()]
})
export default class FormularioSolicitudComponent {
	solicitud!: SolicitudPostInterface;
	vehiculos: VehiculoInterface[] = [];
	formSubmit: FormGroup;
	fechasGroup: FormGroup = new FormGroup({
		entrega: new FormControl<Date>(new Date(), Validators.required),
		devolucion: new FormControl<Date>(new Date(), Validators.required)
	});

	constructor(
		private fb: FormBuilder,
		private vs: VehiculoService,
		private sps: SolicitudesService,
		private _snackBar: MatSnackBar
	) {
		this.formSubmit = this.fb.group({
			destino: [null, Validators.required],
			diligencia: [null, Validators.required],
			fechas: this.fechasGroup,
			horaEntrega: ['08:00', Validators.required],
			horaDevolucion: ['16:00', Validators.required],
			vehiculo: [null, Validators.required],
			conPiloto: ['0', Validators.required],
			nombrePiloto: [{ value: null, disabled: true }, Validators.required]
		});
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

	onSubmit() {
		if (this.formSubmit.valid && this.fechasGroup.valid) {
			this.solicitud = this.solicitud || {};
			const entregaFecha = this.fechasGroup.get('entrega')?.value;
			const devolucionFecha = this.fechasGroup.get('devolucion')?.value;
			const horaEntrega = this.formSubmit.get('horaEntrega')?.value;
			const horaDevolucion = this.formSubmit.get('horaDevolucion')?.value;
			const timestampEntrega = this.combinarFechaHora(entregaFecha, horaEntrega);
			const timestampDevolucion = this.combinarFechaHora(devolucionFecha, horaDevolucion);

			this.solicitud.VEHICULO = this.formSubmit.get('vehiculo')?.value;

			this.solicitud.USUARIO = {
				ID_USUARIO: 1,
				USERNAME: 'jdoe',
				CORREO: 'jdoe@example.com',
				NOMBRE_COMPLETO: 'John Doe',
				CUI: 1234567890123,
				REGISTRO_PERSONAL: 1001,
				FECHA_NACIMIENTO: '1990-01-15',
				TELEFONO_UNO: '555-1234',
				TELEFONO_DOS: '555-5678'
			};

			this.solicitud.SOLICITUD = {
				ID_USUARIO: this.solicitud.USUARIO.ID_USUARIO,
				ID_VEHICULO: this.solicitud.VEHICULO.ID_VEHICULO,
				DESTINO: this.formSubmit.get('destino')?.value,
				DILIGENCIA: this.formSubmit.get('diligencia')?.value,
				FECHA_CREACION: new Date(),
				FECHA_HORA_ENTREGA: new Date(timestampEntrega),
				FECHA_HORA_DEVOLUCION: new Date(timestampDevolucion),
				CON_PILOTO: this.formSubmit.get('conPiloto')?.value,
				NOMBRE_PILOTO: this.formSubmit.get('nombrePiloto')?.value,
				ESTADO: 1,
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
			console.log(this.vehiculos);
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
		return fechaConHora;
	}
}
