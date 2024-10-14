import { Component } from '@angular/core';
import { SolicitudesTableComponent } from '../../components/solicitudes-table/solicitudes-table.component';

@Component({
	selector: 'app-solicitudes',
	standalone: true,
	imports: [SolicitudesTableComponent],
	template: ` <app-solicitudes-table></app-solicitudes-table> `,
	styles: []
})
export class SolicitudesComponent {}
