import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { BitacoraCondicionesInterface, VehiculoInterface } from '../../shared/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehiculoService } from '../../shared/services/vehiculo.service';
import {
	BoolBuenoMaloPipe,
	BoolSiNoPipe,
	CombustiblePipe,
	NumberBeMeCdPipe
} from '../../shared/pipes/condiciones.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';

@Component({
	selector: 'app-popup-vehiculos',
	standalone: true,
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatButtonModule,
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
		MatDialogClose,
		RouterModule,
		MatChipsModule,
		MatCardModule,
		MatIcon,
		BoolSiNoPipe,
		BoolBuenoMaloPipe,
		NumberBeMeCdPipe,
		CombustiblePipe,
		MatProgressBarModule,
		MatSliderModule
	],
	templateUrl: './popup-vehiculos.component.html',
	styleUrl: './popup-vehiculos.component.css'
})
export class PopupVehiculosComponent {
	condiciones: BitacoraCondicionesInterface;
	constructor(
		public dialogRef: MatDialogRef<any>,
		@Inject(MAT_DIALOG_DATA)
		public vehiculo: VehiculoInterface,
		private toast: MatSnackBar,
		private vehiculoService: VehiculoService
	) {
		this.condiciones = vehiculo.BITACORA_CONDICIONES;
	}
}
