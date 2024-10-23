import { DateFormatPipe, TimeFormatPipe } from './../../pipes/date-time-format.pipe';
import { Component } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { PersonalInterface, SolicitudesInterfaces } from '../../interfaces';
import { PersonalService } from '../../services/personal.service';

@Component({
	selector: 'app-pdf-solicitud',
	standalone: true,
	imports: [],
	template: '',
	styles: ''
})
export class PdfSolicitudComponent {
	constructor(private ps: PersonalService) {}

	static async createPDF(solicitud: SolicitudesInterfaces, personalService: PersonalService) {
		let textoDirector = '';
		let textoAsistente = '';
		const logoDataURL = await this.getBase64ImageFromURL('../../../assets/logo-usac.jpg');

		personalService.getPersonal().subscribe({
			next: (personalData: PersonalInterface[]) => {
				personalData.forEach((personal) => {
					if (personal.ID_PERSONAL === 1) {
						textoDirector = `${personal.TITULO_ACADEMICO} ${personal.NOMBRE}`;
					} else if (personal.ID_PERSONAL === 2) {
						textoAsistente = `${personal.TITULO_ACADEMICO} ${personal.NOMBRE}`;
					}
				});
				const fechaCreacionFormateada = new DateFormatPipe().transform(solicitud.FECHA_CREACION);
				const fechaEntregaFormateada = new DateFormatPipe().transform(solicitud.FECHA_HORA_ENTREGA);
				const horaEntregaFormateada = new TimeFormatPipe().transform(solicitud.FECHA_HORA_ENTREGA);
				const fechaDevolucionFormateada = new DateFormatPipe().transform(solicitud.FECHA_HORA_DEVOLUCION);
				const horaDevolucionFormateada = new TimeFormatPipe().transform(solicitud.FECHA_HORA_DEVOLUCION);

				const pdfDefinition: any = {
					info: {
						title: `SV-${solicitud.ID_SOLICITUD}`
					},
					pageSize: 'LETTER',
					// [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
					pageMargins: [60, 60],
					content: [
						// Encabezado del documento
						{
							columns: [
								// Columna 1: Imagen del logo a la izquierda
								{
									image: logoDataURL,
									width: 50,
									height: 50
								},
								// Columna 2: Textos alineados en el centro de la página
								{
									stack: [
										{
											text: 'UNIVERSIDAD DE SAN CARLOS DE GUATEMALA\nCENTRO UNIVERSITARIO DE ORIENTE',
											alignment: 'center',
											style: 'header'
										},
										{
											text: 'SOLICITUD DE VEHÍCULOS',
											alignment: 'center',
											style: 'title',
											fontSize: 25,
											background: '#9c9a9a',
											margin: [0, 10]
										}
									],
									width: '*', // Esta columna ocupará el espacio restante de la página, centrando el texto
									alignment: 'center' // Esto centra el stack de la columna en la página
								},
								// Columna 3: Espacio vacío para balancear la distribución de las columnas
								{
									text: `SV-${(solicitud.ID_SOLICITUD || 0).toString().padStart(2, '0')}`,
									width: 50,
									height: 50,
									alignment: 'right',
									color: 'gray'
								}
							],
							columnGap: 10
						},

						{ text: `\nChiquimula, ${fechaCreacionFormateada}`, alignment: 'right', margin: [0, 10] },
						// Información del solicitante
						{
							columns: [
								{
									stack: [
										{
											text: `${textoDirector}`,
											alignment: 'left' // Alinea el nombre a la izquierda
										},
										{
											text: 'Director - CUNORI',
											alignment: 'center', // Alinea el título al centro
											margin: [0, 0, 50, 0]
										}
									],
									margin: [0, 0]
								},
								{}
							]
						},
						{
							text: [
								{ text: '\nYo ' }, // Texto sin formato
								{ text: solicitud.NOMBRE_SOLICITANTE, bold: true }, // Negrita para el nombre del solicitante
								{ text: ' solicito la utilización del vehículo automotor tipo ' }, // Texto sin formato
								{ text: solicitud.VEHICULO.TIPO, bold: true }, // Negrita para el tipo de vehículo
								{ text: ', color ' }, // Texto sin formato
								{ text: solicitud.VEHICULO.COLOR, bold: true }, // Negrita para el color del vehículo
								{ text: ', placas ' }, // Texto sin formato
								{ text: solicitud.VEHICULO.PLACA, bold: true }, // Negrita para la placa del vehículo
								{ text: ' para realizar un viaje a ' }, // Texto sin formato
								{ text: solicitud.DESTINO, bold: true }, // Negrita para el destino // Texto sin formato
								{ text: ' con el objeto de cubrir la diligencia siguiente: ' }, // Texto normal
								{ text: solicitud.DILIGENCIA, bold: true },
								{ text: '.' }
							],
							alignment: 'justify'
						},

						{
							text: [
								{ text: 'Dicho vehículo será utilizado en la fecha ' }, // Texto normal
								{ text: fechaEntregaFormateada, bold: true }, // Fecha de entrega en negrita
								{ text: ', a partir de las ' }, // Texto normal
								{ text: horaEntregaFormateada, bold: true }, // Hora de entrega en negrita
								{ text: ' que será devuelto el día ' }, // Texto normal
								{ text: fechaDevolucionFormateada, bold: true }, // Fecha de devolución en negrita
								{ text: ' a las ' }, // Texto normal
								{ text: horaDevolucionFormateada, bold: true } // Hora de devolución en negrita
							],
							margin: [0, 10],
							alignment: 'justify'
						},
						// Opciones de piloto
						{
							columns: [
								// Columna para "CON PILOTO" con el rectángulo a la par
								{
									columns: [
										{ text: 'CON PILOTO', margin: [0, 5] },
										{
											canvas: [
												{
													type: 'rect',
													x: 0,
													y: 5,
													w: 12, // Ancho del rectángulo
													h: 12, // Alto del rectángulo
													r: 2, // Radio de las esquinas (para bordes redondeados)
													lineColor: 'black',
													color: solicitud.CON_PILOTO ? 'black' : 'white'
												}
											],
											margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
										}
									],
									width: 'auto'
								},

								// Espacio de separación entre las opciones
								{ width: 20, text: '' },

								// Columna para "SIN PILOTO" con el rectángulo a la par
								{
									columns: [
										{ text: 'SIN PILOTO', margin: [0, 5] },
										{
											canvas: [
												{
													type: 'rect',
													x: 0,
													y: 5,
													w: 12,
													h: 12,
													r: 2,
													lineColor: 'black',
													color: !solicitud.CON_PILOTO ? 'black' : 'white'
												}
											],
											margin: [5, 0, 0, 0] // Ajusta la posición del rectángulo al lado del texto
										}
									],
									width: 'auto'
								}
							],
							margin: [0, 10]
						},

						// Información de conducción
						solicitud.CON_PILOTO
							? [
									{
										text: `CONDUCIRÁ: ${solicitud.NOMBRE_PILOTO}`,
										margin: [0, 10]
									}
							  ]
							: [],
						{ text: 'Sin otro particular:', margin: [0, 10] },

						// Firma del solicitante
						{
							columns: [
								{
									text: 'Firma: _______________________________________',
									margin: [0, 40],
									alignment: 'center' // Centrar el texto dentro de la columna
								}
							],
							width: '100%', // Centra la columna dentro del contenedor
							alignment: 'center'
						},

						// Vo.Bo
						{
							columns: [
								{
									text: `Vo.Bo. ${textoDirector} \nDirector`,
									alignment: 'center',
									margin: [0, 40, 0, 20]
								},
								{
									text: `${textoAsistente} \nAsistente de Dirección`,
									alignment: 'center',
									margin: [0, 40, 0, 20]
								}
							]
						},
						{
							text: 'Centro Universitario de Oriente',
							alignment: 'center'
						}
					],
					styles: {
						header: { fontSize: 12, bold: true },
						title: { fontSize: 16, bold: true }
					}
				};

				let pdfWindow = window.open('about:blank', '_blank'); // Abre una nueva ventana en blanco

				if (pdfWindow) {
					pdfMake.createPdf(pdfDefinition).getBlob((blob) => {
						const url = URL.createObjectURL(blob); // Crea un URL temporal para el Blob

						// Escribimos el contenido HTML para incrustar el PDF dentro de la ventana "about:blank"
						pdfWindow.document.write(`<html>
					<head><title>Solicitud SV-${solicitud.ID_SOLICITUD}</title></head>
					<body style="margin:0">
					<iframe src="${url}" width="100%" height="100%" style="border:none;"></iframe>
					</body>
					</html>`);
					});
				}
			}
		});
	}

	static getBase64ImageFromURL(url: string) {
		return new Promise((resolve, reject) => {
			var img = new Image();
			img.setAttribute('crossOrigin', 'anonymous');

			img.onload = () => {
				var canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;

				var ctx = canvas.getContext('2d');
				ctx!.drawImage(img, 0, 0);

				var dataURL = canvas.toDataURL('image/png');

				resolve(dataURL);
			};

			img.onerror = (error) => {
				reject(error);
			};

			img.src = url;
		});
	}
}
