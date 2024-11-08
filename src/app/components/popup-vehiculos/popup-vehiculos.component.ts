import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { BitacoraCondicionesInterface, SolicitudesInterfaces, VehiculoInterface } from '../../shared/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehiculoService } from '../../shared/services/vehiculo.service';
import {
	BoolBuenoMaloPipe,
	BoolSiNoPipe,
	CombustiblePipe,
	NumberBeMeCdPipe
} from '../../shared/pipes/condiciones.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import 'moment/locale/es';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SolicitudesService } from '../../shared/services/solicitudes.service';
import { DateFormatPipe } from '../../shared/pipes/date-time-format.pipe';
import { PopupComponent } from '../popup/popup.component';
import { UsuarioInterface } from '../../shared/interfaces/usuario.interface';
import { MY_FORMATS } from '../../shared/utils/date-format.utils';

@Component({
	selector: 'app-popup-vehiculos',
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
		BoolSiNoPipe,
		BoolBuenoMaloPipe,
		NumberBeMeCdPipe,
		CombustiblePipe,
		MatProgressBarModule,
		MatSliderModule,
		MatDatepickerModule,
		MatNativeDateModule,
		ReactiveFormsModule,
		MatTableModule,
		DateFormatPipe
	],
	templateUrl: './popup-vehiculos.component.html',
	styleUrl: './popup-vehiculos.component.css',
	providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-GT' }, provideMomentDateAdapter(MY_FORMATS), DatePipe]
})
export class PopupVehiculosComponent {
	usuario!: UsuarioInterface;
	formSearch: FormGroup;

	condiciones: BitacoraCondicionesInterface;
	disponibilidad: boolean = false;
	dataSource!: MatTableDataSource<SolicitudesInterfaces>;
	haySolicitudes: boolean = false;
	habilitarMensaje: boolean = false;

	displayedColumns: string[] = ['ID_SOLICITUD', 'FECHA_HORA_ENTREGA', 'FECHA_HORA_DEVOLUCION', 'NOMBRE_SOLICITANTE'];

	@ViewChild(MatSort) sort!: MatSort;
	constructor(
		public dialogRef: MatDialogRef<any>,
		@Inject(MAT_DIALOG_DATA)
		public vehiculo: VehiculoInterface,
		private toast: MatSnackBar,
		private vehiculoService: VehiculoService,
		private solicitudesService: SolicitudesService,
		private dialog: MatDialog,
		private fb: FormBuilder,
		private datePipe: DatePipe
	) {
		this.usuario = JSON.parse(localStorage.getItem('usuario') as string);
		this.condiciones = vehiculo.BITACORA_CONDICIONES;
		this.formSearch = this.fb.group({
			inicio: new FormControl<Date | null>(null, Validators.required),
			fin: new FormControl<Date | null>(null, Validators.required)
		});

		this.formSearch.controls['fin'].disable();
	}

	onDisponibilidad() {
		this.disponibilidad = !this.disponibilidad;
	}

	onBuscarDisponibilidad() {
		this.habilitarMensaje = false;
		if (this.formSearch.valid) {
			const inicio = this.formSearch.value.inicio as Date;
			const fin = this.formSearch.value.fin as Date;

			// Usando DatePipe para formatear las fechas a 'YYYY-MM-DD'
			const inicioFormatted = this.datePipe.transform(inicio, 'yyyy-MM-dd');
			const finFormatted = this.datePipe.transform(fin, 'yyyy-MM-dd');

			this.solicitudesService
				.getSolicitudesByDateAndVehicle(inicioFormatted, finFormatted, this.vehiculo)
				.subscribe((data) => {
					this.dataSource = new MatTableDataSource(data); // Asigna los datos al dataSource
					this.dataSource.sort = this.sort;
					this.haySolicitudes = data.length > 0;
					if (!this.haySolicitudes) {
						this.habilitarMensaje = true;
					}
				});
		}
	}

	openDialog(row: SolicitudesInterfaces) {
		this.dialog.open(PopupComponent, {
			width: '80%',
			data: row
		});
	}

	onDateHourChange() {
		const inicio = this.formSearch.controls['inicio'].value;
		const inicioValid = this.formSearch.controls['inicio'].valid;

		if (inicio && inicioValid) {
			this.formSearch.controls['fin'].enable();
			this.formSearch.controls['fin'].reset();
			this.formSearch.controls['fin'].setValidators([
				Validators.required,
				Validators.min(this.formSearch.controls['inicio'].value)
			]);
		} else {
			this.formSearch.controls['fin'].disable();
		}
	}

	myDateFilter = (d: Date | null): boolean => {
		const minDate = this.formSearch.controls['inicio'].value;
		// Prevent dates before minDate from being selected.
		return d ? d >= minDate : false;
	};
}
