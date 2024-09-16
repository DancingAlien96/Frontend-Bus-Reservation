import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SolicitudesService } from '../../shared/services/solicitudes.service';
import { SolicitudesInterfaces } from '../../shared/interfaces/solicitudes.interface';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-admin-table',
	styleUrl: './admin-table.component.css',
	templateUrl: './admin-table.component.html',
	standalone: true,
	imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule]
})
export class AdminTableComponent implements AfterViewInit {
	savedstate: string | null = null;
	displayedColumns: string[] = [
		'ID_SOLICITUD',
		'FECHA_CREACION',
		'FECHA_HORA_ENTREGA',
		'FECHA_HORA_DEVOLUCION',
		'USUARIO.NOMBRE_COMPLETO',
		'ESTADO'
	];
	dataSource!: MatTableDataSource<SolicitudesInterfaces>;

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(private solicitudesService: SolicitudesService, private dialog: MatDialog) {}

	ngAfterViewInit() {
		this.getAllRequest();
	}

	getEstadoLabel(estado: number): string {
		let estadoLabel = '';
		switch (estado) {
			case 0:
				estadoLabel = 'Pendiente';
				break;
			case 1:
				estadoLabel = 'Aprobado';
				break;
			case 2:
				estadoLabel = 'Rechazada';
				break;
			case 3:
				estadoLabel = 'Finalizada';
				break;
			case 4:
				estadoLabel = 'Eliminada';
				break;
			default:
				estadoLabel = 'Desconocido';
		}

		// Aquí guardamos el estado en la variable
		this.savedstate = estadoLabel;
		return estadoLabel;
	}
	getAllRequest() {
		this.solicitudesService.getSolicitudes().subscribe((data) => {
			this.dataSource = new MatTableDataSource(data); // Asigna los datos al dataSource
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
			console.log(data);

			this.dataSource.filterPredicate = (data: SolicitudesInterfaces, filter: string) => {
				let estadoLabel = this.getEstadoLabel(data.ESTADO); // Usa la función que convierte el estado a su label

				const dataStr =
					`${data.ID_SOLICITUD} ${data.FECHA_CREACION} ${data.FECHA_HORA_ENTREGA} ${data.FECHA_HORA_DEVOLUCION} ${data.USUARIO?.NOMBRE_COMPLETO} ${estadoLabel}`.toLowerCase();

				return dataStr.includes(filter.trim().toLowerCase());
			};
		});
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	openDialog(row: SolicitudesInterfaces) {
		//console.log(firstname, id);
		this.dialog.open(PopupComponent, {
			width: '50%',
			data: { id: row.ID_USUARIO, usuario: row.USUARIO.NOMBRE_COMPLETO }
		});
	}
}
