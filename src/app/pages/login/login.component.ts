import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../shared/services/login.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UsuarioInterface } from '../../shared/interfaces/usuario.interface';
import { catchError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertaComponent } from '../../components/alerta/alerta.component';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {
	public formSubmit: FormGroup;
	public user!: UsuarioInterface;

	constructor(
		private fb: FormBuilder,
		private loginService: LoginService,
		private _snakBar: MatSnackBar,
		private router: Router,
		private dialog: MatDialog
	) {
		this.formSubmit = this.fb.group({
			USERNAME: [null, Validators.required],
			PASSWORD: [null, [Validators.required]]
		});
	}

	onSubmit() {
		if (this.formSubmit.valid) {
			this.loginService.access(this.formSubmit.value).subscribe({
				next: (res) => {
					if (res) {
						localStorage.setItem('token', res.token);
						localStorage.setItem('usuario', JSON.stringify(res.usuario));
						// Redirigir a 'home'
						this.router.navigate(['/home']);
					}
				},
				error: (error) => {
					if (error.status === 404) {
						this.dialog.open(AlertaComponent, {
							data: {
								title: 'Error',
								message: 'Usuario o contraseña incorrectos',
								type: 0
							}
						});
					} else {
						this.dialog.open(AlertaComponent, {
							data: {
								title: 'Error',
								message: 'Error en el servidor',
								type: 0
							}
						});
					}
				}
			});
		} else {
			this.dialog.open(AlertaComponent, {
				data: {
					title: 'Error',
					message: 'Complete los campos',
					type: 0
				}
			});
		}
	}
}
