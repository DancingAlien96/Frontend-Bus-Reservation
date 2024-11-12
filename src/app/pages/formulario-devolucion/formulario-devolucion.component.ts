import { MatIconModule } from '@angular/material/icon';
import { min } from 'rxjs';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { BoolToNumber, CombustiblePipe, KilometrosPipe, ToNumberPipe } from '../../shared/pipes/condiciones.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../shared/utils/date-format.utils';
import {
	FdcvInterface,
	FdcvPostInterface,
	FecvInterface,
	SolicitudBaseInterface,
	SolicitudesInterfaces,
	VehiculoInterface
} from '../../shared/interfaces';
import { VehiculoService } from '../../shared/services/vehiculo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FunctionsService } from '../../shared/services/functions.service';
import { FdcvService } from '../../shared/services/fdcv.service';
import { PdfFECVComponent } from '../../shared/pdf/pdf-fecv.component';
import { PdfFDCVComponent } from '../../shared/pdf/pdf-fdcv.component';
import { SolicitudesService } from '../../shared/services/solicitudes.service';
import { AlertaComponent } from '../../components/alerta/alerta.component';

@Component({
	selector: 'app-formulario-devolucion',
	standalone: true,
	imports: [
		MatCardModule,
		MatDividerModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatFormFieldModule,
		MatCheckboxModule,
		MatSelectModule,
		MatInputModule,
		MatSlideToggleModule,
		MatRadioModule,
		MatSliderModule,
		FormsModule,
		CombustiblePipe,
		MatDatepickerModule,
		MatNativeDateModule,
		NgxMatTimepickerModule,
		MatDialogModule,
		ToNumberPipe,
		KilometrosPipe,
		MatIconModule,
		RouterLink
	],
	templateUrl: './formulario-devolucion.component.html',
	styleUrl: './formulario-devolucion.component.css',
	providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-GT' }, provideMomentDateAdapter(MY_FORMATS)]
})
export class FormularioDevolucionComponent {
	vehiculo!: VehiculoInterface;
	solicitud!: SolicitudesInterfaces;
	formSubmit!: FormGroup;
	formVehiculo!: FormGroup;
	fecv!: FecvInterface;
	fdcv!: FdcvInterface;
	fdcvPost!: FdcvPostInterface;
	minHoraDevolucion = '0:00';

	constructor(
		private fb: FormBuilder,
		private vs: VehiculoService,
		private fdcvs: FdcvService,
		private _snackBar: MatSnackBar,
		private route: ActivatedRoute,
		private fs: FunctionsService,
		private router: Router,
		private ss: SolicitudesService,
		private dialog: MatDialog
	) {
		const navigation = this.router.getCurrentNavigation();
		if (navigation?.extras.state && navigation.extras.state['solicitud']) {
			this.solicitud = navigation.extras.state['solicitud'];
			this.fecv = this.solicitud.FECV!;

			this.loadFormSubmit();
			this.initializeVehicleForm();
			this.vs.getVehiculo(this.solicitud.ID_VEHICULO).subscribe((vehiculo) => {
				this.vehiculo = vehiculo;
				this.loadFormVehiculo();
			});
			this.onDevDateHourChange();
		}
	}

