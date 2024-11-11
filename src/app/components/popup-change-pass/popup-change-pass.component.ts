import { UsuarioNewPasswordInterface, UsuarioInterface } from './../../shared/interfaces/usuario.interface';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
	MatDialogTitle,
	MatDialogContent,
	MatDialogActions,
	MatDialogClose,
	MatDialog
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { UsuariosService } from '../../shared/services/usuarios.service';
import { AlertaComponent } from '../alerta/alerta.component';

@Component({
	selector: 'app-popup-change-pass',
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
		MatCardModule,
		MatIcon,
		ReactiveFormsModule,
		MatButtonModule
	],
	templateUrl: './popup-change-pass.component.html',
	styleUrl: './popup-change-pass.component.css'
})
export class PopupChangePassComponent {
	formSubmit: FormGroup;
	newUserInfo!: UsuarioNewPasswordInterface;
	hideOld = true;
	hideNew = true;
	usuario!: UsuarioInterface;

	constructor(private fb: FormBuilder, private us: UsuariosService, private dialog: MatDialog) {
		const usuarioSession = localStorage.getItem('usuario');

		if (usuarioSession) {
			this.usuario = JSON.parse(usuarioSession);
		}

		this.formSubmit = this.fb.group({
			oldPassword: [null, [Validators.required]],
			newPassword: [null, [Validators.required, Validators.minLength(8)]]
		});
	}

	onSubmit() {
		if (this.formSubmit.valid) {
			this.newUserInfo = {
				USERNAME: this.usuario.USERNAME,
				PASSWORD: this.formSubmit.controls['oldPassword'].value,
				NEW_PASSWORD: this.formSubmit.controls['newPassword'].value
			};

			this.us.patchChangePassword(this.newUserInfo).subscribe({
				next: (data) => {
					localStorage.removeItem('usuario');
					localStorage.setItem('usuario', JSON.stringify(data));
					const dialogRef = this.dialog.open(AlertaComponent, {
						width: '400px',
						data: {
							title: 'Exitoso',
							message: 'Contraseña cambiada correctamente',
							type: 2
						}
					});

					dialogRef.afterClosed().subscribe((result) => {
						window.location.reload();
					});
				},
				error: (error) => {
					this.dialog.open(AlertaComponent, {
						width: '400px',
						data: {
							title: 'Error',
							message: 'Algo ha salido mal, por favor intente de nuevo',
							type: 0
						}
					});
				}
			});
		} else {
			this.dialog.open(AlertaComponent, {
				width: '400px',
				data: {
					title: 'Error',
					message: 'Por favor, llene todos los campos',
					type: 0
				}
			});
		}
	}
}
