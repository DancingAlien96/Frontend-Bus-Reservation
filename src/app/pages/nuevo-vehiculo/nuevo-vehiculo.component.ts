import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
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
		CombustiblePipe,
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
		private router: Router
	) {
		this.loadFormSubmit();
	}

	loadFormSubmit() {
		this.formSubmit = this.fb.group({
			marca: ['', [Validators.required, Validators.maxLength(50)]],
			placa: ['', [Validators.required, Validators.maxLength(10)]],
			tipo: ['', [Validators.required, Validators.maxLength(50)]],
			color: ['', [Validators.required, Validators.maxLength(50)]],
			registroInventario: ['', [Validators.required, Validators.maxLength(50)]]
		});
	}

	onSubmit() {
		if (this.formSubmit.valid) {
			this.vehiculo = {
				MARCA: this.formSubmit.controls['marca'].value,
				PLACA: this.formSubmit.controls['placa'].value,
				TIPO: this.formSubmit.controls['tipo'].value,
				COLOR: this.formSubmit.controls['color'].value,
				REGISTRO_DE_INVENTARIO: this.formSubmit.controls['registroInventario'].value,
				ESTADO: 0
			};

			this.vs.postVehiculo(this.vehiculo).subscribe((res) => {
				if (res) {
					this._snackBar.open('Vehículo registrado correctamente', 'Cerrar', {
						duration: 2000
					});
					this.router.navigate(['/vehiculos']);
				}
			});
		}
	}
}
