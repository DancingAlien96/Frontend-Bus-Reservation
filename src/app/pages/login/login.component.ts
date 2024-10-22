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

	constructor(private fb: FormBuilder, private loginService: LoginService, private _snakBar: MatSnackBar) {
		this.formSubmit = this.fb.group({
			USERNAME: [null, Validators.required],
			PASSWORD: [null, [Validators.required]]
		});
	}

	onSubmit() {
		if (this.formSubmit.valid) {
			this.loginService
				.access(this.formSubmit.value)
				.pipe(
					catchError((error) => {
						if (error.status === 404) {
							this._snakBar.open(error.error.message, 'Cerrar', { duration: 3000 });
						} else {
							this._snakBar.open('Error en el servidor', 'Cerrar', { duration: 3000 });
						}
						return of(null); // Retorna un observable vacío para continuar el flujo
					})
				)
				.subscribe((res) => {
					if (res) {
						sessionStorage.setItem('token', res.token);
						sessionStorage.setItem('usuario', JSON.stringify(res.usuario));
					}
				});
		} else {
		}
	}
}
