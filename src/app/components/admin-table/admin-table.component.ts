import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SolicitudesService } from '../../shared/services/solicitudes.service';
import { SolicitudesInterfaces } from '../../shared/interfaces/solicitudes.interface';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { PaginatorService } from '../../shared/services/paginator.service';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
	providers: [
		{ provide: MatPaginatorIntl, useClass: PaginatorService }, // Proveedor personalizado
	  ],
	selector: 'app-admin-table',
	styleUrl: './admin-table.component.css',
	templateUrl: './admin-table.component.html',
	standalone: true,
	imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatTabsModule]
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

	filterByTab(index: number) {
		switch(index) {
		  case 0: // todas
			this.dataSource.filter = '';
			break;
		  case 1: // aprobadas
			this.dataSource.filter = 'aprobada';
			break;
		  case 2: // finalizadas
			this.dataSource.filter = 'finalizada';
			break;
		  case 3: // pendientes
			this.dataSource.filter = 'pendiente';
			break;
		  case 4: // rechazadas
			this.dataSource.filter = 'rechazada';
			break;
		 case 5: //eliminadas
			this.dataSource.filter = 'eliminada';
			break;
		  default:
			this.dataSource.filter = '';
			break;
		}
	  }
	

	getEstadoLabel(estado: number): string {
		let estadoLabel = '';
		switch (estado) {
			case 0:
				estadoLabel = 'Pendiente';
				break;
			case 1:
				estadoLabel = 'Aprobada';
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
			//console.log(data);

			this.dataSource.filterPredicate = (data: SolicitudesInterfaces, filter: string) => {
				let estadoLabel = this.getEstadoLabel(data.ESTADO); 

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

	openDialog(row:SolicitudesInterfaces) {


		this.dialog.open(PopupComponent, {
			width: '80%',
			data: {
			ID_SOLICITUD: row.ID_SOLICITUD,
			ID_VEHICULO :row.ID_VEHICULO, 
			DESTINO: row.DESTINO,
			DILIGENCIA: row.DILIGENCIA,
			FECHA_CREACION: row.FECHA_CREACION,
			FECHA_HORA_ENTREGA: row.FECHA_HORA_ENTREGA,
			FECHA_HORA_DEVOLUCION: row.FECHA_HORA_DEVOLUCION,
			CON_PILOTO: row.CON_PILOTO,
			NOMBRE_PILOTO: row.NOMBRE_PILOTO,
			ESTADO: row.ESTADO,
			MODIFICABLE: row.MODIFICABLE,
			MOTIVO_RECHAZO: row.MOTIVO_RECHAZO,
			ENTREGADO: row.ENTREGADO,
			DEVUELTO: row.DEVUELTO,
			ID_USUARIO: row.ID_USUARIO 
			 

			 }
		});
	}
}
