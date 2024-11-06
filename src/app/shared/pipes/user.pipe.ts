import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'usuarioActivoPipe',
	standalone: true
})
export class UsuarioActivoPipe implements PipeTransform {
	transform(value: boolean) {
		if (value) {
			return 'Activo';
		}
		return 'Inactivo';
	}
}

@Pipe({
	name: 'edadPipe',
	standalone: true
})
export class EdadPipe implements PipeTransform {
	transform(value: Date): number {
		const currentDate = new Date();
		const birthDate = new Date(value);
		let age = currentDate.getFullYear() - birthDate.getFullYear();
		const monthDifference = currentDate.getMonth() - birthDate.getMonth();
		if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	}
}
