import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'boolSiNoPipe',
	standalone: true
})
export class BoolSiNoPipe implements PipeTransform {
	transform(value: boolean) {
		if (value) {
			return 'Si';
		}
		return 'No';
	}
}

@Pipe({
	name: 'boolBuenoMaloPipe',
	standalone: true
})
export class BoolBuenoMaloPipe implements PipeTransform {
	transform(value: boolean) {
		if (value) {
			return 'Bueno';
		}
		return 'Malo';
	}
}

@Pipe({
	name: 'numberBeMeCdPipe',
	standalone: true
})
export class NumberBeMeCdPipe implements PipeTransform {
	transform(value: number) {
		switch (value) {
			case 1:
				return 'Buen Estado';
			case 2:
				return 'Mal Estado';
			case 3:
				return 'Con Daños';
			default:
				return 'Sin definir';
		}
	}
}

@Pipe({
	name: 'combustiblePipe',
	standalone: true
})
export class CombustiblePipe implements PipeTransform {
	transform(value: number | string | undefined) {
		if (value === undefined) {
			return 'Sin definir';
		}
		if (typeof value === 'string') {
			value = parseFloat(value);
		}
		switch (value) {
			case 0.25:
				return '1/4';
			case 0.5:
				return '1/2';
			case 0.75:
				return '3/4';
			case 1:
				return 'Lleno';
			default:
				return '0';
		}
	}
}

@Pipe({
	name: 'estadoPipe',
	standalone: true
})
export class EstadoPipe implements PipeTransform {
	transform(value: number | string | undefined) {
		if (value === undefined) {
			return 'BE';
		}
		if (typeof value === 'string') {
			value = parseFloat(value);
		}
		switch (value) {
			case 1:
				return 'BE';
			case 0:
				return 'ME';
			case 2:
				return 'CD';
			default:
				return 'N/D';
		}
	}
}

@Pipe({
	name: 'number',
	standalone: true
})
export class ToNumberPipe implements PipeTransform {
	transform(value: string) {
		return parseFloat(parseFloat(value).toFixed(1));
	}
}

@Pipe({
	name: 'boolToNumber',
	standalone: true
})
export class BoolToNumber implements PipeTransform {
	transform(value: boolean) {
		return value ? '1' : '0';
	}
}
