import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-alerta',
	standalone: true,
	imports: [
		MatDialogContent,
		MatDialogActions,
		MatIcon,
		MatFormFieldModule,
		MatInputModule,
		CommonModule,
		ReactiveFormsModule
	],
	templateUrl: './alerta.component.html',
	styleUrl: './alerta.component.css'
})
export class AlertaComponent {
	formSubmit: FormGroup;

	/**
	 *
	 * @param message Mensaje a mostrar
	 * @param type Tipo de alerta (0: error, 1: advertencia, 2: información, 3: input)
	 */
	constructor(
		private fb: FormBuilder,
		private dialogRef: MatDialogRef<AlertaComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { message: string; title: string; type: number }
	) {
		this.dialogRef.updateSize('380px', 'auto');
		if (this.data.type === 3) this.dialogRef.updateSize('600px', 'auto');

		this.formSubmit = this.fb.group({
			motivo: [null, [Validators.required, Validators.maxLength(250)]]
		});
	}

	cerrar(): void {
		this.dialogRef.close(); // Cierra el diálogo
	}

	confirmar(): void {
		this.dialogRef.close(true); // Devuelve true si se confirma
	}

	guardar(): void {
		if (this.formSubmit.valid) {
			this.dialogRef.close(this.formSubmit.controls['motivo'].value); // Devuelve el motivo si se guarda
		}
	}

	cancelar(): void {
		this.dialogRef.close(false); // Devuelve false si se cancela
	}
}