	onSubmit() {
		if (this.formSubmit.valid) {
			const dialogRef = this.dialog.open(AlertaComponent, {
				data: {
					title: '¿Estás seguro?',
					message: `¿Desea guardar el formulario de devolución? \n
					Esta acción no se puede deshacer`,
					type: 1
				}
			});

			dialogRef.afterClosed().subscribe((result) => {
				if (!result) return;

				this.fdcv = this.buildFdcv();
				let solicitudbase: SolicitudBaseInterface = {
					ID_SOLICITUD: this.solicitud.ID_SOLICITUD,
					ID_USUARIO: this.solicitud.ID_USUARIO,
					ID_VEHICULO: this.solicitud.ID_VEHICULO,
					NOMBRE_SOLICITANTE: this.solicitud.NOMBRE_SOLICITANTE,
					DESTINO: this.solicitud.DESTINO,
					DILIGENCIA: this.solicitud.DILIGENCIA,
					FECHA_CREACION: this.solicitud.FECHA_CREACION,
					FECHA_HORA_ENTREGA: this.solicitud.FECHA_HORA_ENTREGA,
					FECHA_HORA_DEVOLUCION: this.solicitud.FECHA_HORA_DEVOLUCION,
					CON_PILOTO: this.solicitud.CON_PILOTO,
					NOMBRE_PILOTO: this.solicitud.NOMBRE_PILOTO,
					ESTADO: this.solicitud.ESTADO,
					MODIFICABLE: this.solicitud.MODIFICABLE,
					MOTIVO_RECHAZO: this.solicitud.MOTIVO_RECHAZO,
					ENTREGADO: this.solicitud.ENTREGADO,
					DEVUELTO: this.solicitud.DEVUELTO
				};
				this.fdcvPost = {
					FDCV: this.fdcv,
					SOLICITUD: solicitudbase
				};

				this.fdcvs.postFDCV(this.fdcvPost).subscribe({
					next: (fdcv) => {
						this._snackBar.open('Formulario de devolucion guardado', 'Cerrar', {
							duration: 2000
						});
						this.formSubmit.disable();
						PdfFDCVComponent.createPDF(fdcv, this.vehiculo);
						this.ss.actualizarEstado(this.solicitud.ID_SOLICITUD, 3, ' ').subscribe((solicitud) => {});
						this.router.navigate(['/solicitudes']);
					},
					error: (error) => {
						this.dialog.open(AlertaComponent, {
							data: {
								title: 'Error',
								message: 'No se pudo guardar el formulario de devolución',
								type: 0
							}
						});
					}
				});
			});
		} else {
			this.dialog.open(AlertaComponent, {
				data: {
					title: 'Error',
					message: 'Por favor llene todos los campos requeridos',
					type: 0
				}
			});
		}
	}

	loadFormSubmit() {
		const fechaHoraEntrega = new Date(this.fecv.FECHA_HORA_ENTREGA);
		const horaEntrega = fechaHoraEntrega.toTimeString().split(' ')[0].slice(0, 5);

		const fechaHoraDevolucion = new Date(this.solicitud.FECHA_HORA_DEVOLUCION);
		const horaDevolucion = fechaHoraDevolucion.toTimeString().split(' ')[0].slice(0, 5);

		this.formSubmit = this.fb.group({
			id: [this.solicitud.ID_SOLICITUD, Validators.required],
			nombrePiloto: [this.fecv.NOMBRE_PILOTO, [Validators.required, Validators.maxLength(150)]],
			cargoPiloto: [this.fecv.CARGO_PILOTO, [Validators.required, Validators.maxLength(150)]],
			comision: [this.fecv.COMISION, [Validators.required, Validators.maxLength(150)]],
			tarjetaCirculacion: [BoolToNumber.prototype.transform(this.fecv.TARJETA_CIRCULACION), Validators.required],
			llavesEncendido: [BoolToNumber.prototype.transform(this.fecv.LLAVES_ENCENDIDO), Validators.required],
			llavesGasolina: [BoolToNumber.prototype.transform(this.fecv.LLAVES_GASOLINA), Validators.required],
			llavesLlanta: [BoolToNumber.prototype.transform(this.fecv.LLAVES_LLANTA), Validators.required],
			encendidoMotor: [BoolToNumber.prototype.transform(this.fecv.ENCENDIDO_MOTOR), Validators.required],
			retrovisoresExterior: [BoolToNumber.prototype.transform(this.fecv.RETROVISORES_EXTERIOR), Validators.required],
			retrovisoresInterior: [BoolToNumber.prototype.transform(this.fecv.RETROVISORES_INTERIOR), Validators.required],
			llantaRepuesto: [BoolToNumber.prototype.transform(this.fecv.LLANTA_REPUESTO), Validators.required],
			llaveChuchos: [BoolToNumber.prototype.transform(this.fecv.LLAVE_CHUCHOS), Validators.required],
			tricket: [BoolToNumber.prototype.transform(this.fecv.TRICKET), Validators.required],
			otros: [this.fecv.OTROS, Validators.maxLength(150)],
			silvines: [this.fecv.SILVINES.toString(), Validators.required],
			stops: [this.fecv.STOP.toString(), Validators.required],
			luzRetroceso: [this.fecv.LUZ_RETROCESO.toString(), Validators.required],
			luzEmergencia: [this.fecv.LUZ_EMERGENCIA.toString(), Validators.required],
			condicionesLlanta: [this.fecv.CONDICIONES_LLANTA.toString(), Validators.required],
			limpiaparabrisas: [this.fecv.LIMPIAPARABRISAS.toString(), Validators.required],
			kilometrajeEntrega: [this.fecv.KILOMETRAJE, [Validators.required, Validators.min(0)]],
			nivelCombustibleEntrega: [this.fecv.NIVEL_COMBUSTIBLE, Validators.required],
			facturaSerie: [''],
			noFactura: [''],
			galones: [''],
			precio: [''],
			total: [''],
			fechaLlenado: new FormControl<Date | null>(null),
			observaciones: [this.fecv.OBSERVACIONES, Validators.maxLength(150)],
			fechaEntrega: new FormControl<Date | null>(fechaHoraEntrega, Validators.required),
			horaEntrega: [horaEntrega, Validators.required],
			fechaDevolucion: new FormControl<Date | null>(fechaHoraDevolucion, Validators.required),
			horaDevolucion: [horaDevolucion, Validators.required],
			kilometrajeFinal: [this.fecv.KILOMETRAJE, [Validators.required, Validators.min(0)]],
			combustibleFinal: [this.fecv.NIVEL_COMBUSTIBLE, Validators.required],
			kilometrosRecorridos: [0, [Validators.required, Validators.min(0)]],
			fallaOIncidencia: ['N/A', Validators.maxLength(150)],
			nombreReceptor: ['', [Validators.required, Validators.maxLength(150)]]
		});
	}

