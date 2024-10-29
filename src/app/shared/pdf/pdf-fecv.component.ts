import { EstadoPipe, CombustiblePipe } from './../pipes/condiciones.pipe';
import { Component } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { FecvInterface, VehiculoInterface } from '../interfaces';
import { DateFormatPipe, TimeFormatPipe } from '../pipes/date-time-format.pipe';
import { ImageUtils } from './image-utils';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-pdf-fecv',
	standalone: true,
	imports: [],
	template: '',
	styles: ''
})
export class PdfFECVComponent {
	static datePipe = new DatePipe('es');
	static estadoPipe = new EstadoPipe();
	static combustiblePipe = new CombustiblePipe();
	constructor() {}

	static async createPDF(fecv: FecvInterface, vehiculo: VehiculoInterface) {
		const logoDataURL = await ImageUtils.getBase64ImageFromURL('../../../assets/logo-usac-bn.jpg');

		const pdfDefinition: any = {
			info: {
				title: `FECV-${(fecv.ID_SOLICITUD || 0).toString().padStart(2, '0')}`
			},
			pageSize: 'LETTER',
			content: [
				{
					columns: [
						// Columna 1: Imagen del logo a la izquierda
						{
							image: logoDataURL,
							width: 50,
							height: 50
						},
						{
							text: '\nUNIVERSIDAD DE SAN CARLOS DE GUATEMALA\nCENTRO UNIVERSITARIO DE ORIENTE\nFORMULARIO PARA ENTREGA Y CONTROL DE VEHÍCULOS',
							style: 'header',
							alignment: 'center'
						},
						{
							text: `FECV-${(fecv.ID_SOLICITUD || 0).toString().padStart(2, '0')}`,
							width: 50,
							height: 50,
							alignment: 'right',
							color: 'gray'
						}
					]
				},
				{
					text: 'POR SU SEGURIDAD SÍRVASE LLENAR EL SIGUIENTE FORMULARIO, NO OLVIDANDO QUE PREVIAMENTE A EMPRENDER SU RECORRIDO, VISITE UNA ESTACION DE SERVICIO Y VIGILE LOS SIGUIENTES ASPECTOS: NIVEL DE ACEITE, AGUA, LIQUIDO DE FRENOS, CALIBRAR LLANTAS, TODO LO CUAL ES NECESARIO PARA SALVAGUARDAR SU INTEGRIDAD FÍSICA Y DE SUS ACOMPAÑANTES, ADEMAS DE CUIDAR EL ACTIVO DE LA INSTITUCIÓN.',
					style: 'subheader',
					alignment: 'justify'
				},
				{
					text: '\nDATOS DEL VEHÍCULO:\n\n',
					style: 'sectionHeader',
					alignment: 'center'
				},
				{
					columns: [
						{ text: 'TIPO: ' + vehiculo.TIPO, style: 'field' },
						{ text: 'COLOR: ' + vehiculo.COLOR, style: 'field' },
						{ text: 'MARCA: ' + vehiculo.MARCA, style: 'field' },
						{ text: 'PLACA: ' + vehiculo.PLACA, style: 'field' }
					]
				},
				{
					text: '\nREGISTRO DE INVENTARIO NO. ' + vehiculo.REGISTRO_DE_INVENTARIO + '\n\n',
					style: 'field'
				},
				{
					style: 'tableExample',
					table: {
						widths: [255, 255],
						body: [
							[
								[
									{
										text: 'I. DATOS GENERALES',
										style: 'sectionHeader'
									},

									{ text: 'NO. EMISIÓN: ' + fecv.ID_SOLICITUD, style: 'field' },
									{ text: 'NOMBRE DEL CONDUCTOR: ' + fecv.NOMBRE_PILOTO, style: 'field' },

									{ text: 'CARGO QUE OCUPA: ' + fecv.CARGO_PILOTO, style: 'field' },
									{
										text: 'COMISIÓN: ' + fecv.COMISION,
										style: 'field'
									},

									{
										text: 'FECHA: ' + this.datePipe.transform(fecv.FECHA_HORA_ENTREGA, 'dd/MM/yyyy'),
										style: 'field',
										margin: [0, 5, 0, 10]
									},
									{
										text: 'II. DOCUMENTOS DEL VEHÍCULO',
										style: 'sectionHeader'
									},
									{
										columns: [
											{ width: 150, text: 'TARJETA DE CIRCULACIÓN:', style: 'field' },

											{
												columns: [
													{ text: 'Si', style: 'option', width: 'auto' },
													{
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: fecv.TARJETA_CIRCULACION ? 'black' : 'white'
															}
														],
														width: '*',
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											},

											{
												columns: [
													{ text: 'No', style: 'option', width: 'auto' },
													{
														width: '*',
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: !fecv.TARJETA_CIRCULACION ? 'black' : 'white'
															}
														],
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											}
										]
									},
									{
										columns: [{ text: 'LLAVES:', style: 'subSectionHeader' }]
									},
									{
										columns: [
											{ width: 150, text: 'LLAVES DE ENCENDIDO DE MOTOR:', style: 'field' },
											{
												columns: [
													{ text: 'Si', style: 'option', width: 'auto' },
													{
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: fecv.LLAVES_ENCENDIDO ? 'black' : 'white'
															}
														],
														width: '*',
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											},

											{
												columns: [
													{ text: 'No', style: 'option', width: 'auto' },
													{
														width: '*',
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: !fecv.LLAVES_ENCENDIDO ? 'black' : 'white'
															}
														],
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											}
										]
									},
									{
										columns: [
											{ width: 150, text: 'LLAVES DE TANQUE DE GASOLINA:', style: 'field' },
											{
												columns: [
													{ text: 'Si', style: 'option', width: 'auto' },
													{
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: fecv.LLAVES_GASOLINA ? 'black' : 'white'
															}
														],
														width: '*',
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											},

											{
												columns: [
													{ text: 'No', style: 'option', width: 'auto' },
													{
														width: '*',
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: !fecv.LLAVES_GASOLINA ? 'black' : 'white'
															}
														],
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											}
										]
									},
									{
										columns: [
											{ width: 150, text: 'LLAVES DE LLANTA DE REPUESTO:', style: 'field' },
											{
												columns: [
													{ text: 'Si', style: 'option', width: 'auto' },
													{
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: fecv.LLAVES_LLANTA ? 'black' : 'white'
															}
														],
														width: '*',
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											},

											{
												columns: [
													{ text: 'No', style: 'option', width: 'auto' },
													{
														width: '*',
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: !fecv.LLAVES_LLANTA ? 'black' : 'white'
															}
														],
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											}
										],
										margin: [0, 0, 0, 10]
									},
									{
										text: 'III. CONDICIONES DEL VEHÍCULO',
										style: 'sectionHeader'
									},
									{ text: 'MOTOR:', style: 'subSectionHeader' },
									{
										columns: [
											{ width: 150, text: 'ENCENDIDO:', style: 'field' },
											{
												columns: [
													{ text: 'Bueno', style: 'option', width: 'auto' },
													{
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: fecv.ENCENDIDO_MOTOR ? 'black' : 'white'
															}
														],
														width: '*',
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											},

											{
												columns: [
													{ text: 'Lento', style: 'option', width: 'auto' },
													{
														width: '*',
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: !fecv.ENCENDIDO_MOTOR ? 'black' : 'white'
															}
														],
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											}
										]
									},
									{ text: 'RETROVISORES:', style: 'subSectionHeader' },

									{
										columns: [
											{ width: 150, text: 'EXTERIORES:', style: 'field' },
											{
												columns: [
													{ text: 'Si', style: 'option', width: 'auto' },
													{
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: fecv.RETROVISORES_EXTERIOR ? 'black' : 'white'
															}
														],
														width: '*',
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											},

											{
												columns: [
													{ text: 'No', style: 'option', width: 'auto' },
													{
														width: '*',
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: !fecv.RETROVISORES_EXTERIOR ? 'black' : 'white'
															}
														],
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											}
										]
									},

									{
										columns: [
											{ width: 150, text: 'INTERIORES:', style: 'field' },
											{
												columns: [
													{ text: 'Si', style: 'option', width: 'auto' },
													{
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: fecv.RETROVISORES_INTERIOR ? 'black' : 'white'
															}
														],
														width: '*',
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											},

											{
												columns: [
													{ text: 'No', style: 'option', width: 'auto' },
													{
														width: '*',
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: !fecv.RETROVISORES_INTERIOR ? 'black' : 'white'
															}
														],
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											}
										]
									},
									{ text: 'ACCESORIOS:', style: 'subSectionHeader' },
									{
										columns: [
											{ width: 150, text: 'LLANTA DE REPUESTO:', style: 'field' },
											{
												columns: [
													{ text: 'Si', style: 'option', width: 'auto' },
													{
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: fecv.LLANTA_REPUESTO ? 'black' : 'white'
															}
														],
														width: '*',
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											},

											{
												columns: [
													{ text: 'No', style: 'option', width: 'auto' },
													{
														width: '*',
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: !fecv.LLANTA_REPUESTO ? 'black' : 'white'
															}
														],
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											}
										]
									},
									{
										columns: [
											{ width: 150, text: 'LLAVE DE CHUCHOS:', style: 'field' },
											{
												columns: [
													{ text: 'Si', style: 'option', width: 'auto' },
													{
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: fecv.LLAVE_CHUCHOS ? 'black' : 'white'
															}
														],
														width: '*',
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											},

											{
												columns: [
													{ text: 'No', style: 'option', width: 'auto' },
													{
														width: '*',
														canvas: [
															{
																type: 'rect',
																x: 0,
																y: 1,
																w: 6, // Ancho del rectángulo
																h: 6, // Alto del rectángulo
																r: 2, // Radio de las esquinas (para bordes redondeados)
																lineColor: 'black',
																color: !fecv.LLAVE_CHUCHOS ? 'black' : 'white'
															}
														],
														margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
													}
												]
											}
										]
									},
									{
										text: 'LUCES:',
										style: 'subSectionHeader'
									},
									{
										columns: [
											{ width: 150, text: 'CONDICIONES SILVINES:', style: 'field' },
											{ text: this.estadoPipe.transform(fecv.SILVINES), style: 'value' }
										]
									},
									{
										columns: [
											{ width: 150, text: 'CONDICIONES STOPS:', style: 'field' },
											{ text: this.estadoPipe.transform(fecv.STOP), style: 'value' }
										]
									},
									{
										columns: [
											{ width: 150, text: 'CONDICIONES DE LUZ DE RETROCESO:', style: 'field' },
											{ text: this.estadoPipe.transform(fecv.LUZ_RETROCESO), style: 'value' }
										]
									},
									{
										columns: [
											{ width: 150, text: 'CONDICIONES DE LUZ DE EMERGENCIA:', style: 'field' },
											{ text: this.estadoPipe.transform(fecv.LUZ_EMERGENCIA), style: 'value' }
										]
									},
									{
										columns: [
											{ text: 'BE: Buen Estado', style: 'note' },
											{ text: 'Me: Mal Estado', style: 'note' },
											{ text: 'CD: Con daños', style: 'note' }
										],
										margin: [0, 20, 0, 0],
										alignment: 'center'
									}
								],
								[
									{
										text: 'OTRAS',
										style: 'subSectionHeader'
									},
									{
										columns: [
											{ width: 150, text: 'CONDICIONES DE LLANTAS:', style: 'field' },
											{ text: this.estadoPipe.transform(fecv.CONDICIONES_LLANTA), style: 'value' }
										]
									},

									{
										columns: [
											{ width: 150, text: 'CONDICIONES LIMPIA PARABRISAS:', style: 'field' },
											{ text: this.estadoPipe.transform(fecv.LIMPIAPARABRISAS), style: 'value' }
										]
									},
									{
										text: 'KILOMETRAJE:',
										style: 'subSectionHeader',
										margin: [0, 10, 0, 0]
									},
									{
										text: 'AL MOMENTO DE RECIBIR EL VEHÍCULO',
										style: 'field'
									},
									{
										text: fecv.KILOMETRAJE + ' km s',
										style: 'value'
									},
									{
										text: 'COMBUSTIBLE:',
										style: 'subSectionHeader',
										margin: [0, 10, 0, 0]
									},

									{
										text:
											'NIVEL DEL TANQUE AL MOMENTO DE RECIBIR EL VEHÍCULO: ' +
											this.combustiblePipe.transform(fecv.NIVEL_COMBUSTIBLE),
										style: 'field'
									},

									{
										text: 'ABASTECIMIENTO:',
										style: 'subSectionHeader',
										margin: [0, 10, 0, 0]
									},

									{ text: 'FACTURA SERIE: ', style: 'field' },
									{ text: 'NO.', style: 'value' },
									{ text: 'GALONES', style: 'value' },
									{ text: 'PRECIO', style: 'value' },

									{
										columns: [
											{ text: 'TOTAL:', style: 'field' },
											{
												text: 'FECHA:',
												style: 'field'
											}
										],
										margin: [0, 10, 0, 10]
									},
									{
										text: 'OBSERVACIONES:',
										style: 'subSectionHeader'
									},
									{
										text: 'INDIQUE DAÑOS A LA ESTRUCTURA DEL VEHÍCULO U OTRA SITUACIÓN QUE MEREZCA SU ATENCIÓN:',
										style: 'field'
									},
									{
										text: fecv.OBSERVACIONES,
										style: 'observations'
									},
									{
										text: 'DECLARO QUE RECIBI EL VEHÍCULO EN LAS CONDICIONES ARRIBA CONSIGNADAS.',
										style: 'sectionHeader',
										margin: [0, 20, 0, 0],
										alignment: 'center'
									},

									{
										text: 'FECHA: ' + this.datePipe.transform(fecv.FECHA_HORA_ENTREGA, 'dd/MM/yyyy'),
										style: 'sectionHeader',
										alignment: 'center',
										margin: 25
									},
									{
										text: 'FIRMA: ________________________________________',
										style: 'sectionHeader',
										alignment: 'center'
									}
								]
							]
						]
					}
				}
			],
			styles: {
				header: { fontSize: 9, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
				subheader: { fontSize: 8, alignment: 'justify' },
				sectionHeader: { fontSize: 9, bold: true, margin: [0, 10, 0, 5] },
				subSectionHeader: { fontSize: 8.5, bold: true, decoration: 'underline', margin: [0, 5, 0, 5] },
				field: { fontSize: 8 },
				value: { fontSize: 8 },
				observations: { fontSize: 8, margin: [0, 5, 0, 5] },
				note: { fontSize: 8, italics: true },
				option: { fontSize: 8, alignment: 'left' }
			}
		};

		let pdfWindow = window.open('about:blank', '_blank'); // Abre una nueva ventana en blanco

		if (pdfWindow) {
			pdfMake.createPdf(pdfDefinition).getBlob((blob) => {
				const url = URL.createObjectURL(blob); // Crea un URL temporal para el Blob

				// Escribimos el contenido HTML para incrustar el PDF dentro de la ventana "about:blank"
				pdfWindow.document.write(`<html>
					<head><title>Solicitud FECV-${(fecv.ID_SOLICITUD || 0).toString().padStart(2, '0')}</title></head>
					<body style="margin:0">
					<iframe src="${url}" width="100%" height="100%" style="border:none;"></iframe>
					</body>
					</html>`);
			});
		}
	}
}
