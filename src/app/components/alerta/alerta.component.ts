import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'app-alerta',
	standalone: true,
	imports: [MatDialogContent, MatDialogActions, MatIcon, CommonModule],
	templateUrl: './alerta.component.html',
	styleUrl: './alerta.component.css'
})
export class AlertaComponent {
	/**
	 *
	 * @param message Mensaje a mostrar
	 * @param type Tipo de alerta (0: error, 1: advertencia, 2: información)
	 */
	constructor(
		private dialogRef: MatDialogRef<AlertaComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { message: string; title: string; type: number }
	) {
		this.dialogRef.updateSize('380px', 'auto');
	}

	cerrar(): void {
		this.dialogRef.close(); // Cierra el diálogo
	}

	confirmar(): void {
		this.dialogRef.close(true); // Devuelve true si se confirma
	}

	cancelar(): void {
		this.dialogRef.close(false); // Devuelve false si se cancela
	}
}
