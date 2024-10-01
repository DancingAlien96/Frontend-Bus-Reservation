import { PdfSolicitudComponent } from './../../shared/pdf/pdf-solicitud/pdf-solicitud.component';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { VehiculoService } from '../../shared/services/vehiculo.service';
import { SolicitudesInterfaces, VehiculoInterface } from '../../shared/interfaces';
import { MatIcon } from '@angular/material/icon';
@Component({
	selector: 'app-popup',
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
		MatIcon
	],
	templateUrl: './popup.component.html',
	styleUrl: './popup.component.css'
})
export class PopupComponent {
	vehiculo!: VehiculoInterface;
	currentPage: number = 1;
	constructor(
		public dialogRef: MatDialogRef<any>,
		@Inject(MAT_DIALOG_DATA)
		public data: SolicitudesInterfaces,
		private toast: MatSnackBar,
		private vehiculoService: VehiculoService
	) {}

	pageAndDetails(pagenumber: number, idVehiculo: number): void {
		this.currentPage = pagenumber;
		this.vehiculoService.getVehiculo(idVehiculo).subscribe((res) => {
			this.vehiculo = res;
			console.log(res);
		});
	}

	page(pagenumber: number): void {
		this.currentPage = pagenumber;
	}

	decline(): void {
		const config = new MatSnackBarConfig();
		config.duration = 3000;
		config.horizontalPosition = 'center';
		config.verticalPosition = 'bottom';
		config.panelClass = 'ErrorSnackBar';
		this.toast.open('solicitud rechazada', 'cerrar', config);
		this.dialogRef.close();
	}
	accept(): void {
		const config = new MatSnackBarConfig();

		config.horizontalPosition = 'center';
		config.verticalPosition = 'bottom';
		config.panelClass = 'OkSnackBar';
		config.duration = 3000;
		this.toast.open('solicitud aceptada', 'cerrar', config);

		this.dialogRef.close();
	}

	onPDF(): void {
		PdfSolicitudComponent.createPDF(this.data);
	}
}
