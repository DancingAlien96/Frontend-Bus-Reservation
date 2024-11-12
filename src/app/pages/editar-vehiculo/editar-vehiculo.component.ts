import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { CombustiblePipe, ToNumberPipe, KilometrosPipe } from '../../shared/pipes/condiciones.pipe';
import {
	BitacoraCondicionesInterface,
	BitacoraCondicionesPostInterface,
	VehiculoInterface
} from '../../shared/interfaces';
import { VehiculoService } from '../../shared/services/vehiculo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FunctionsService } from '../../shared/services/functions.service';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AlertaComponent } from '../../components/alerta/alerta.component';

@Component({
	selector: 'app-editar-vehiculo',
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
		RouterLink,
		MatIconModule
	],
	templateUrl: './editar-vehiculo.component.html',
	styleUrl: './editar-vehiculo.component.css'
})
export default class EditarVehiculoComponent {
	vehiculo!: VehiculoInterface;
	formSubmit!: FormGroup;
	formVehiculo!: FormGroup;
	condiciones!: BitacoraCondicionesPostInterface;

	constructor(
		private fb: FormBuilder,
		private vs: VehiculoService,
		private _snackBar: MatSnackBar,
		private fs: FunctionsService,
		private router: Router,
		private dialog: MatDialog
	) {
		const navigation = this.router.getCurrentNavigation();
		if (navigation?.extras.state && navigation.extras.state['vehiculo']) {
			this.vehiculo = navigation.extras.state['vehiculo'];

			this.loadFormSubmit();
			this.loadFormVehiculo();
		}
	}

	loadFormSubmit() {
		this.formSubmit = this.fb.group({
			idVehiculo: [this.vehiculo.ID_VEHICULO, Validators.required],
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
			kilometraje: [this.vehiculo.BITACORA_CONDICIONES.KILOMETRAJE, Validators.required],
			nivelCombustible: ['1', Validators.required],
			observaciones: ['N/A', Validators.maxLength(150)]
		});
	}

	loadFormVehiculo() {
		this.formVehiculo = this.fb.group({
			placa: [this.vehiculo.PLACA],
			tipo: [this.vehiculo.TIPO],
			color: [this.vehiculo.COLOR],
			marca: [this.vehiculo.MARCA]
		});
	}

	buildBitacoraCondiciones(): BitacoraCondicionesPostInterface {
		return {
			ID_VEHICULO: this.vehiculo.BITACORA_CONDICIONES.ID_VEHICULO,
			ID_FECV: null,
			ID_FDCV: null,
			TARJETA_CIRCULACION: this.formSubmit.controls['tarjetaCirculacion'].value === '1',
			LLAVES_ENCENDIDO: this.formSubmit.controls['llavesEncendido'].value === '1',
			LLAVES_GASOLINA: this.formSubmit.controls['llavesGasolina'].value === '1',
			LLAVES_LLANTA: this.formSubmit.controls['llavesLlanta'].value === '1',
			ENCENDIDO_MOTOR: this.formSubmit.controls['encendidoMotor'].value === '1',
			RETROVISORES_EXTERIOR: this.formSubmit.controls['retrovisoresExterior'].value === '1',
			RETROVISORES_INTERIOR: this.formSubmit.controls['retrovisoresInterior'].value === '1',
			LLANTA_REPUESTO: this.formSubmit.controls['llantaRepuesto'].value === '1',
			LLAVE_CHUCHOS: this.formSubmit.controls['llaveChuchos'].value === '1',
			TRICKET: this.formSubmit.controls['tricket'].value === '1',
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
			FECHA_HORA_BITACORA: new Date()
		};
	}

	onSubmit() {
		if (this.formSubmit.valid) {
			const dialogRef = this.dialog.open(AlertaComponent, {
				data: {
					title: 'Advertencia',
					message: '¿Está seguro de actualizar la bitácora de condiciones?',
					type: 1
				}
			});

			dialogRef.afterClosed().subscribe((result) => {
				if (!result) return;

				this.condiciones = this.buildBitacoraCondiciones();
				this.vs.updateBitacoraCondiciones(this.condiciones).subscribe({
					next: (res) => {
						if (res) {
							this._snackBar.open('Bitácora de condiciones actualizada', 'Cerrar', {
								duration: 3000
							});
							this.router.navigate(['/vehiculos']);
						}
					},
					error: (err) => {
						this.dialog.open(AlertaComponent, {
							data: {
								title: 'Error',
								message: 'No se pudo actualizar la bitácora de condiciones',
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
					message: 'Favor de llenar todos los campos',
					type: 0
				}
			});
		}
	}
}
