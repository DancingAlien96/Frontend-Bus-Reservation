import { FecvInterface, FecvPostInterface } from './../../shared/interfaces/fecv.interface';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { SolicitudBaseInterface, SolicitudesInterfaces, VehiculoInterface } from '../../shared/interfaces';
import { VehiculoService } from '../../shared/services/vehiculo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { CombustiblePipe } from '../../shared/pipes/condiciones.pipe';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { FecvService } from '../../shared/services/fecv.service';
import { FunctionsService } from '../../shared/services/functions.service';
import { MY_FORMATS } from '../../shared/utils/date-format.utils';
import { PdfFECVComponent } from '../../shared/pdf/pdf-fecv.component';

@Component({
	selector: 'app-formulario-entrega',
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
		MatDialogModule
	],
	templateUrl: './formulario-entrega.component.html',
	styleUrl: './formulario-entrega.component.css',
	providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-GT' }, provideMomentDateAdapter(MY_FORMATS)]
})
export default class FormularioEntregaComponent {
	vehiculo!: VehiculoInterface;
	solicitud!: SolicitudesInterfaces;
	formSubmit!: FormGroup;
	formVehiculo!: FormGroup;
	fecv!: FecvInterface;
	fecvPost!: FecvPostInterface;

	constructor(
		private fb: FormBuilder,
		private vs: VehiculoService,
		private fecvs: FecvService,
		private _snackBar: MatSnackBar,
		private route: ActivatedRoute,
		private fs: FunctionsService,
		private router: Router
	) {
		const navigation = this.router.getCurrentNavigation();
		if (navigation?.extras.state && navigation.extras.state['solicitud']) {
			this.solicitud = navigation.extras.state['solicitud'];
			this.loadFormSubmit();
			this.initializeVehicleForm();
			this.vs.getVehiculo(this.solicitud.ID_VEHICULO).subscribe((vehiculo) => {
				this.vehiculo = vehiculo;
				this.loadFormVehiculo();
			});
		}
	}

	onSubmit() {
		if (this.formSubmit.valid) {
			this.fecv = this.buildFecv();
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
			this.fecvPost = {
				FECV: this.fecv,
				SOLICITUD: solicitudbase
			};

			this.fecvs.postFECV(this.fecvPost).subscribe((fecv) => {
				this.formSubmit.disable();
				this._snackBar.open('Formulario de entrega guardado', 'Cerrar', {
					duration: 2000
				});
				PdfFECVComponent.createPDF(fecv, this.vehiculo);
				this.router.navigate(['/solicitudes']);
			});
		}
	}

	loadFormSubmit() {
		const fechaHoraEntrega = new Date(this.solicitud.FECHA_HORA_ENTREGA);
		const horaEntrega = fechaHoraEntrega.toTimeString().split(' ')[0].slice(0, 5);

		this.formSubmit = this.fb.group({
			id: [this.solicitud.ID_SOLICITUD, Validators.required],
			nombrePiloto: [this.solicitud.NOMBRE_PILOTO, [Validators.required, Validators.maxLength(150)]],
			cargoPiloto: ['Piloto', [Validators.required, Validators.maxLength(150)]],
			comision: [this.solicitud.DILIGENCIA, [Validators.required, Validators.maxLength(150)]],
			tarjetaCirculacion: ['1', Validators.required],
			llavesEncendido: ['1', Validators.required],
			llavesGasolina: ['1', Validators.required],
			llavesLlanta: ['1', Validators.required],
			encendidoMotor: ['1', Validators.required],
			retrovisoresExterior: ['1', Validators.required],
			retrovisoresInterior: ['1', Validators.required],
			llantaRepuesto: ['1', Validators.required],
			llaveChuchos: ['1', Validators.required],
			tricket: ['1', Validators.required],
			otros: ['N/A', Validators.maxLength(150)],
			silvines: ['1', Validators.required],
			stops: ['1', Validators.required],
			luzRetroceso: ['1', Validators.required],
			luzEmergencia: ['1', Validators.required],
			condicionesLlanta: ['1', Validators.required],
			limpiaparabrisas: ['1', Validators.required],
			kilometraje: [null, Validators.required],
			nivelCombustible: ['1', Validators.required],
			observaciones: ['N/A', Validators.maxLength(150)],
			fecha: new FormControl<Date | null>(fechaHoraEntrega, Validators.required),
			horaEntrega: [horaEntrega, Validators.required]
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
		this.formSubmit.controls['kilometraje'].setValue(this.vehiculo.BITACORA_CONDICIONES.KILOMETRAJE);
	}

	buildFecv(): FecvInterface {
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
			KILOMETRAJE: this.formSubmit.controls['kilometraje'].value,
			NIVEL_COMBUSTIBLE: this.formSubmit.controls['nivelCombustible'].value,
			OBSERVACIONES: this.formSubmit.controls['observaciones'].value,
			FECHA_HORA_ENTREGA: this.fs
				.combinarFechaHora(this.formSubmit.controls['fecha'].value, this.formSubmit.controls['horaEntrega'].value)
				.toJSON()
		};
	}
}
