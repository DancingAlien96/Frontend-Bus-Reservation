import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../shared/services/login.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CookieService } from 'ngx-cookie-service';
import { UsuarioInterface } from '../../shared/interfaces/usuario.interface';

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

	constructor(private fb: FormBuilder, private loginService: LoginService, private cookies: CookieService) {
		this.formSubmit = this.fb.group({
			USERNAME: [null, Validators.required],
			PASSWORD: [null, [Validators.required]]
		});
	}

	onSubmit() {
		if (this.formSubmit.valid) {
			this.loginService.access(this.formSubmit.value).subscribe((res) => {
				console.log(res);
			   
				sessionStorage.setItem('token', res.token);
				sessionStorage.setItem('usuario', JSON.stringify(res.usuario));

				
			});
		} else {
			
		}
	}
}
