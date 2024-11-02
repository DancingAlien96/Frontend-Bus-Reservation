import { Component } from '@angular/core';
import { UsuariosTableComponent } from '../../components/usuarios-table/usuarios-table.component';

@Component({
  selector: 'app-usuarios',
	standalone: true,
	imports: [UsuariosTableComponent],
	template: ` <app-usuarios-table></app-usuarios-table> `,
	styles: []
})

export class UsuariosComponent {

}
