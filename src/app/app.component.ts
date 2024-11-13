import { Component } from '@angular/core';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AuthService } from './shared/services/auth.service';
import { LoginComponent } from './pages/login/login.component';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { LoginService } from './shared/services/login.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [NavigationComponent, LoginComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	title = 'Sistema de gestion de solicitudes de vehiculos universitarios';
	constructor(
		public authService: AuthService,
		private recaptchaV3Service: ReCaptchaV3Service,
		private captchaService: LoginService
	) {}

	public executeImportantAction(): void {
		this.recaptchaV3Service.execute('submit').subscribe((token) => {
			this.sendToken(token);
		});
	}

	sendToken(token: string) {
		this.captchaService.recaptcha(token).subscribe((res) => {});
	}
}
