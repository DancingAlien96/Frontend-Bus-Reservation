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

@Component({
	selector: 'app-popup',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatButtonModule,
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
		MatDialogClose
	],
	templateUrl: './popup.component.html',
	styleUrl: './popup.component.css'
})
export class PopupComponent {
	constructor(
		public dialogRef: MatDialogRef<any>,
		@Inject(MAT_DIALOG_DATA) public data: { id: number; usuario: string },
		private toast: MatSnackBar
	) {}

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
}
