import { VehiculoService } from './../../shared/services/vehiculo.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { VehiculoInterface } from '../../shared/interfaces';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { PopupVehiculosComponent } from '../../components/popup-vehiculos/popup-vehiculos.component';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-vehiculos',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatTabsModule,
		MatCardModule
	],
	templateUrl: './vehiculos.component.html',
	styleUrl: './vehiculos.component.css'
})
export class VehiculosComponent implements AfterViewInit {
	savedstate: string | null = null;
	dataSource!: MatTableDataSource<VehiculoInterface>;
	displayedColumns: string[] = ['ID_VEHICULO', 'PLACA', 'TIPO', 'MARCA', 'COLOR', 'ESTADO'];

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(private vehiculoService: VehiculoService, private dialog: MatDialog) {}

	filterByTab(index: number) {
		switch (index) {
			case 0: // todas
				this.dataSource.filter = '';
				break;
			case 1: // aprobadas
				this.dataSource.filter = 'activo';
				break;
			case 2: // finalizadas
				this.dataSource.filter = 'fuera de servicio';
				break;
			default:
				this.dataSource.filter = '';
				break;
		}
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	getEstadoLabel(estado: number): string {
		let estadoLabel = '';
		switch (estado) {
			case 0:
				estadoLabel = 'Activo';
				break;
			case 1:
				estadoLabel = 'Fuera de Servicio';
				break;
			default:
				estadoLabel = 'Desconocido';
		}

		// Aquí guardamos el estado en la variable
		this.savedstate = estadoLabel;
		return estadoLabel;
	}

	ngAfterViewInit() {
		this.getAllVehiculos();
	}

	getAllVehiculos() {
		this.vehiculoService.getVehiculos().subscribe((data) => {
			this.dataSource = new MatTableDataSource(data); // Asigna los datos al dataSource
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;

			this.dataSource.filterPredicate = (data: VehiculoInterface, filter: string) => {
				let estadoLabel = this.getEstadoLabel(data.ESTADO);

				const dataStr =
					`${data.ID_VEHICULO} ${data.PLACA} ${data.TIPO} ${data.MARCA} ${data.COLOR} ${estadoLabel}`.toLowerCase();

				return dataStr.includes(filter.trim().toLowerCase());
			};
		});
	}

	openDialog(row: VehiculoInterface) {
		this.dialog.open(PopupVehiculosComponent, {
			width: '80%',
			data: row
		});
	}
}