	initializeVehicleForm() {
		this.formVehiculo = this.fb.group({
			placa: [null],
			tipo: [null],
			color: [null],
			marca: [null]
		});
	}

	loadFormVehiculo() {
		this.formVehiculo.controls['placa'].setValue(this.vehiculo.PLACA);
		this.formVehiculo.controls['tipo'].setValue(this.vehiculo.TIPO);
		this.formVehiculo.controls['color'].setValue(this.vehiculo.COLOR);
		this.formVehiculo.controls['marca'].setValue(this.vehiculo.MARCA);
	}

	buildFdcv(): FdcvInterface {
		let kilometrosRecorridos =
			this.formSubmit.controls['kilometrajeFinal'].value - this.formSubmit.controls['kilometrajeEntrega'].value;
		// colorcar formato de un solo decimal
		return {
			ID_SOLICITUD: this.formSubmit.controls['id'].value,
			NOMBRE_PILOTO: this.formSubmit.controls['nombrePiloto'].value,
			CARGO_PILOTO: this.formSubmit.controls['cargoPiloto'].value,
			COMISION: this.formSubmit.controls['comision'].value,
			TARJETA_CIRCULACION: this.formSubmit.controls['tarjetaCirculacion'].value,
			LLAVES_ENCENDIDO: this.formSubmit.controls['llavesEncendido'].value,
			LLAVES_GASOLINA: this.formSubmit.controls['llavesGasolina'].value,
			LLAVES_LLANTA: this.formSubmit.controls['llavesLlanta'].value,
			ENCENDIDO_MOTOR: this.formSubmit.controls['encendidoMotor'].value,
			RETROVISORES_EXTERIOR: this.formSubmit.controls['retrovisoresExterior'].value,
			RETROVISORES_INTERIOR: this.formSubmit.controls['retrovisoresInterior'].value,
			LLANTA_REPUESTO: this.formSubmit.controls['llantaRepuesto'].value,
			LLAVE_CHUCHOS: this.formSubmit.controls['llaveChuchos'].value,
			TRICKET: this.formSubmit.controls['tricket'].value,
			OTROS: this.formSubmit.controls['otros'].value,
			SILVINES: this.formSubmit.controls['silvines'].value,
			STOP: this.formSubmit.controls['stops'].value,
			LUZ_RETROCESO: this.formSubmit.controls['luzRetroceso'].value,
			LUZ_EMERGENCIA: this.formSubmit.controls['luzEmergencia'].value,
			CONDICIONES_LLANTA: this.formSubmit.controls['condicionesLlanta'].value,
			LIMPIAPARABRISAS: this.formSubmit.controls['limpiaparabrisas'].value,
			KILOMETRAJE: this.formSubmit.controls['kilometrajeEntrega'].value,
			NIVEL_COMBUSTIBLE: this.formSubmit.controls['nivelCombustibleEntrega'].value,
			OBSERVACIONES_DEVOLUCION: this.formSubmit.controls['observaciones'].value,
			FACTURA_SERIE: this.formSubmit.controls['facturaSerie'].value,
			NO_FACTURA: this.formSubmit.controls['noFactura'].value,
			GALONES: this.formSubmit.controls['galones'].value || null,
			PRECIO: this.formSubmit.controls['precio'].value || null,
			TOTAL: this.formSubmit.controls['total'].value || null,
			FECHA_LLENADO: this.formSubmit.controls['fechaLlenado'].value,
			FECHA_HORA_ENTREGA: this.fs
				.combinarFechaHora(
					this.formSubmit.controls['fechaEntrega'].value,
					this.formSubmit.controls['horaEntrega'].value
				)
				.toJSON(),
			FECHA_HORA_DEVOLUCION: this.fs
				.combinarFechaHora(
					this.formSubmit.controls['fechaDevolucion'].value,
					this.formSubmit.controls['horaDevolucion'].value
				)
				.toJSON(),
			KILOMETRAJE_FINAL: this.formSubmit.controls['kilometrajeFinal'].value,
			NIVEL_COMBUSTIBLE_FINAL: this.formSubmit.controls['combustibleFinal'].value,
			KILOMETROS_RECORRIDOS: KilometrosPipe.prototype.transform(kilometrosRecorridos),
			FALLA_O_INCIDENCIA: this.formSubmit.controls['fallaOIncidencia'].value,
			NOMBRE_RECEPTOR: this.formSubmit.controls['nombreReceptor'].value
		};
	}

