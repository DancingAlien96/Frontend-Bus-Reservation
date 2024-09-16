import { Component } from '@angular/core';
import { AdminTableComponent } from '../../components/admin-table/admin-table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AdminTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
