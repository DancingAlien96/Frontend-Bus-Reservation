import { PersonalService } from './../../shared/services/personal.service';
import { PdfSolicitudComponent } from './../../shared/pdf/pdf-solicitud/pdf-solicitud.component';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { VehiculoService } from '../../shared/services/vehiculo.service';
import { BitacoraCondicionesInterface, SolicitudesInterfaces, VehiculoInterface } from '../../shared/interfaces';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { EstadosInterface } from '../../shared/interfaces/options.interface';
import { CombustiblePipe } from '../../shared/pipes/condiciones.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SolicitudesService } from '../../shared/services/solicitudes.service';
import { DateFormatPipe } from '../../shared/pipes/date-time-format.pipe';
@Component({
	selector: 'app-popup',
	standalone: true,
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatButtonModule,
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
		MatDialogClose,
		RouterModule,
		MatChipsModule,
		MatCardModule,
		MatIcon,
		MatSelectModule,
		CombustiblePipe,
		MatProgressBarModule
	],
	templateUrl: './popup.component.html',
	styleUrl: './popup.component.css',
	providers: [DateFormatPipe]
})
export class PopupComponent {
    usuarioSession:any;
	usuario:any | null = null;
	eSolicitante = false;
	eBoton= false;
	estadoTemporal!:number;
	areaJustificacion = false;
	idUsuario!:number;
	vehiculo?: VehiculoInterface;
	condiciones?: BitacoraCondicionesInterface;
	selected: number = 1;
	estados: EstadosInterface[] = [
		{ id: 0, estado: 'Pendiente' },
		{ id: 1, estado: 'Aprobada' },
		{ id: 2, estado: 'Rechazada' },
		{ id: 3, estado: 'Finalizada' },
		{ id: 4, estado: 'Eliminada' },
		{ id: 5, estado: 'Anulada' },



	];
	currentPage: number = 1;
	constructor(
		public dialogRef: MatDialogRef<any>,
		@Inject(MAT_DIALOG_DATA)
		public data: SolicitudesInterfaces,
		private toast: MatSnackBar,
		private vehiculoService: VehiculoService,
		private personalService: PersonalService,
		private solicitudesService: SolicitudesService,
		private datePipe: DateFormatPipe
	) {

		this.usuarioSession = sessionStorage.getItem('usuario');
		this.usuario = JSON.parse(this.usuarioSession);
		this.idUsuario = this.usuario.ID_USUARIO;
		this.estadoTemporal = data.ESTADO
	}

	pageAndDetails(pagenumber: number, idVehiculo: number): void {
		this.currentPage = pagenumber;

		this.vehiculoService.getVehiculo(idVehiculo).subscribe((res) => {
			this.vehiculo = res;
			this.condiciones = res.BITACORA_CONDICIONES;
		});
	}

	page(pagenumber: number): void {
		this.currentPage = pagenumber;
	}

	save(): void {
		const config = new MatSnackBarConfig();

		config.horizontalPosition = 'center';
		config.verticalPosition = 'bottom';
		config.panelClass = 'OkSnackBar'; //tipo de snackbar
		config.duration = 3000;
		this.toast.open('guardado', 'cerrar', config);

		this.dialogRef.close();
	}
	
	onPDF(): void {
		PdfSolicitudComponent.createPDF(this.data, this.personalService);
	}
   
	changes(event:any){
		this.estadoTemporal = event.value;
		this.eBoton = true;
		if(event.value == 4 || event.value == 5){
           this.areaJustificacion = true;
		}
		else{
			this.areaJustificacion = false;
		}

	}


}
