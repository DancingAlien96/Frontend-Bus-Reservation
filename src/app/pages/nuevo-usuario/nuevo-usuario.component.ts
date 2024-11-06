import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MY_FORMATS } from '../../shared/utils/date-format.utils';
import { RolInterface, UsuarioPostInterface } from '../../shared/interfaces';
import { RolService } from '../../shared/services/rol.service';
import { UsuariosService } from '../../shared/services/usuarios.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-nuevo-usuario',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		CommonModule,
		ReactiveFormsModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatRadioModule,
		MatSelectModule,
		MatButtonModule,
		MatIconModule,
		NgxMatTimepickerModule,
		MatCardModule,
		MatDividerModule
	],
	templateUrl: './nuevo-usuario.component.html',
	styleUrl: './nuevo-usuario.component.css',
	providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-GT' }, provideMomentDateAdapter(MY_FORMATS), DatePipe]
})
export default class NuevoUsuarioComponent {
	usuario!: UsuarioPostInterface;
	formSubmit: FormGroup;
	roles!: RolInterface[];

	constructor(
		private fb: FormBuilder,
		private rs: RolService,
		private us: UsuariosService,
		private datePipe: DatePipe,
		private router: Router
	) {
		this.rs.getRoles().subscribe((data) => {
			this.roles = data;
		});

		this.formSubmit = this.fb.group({
			username: [null, [Validators.required, Validators.maxLength(50)]],
			correo: [null, [Validators.required, Validators.maxLength(100), Validators.email]],
			nombreCompleto: [null, [Validators.required, Validators.maxLength(150)]],
			cui: [null, [Validators.required, Validators.maxLength(13), Validators.minLength(13)]],
			registroPersonal: [null, [Validators.required, Validators.maxLength(15)]],
			fechaNacimiento: new FormControl<Date | null>(null, Validators.required),
			telefonoUno: [null, [Validators.required, Validators.maxLength(25)]],
			telefonoDos: [null, [Validators.maxLength(25)]],
			idRol: [null, Validators.required]
		});
	}

	onSubmit() {
		if (this.formSubmit.valid) {
			this.buildRequest();

			this.us.postUsuario(this.usuario).subscribe((data) => {
				alert('Usuario creado correctamente');
				this.formSubmit.disable();
				this.router.navigate(['/usuarios']);
			});
		}
	}

	buildRequest() {
		const fechaForm = this.formSubmit.get('fechaNacimiento')?.value;
		const fecha = this.datePipe.transform(fechaForm, 'yyyy-MM-dd');

		this.usuario = {
			USERNAME: this.formSubmit.get('username')?.value,
			CORREO: this.formSubmit.get('correo')?.value,
			NOMBRE_COMPLETO: this.formSubmit.get('nombreCompleto')?.value,
			CUI: this.formSubmit.get('cui')?.value,
			REGISTRO_PERSONAL: this.formSubmit.get('registroPersonal')?.value,
			FECHA_NACIMIENTO: fecha || '',
			TELEFONO_UNO: this.formSubmit.get('telefonoUno')?.value,
			TELEFONO_DOS: this.formSubmit.get('telefonoDos')?.value || '',
			ID_ROL: this.formSubmit.get('idRol')?.value
		};
	}
}
