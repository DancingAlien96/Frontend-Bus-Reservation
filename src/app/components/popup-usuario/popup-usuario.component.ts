import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogTitle
} from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
	BoolBuenoMaloPipe,
	BoolSiNoPipe,
	CombustiblePipe,
	NumberBeMeCdPipe
} from '../../shared/pipes/condiciones.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { DateFormatPipe } from '../../shared/pipes/date-time-format.pipe';
import { UsuariosService } from '../../shared/services/usuarios.service';
import { UsuarioInterface } from '../../shared/interfaces';
import { EdadPipe, UsuarioActivoPipe } from '../../shared/pipes/user.pipe';

@Component({
	selector: 'app-popup-usuario',
	standalone: true,
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatButtonModule,
		MatDialogContent,
		MatDialogActions,
		MatDialogClose,
		RouterModule,
		MatChipsModule,
		MatCardModule,
		MatIcon,
		MatProgressBarModule,
		MatSliderModule,
		MatDatepickerModule,
		MatNativeDateModule,
		ReactiveFormsModule,
		MatTableModule,
		EdadPipe,
		UsuarioActivoPipe
	],
	templateUrl: './popup-usuario.component.html',
	styleUrl: './popup-usuario.component.css'
})
export class PopupUsuarioComponent {
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public usuario: UsuarioInterface,
		private usuariosService: UsuariosService
	) {}

	onActivate(user: UsuarioInterface) {
		this.usuariosService.patchActivarDesactivarUsuario(user.ID_USUARIO).subscribe((data) => {
			this.usuario = data;
			this.usuariosService.emitUpdate();
		});
	}

	onReset(user: UsuarioInterface) {
		this.usuariosService.patchResetPassword(user.ID_USUARIO).subscribe((data) => {
			alert(data.NEW_PASSWORD);
			this.usuariosService.emitUpdate();
		});
	}
}
