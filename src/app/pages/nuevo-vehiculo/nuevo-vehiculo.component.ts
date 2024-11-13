import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { CombustiblePipe } from '../../shared/pipes/condiciones.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehiculoService } from '../../shared/services/vehiculo.service';
import { FunctionsService } from '../../shared/services/functions.service';
import { Router, RouterLink } from '@angular/router';
import { VehiculoInterface, VehiculoPostInterface } from '../../shared/interfaces';
import { AlertaComponent } from '../../components/alerta/alerta.component';
import { noWhitespaceValidator } from '../../shared/utils/white-space-validator.utils';

@Component({
	selector: 'app-nuevo-vehiculo',
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
		MatDatepickerModule,
		MatNativeDateModule,
		NgxMatTimepickerModule,
		MatDialogModule,
		MatIconModule,
		RouterLink
	],
	templateUrl: './nuevo-vehiculo.component.html',
	styleUrl: './nuevo-vehiculo.component.css'
})
export default class NuevoVehiculoComponent {
	formSubmit!: FormGroup;
	vehiculo!: VehiculoPostInterface;

	constructor(
		private fb: FormBuilder,
		private vs: VehiculoService,
		private _snackBar: MatSnackBar,
		private fs: FunctionsService,
		private router: Router,
		private dialog: MatDialog
	) {
		this.loadFormSubmit();
	}

	loadFormSubmit() {
		this.formSubmit = this.fb.group({
			marca: ['', [Validators.required, Validators.maxLength(50), noWhitespaceValidator()]],
			placa: ['', [Validators.required, Validators.maxLength(10), noWhitespaceValidator()]],
			tipo: ['', [Validators.required, Validators.maxLength(50), noWhitespaceValidator()]],
			color: ['', [Validators.required, Validators.maxLength(50), noWhitespaceValidator()]],
			registroInventario: ['', [Validators.required, Validators.maxLength(50), noWhitespaceValidator()]]
		});
	}

	onSubmit() {
		if (this.formSubmit.valid) {
			const dialogRef = this.dialog.open(AlertaComponent, {
				data: {
					title: '¿Está seguro?',
					message: '¿Está seguro de que desea registrar este vehículo?',
					type: 1
				}
			});

			dialogRef.afterClosed().subscribe((result) => {
				if (!result) return;

				this.vehiculo = {
					MARCA: this.formSubmit.controls['marca'].value,
					PLACA: this.formSubmit.controls['placa'].value,
					TIPO: this.formSubmit.controls['tipo'].value,
					COLOR: this.formSubmit.controls['color'].value,
					REGISTRO_DE_INVENTARIO: this.formSubmit.controls['registroInventario'].value,
					ESTADO: 0
				};

				this.vs.postVehiculo(this.vehiculo).subscribe({
					next: (res) => {
						if (res) {
							this._snackBar.open('Vehículo registrado correctamente', 'Cerrar', {
								duration: 2000
							});
							this.router.navigate(['/vehiculos']);
						}
					},
					error: (err) => {
						this.dialog.open(AlertaComponent, {
							data: {
								title: 'Error',
								message: 'Ha ocurrido un error al registrar el vehículo.',
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
					message: 'Por favor, complete todos los campos requeridos.',
					type: 0
				}
			});
		}
	}
}
