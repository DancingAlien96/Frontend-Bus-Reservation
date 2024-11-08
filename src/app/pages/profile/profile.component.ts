import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UsuarioInterface } from '../../shared/interfaces';
import { EdadPipe, UsuarioActivoPipe } from '../../shared/pipes/user.pipe';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DateFormatPipe } from '../../shared/pipes/date-time-format.pipe';
import { PopupChangePassComponent } from '../../components/popup-change-pass/popup-change-pass.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [MatCardModule, EdadPipe, CommonModule, UsuarioActivoPipe, MatIconModule, MatButtonModule, DateFormatPipe],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.css'
})
export default class ProfileComponent {
	usuario!: UsuarioInterface;

	constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) {
		const usuarioSession = localStorage.getItem('usuario');

		if (usuarioSession != null) {
			this.usuario = JSON.parse(usuarioSession);
		}
	}

	openDialog() {
		this.dialog.open(PopupChangePassComponent, {
			width: '80%'
		});
	}
}