	onDateHourChange() {
		const fechaEntrega = this.formSubmit.controls['fechaEntrega'].value;
		const horaEntrega = this.formSubmit.controls['horaEntrega'].value;
		const fechaEntregaValid = this.formSubmit.controls['fechaEntrega'].valid;
		const horaEntregaValid = this.formSubmit.controls['horaEntrega'].valid;

		if (fechaEntrega && horaEntrega && fechaEntregaValid && horaEntregaValid) {
			this.formSubmit.controls['fechaDevolucion'].enable();
			this.formSubmit.controls['fechaDevolucion'].reset();
			this.formSubmit.controls['fechaDevolucion'].setValidators([
				Validators.required,
				Validators.min(this.formSubmit.controls['fechaEntrega'].value)
			]);

			this.formSubmit.controls['horaDevolucion'].enable();
			this.formSubmit.controls['horaDevolucion'].reset();
		} else {
			this.formSubmit.controls['fechaDevolucion'].disable();
			this.formSubmit.controls['horaDevolucion'].disable();
		}
	}

	myDateFilter = (d: Date | null): boolean => {
		const minDate = this.formSubmit.controls['fechaEntrega'].value;
		minDate.setHours(0, 0, 0, 0);

		// Prevent dates before minDate from being selected.
		return d ? d >= minDate : false;
	};

	onDevDateHourChange() {
		const devolucionMoment = this.formSubmit.controls['fechaDevolucion'].value;
		const devolucion = new Date(devolucionMoment);

		const entregaMoment = this.formSubmit.controls['fechaEntrega'].value;
		const entrega = new Date(entregaMoment);

		devolucion.setHours(0, 0, 0, 0);
		entrega.setHours(0, 0, 0, 0);

		if (devolucion.getTime() == entrega.getTime()) {
			this.formSubmit.controls['horaDevolucion'].setValidators([
				Validators.required,
				Validators.min(this.formSubmit.controls['horaEntrega'].value)
			]);
			this.minHoraDevolucion = this.formSubmit.controls['horaEntrega'].value;
			//console.log(this.minHoraDevolucion);
		} else {
			this.formSubmit.controls['horaDevolucion'].setValidators([Validators.required]);
			this.minHoraDevolucion = '0:00';
		}
	}
}
