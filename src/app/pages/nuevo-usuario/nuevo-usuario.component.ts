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
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertaComponent } from '../../components/alerta/alerta.component';

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
		MatDividerModule,
		RouterLink
	],
	templateUrl: './nuevo-usuario.component.html',
	styleUrl: './nuevo-usuario.component.css',
	providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-GT' }, provideMomentDateAdapter(MY_FORMATS), DatePipe]
})
export default class NuevoUsuarioComponent {
	usuario!: UsuarioPostInterface;
	formSubmit: FormGroup;
	roles!: RolInterface[];
	maxDate!: Date;

	constructor(
		private fb: FormBuilder,
		private rs: RolService,
		private us: UsuariosService,
		private datePipe: DatePipe,
		private router: Router,
		private dialog: MatDialog
	) {
		this.rs.getRoles().subscribe((data) => {
			this.roles = data;

		});

		this.formSubmit = this.fb.group({
			correo: [null, [Validators.required, Validators.maxLength(100), Validators.email]],
			nombreCompleto: [
				null,
				[
					Validators.required,
					Validators.maxLength(150),
					Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ'']+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñ'']+)+$/)

				]
			],
			cui: [null, [Validators.required, Validators.maxLength(13), Validators.minLength(13), Validators.min(0),
				Validators.pattern(/^[0-9]+$/) // Solo permite números
			]],
			registroPersonal: [null, [Validators.required, Validators.maxLength(15)]],
			fechaNacimiento: new FormControl<Date | null>(null, Validators.required),
			telefonoUno: [null, [Validators.required, Validators.maxLength(25), Validators.pattern(/^[0-9+\-\s()]*$/)]],
			telefonoDos: [null, [Validators.maxLength(25), Validators.pattern(/^[0-9+\-\s()]*$/)]],
			idRol: [null, Validators.required]
		});

		const today = new Date();
		this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
	}

	onSubmit() {
		this.formSubmit.controls['telefonoUno'].setValue(this.formSubmit.controls['telefonoUno'].value.trim());

		if (this.formSubmit.valid) {
			const dialogRef = this.dialog.open(AlertaComponent, {
				data: {
					title: 'Advertencias',
					message: '¿Desea crear el usuario?',
					type: 1
				}
			});

			dialogRef.afterClosed().subscribe((result) => {
				if (!result) return;

				this.buildRequest();

				this.us.postUsuario(this.usuario).subscribe({
					next: (data) => {
						const dialogRef = this.dialog.open(AlertaComponent, {
							data: {
								title: 'Usuario creado',
								message: `El usuario ${data.USERNAME} ha sido creado exitosamente.`,
								type: 2
							}
						});
						this.formSubmit.disable();
						dialogRef.afterClosed().subscribe(() => {
							this.router.navigate(['/usuarios']);
						});
					},
					error: (error) => {
						this.dialog.open(AlertaComponent, {
							data: {
								title: 'Error',
								message: 'Ha ocurrido un error al crear el usuario.',
								type: 0
							}
						});
					}
				});
			});
		} else {
			this.dialog.open(AlertaComponent, {
				data: {
					title: 'Error',
					message: 'Por favor, llene todos los campos requeridos.',
					type: 0
				}
			});
		}
	}
	validateNumberInput(event: KeyboardEvent): void {
		const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
		const key = event.key;
	  
		// Permite solo números y teclas de navegación
		if (!/^[0-9]$/.test(key) && !allowedKeys.includes(key)) {
		  event.preventDefault();
		}
	  }
	  
	buildRequest() {
		const fechaForm = this.formSubmit.get('fechaNacimiento')?.value;
		const fecha = this.datePipe.transform(fechaForm, 'yyyy-MM-dd');

		this.usuario = {
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
