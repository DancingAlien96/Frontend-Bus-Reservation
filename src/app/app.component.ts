import { Component } from '@angular/core';
import { NavigationComponent } from "./components/navigation/navigation.component";
import { AuthService } from './shared/services/auth.service';
import { LoginComponent } from './pages/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavigationComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pruebas';
  constructor(public authService:AuthService){}


}
