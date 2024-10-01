import { DatePipe } from '@angular/common';
import { LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'dateFormat',
	standalone: true
})
export class DateFormatPipe implements PipeTransform {
	transform(value: string) {
		const datePipe = new DatePipe('es');
		const date = new Date(value);
		return datePipe.transform(date, "d 'de' MMMM 'de' y");
	}
}

@Pipe({
	name: 'timeFormat',
	standalone: true
})
export class TimeFormatPipe implements PipeTransform {
	transform(value: string) {
		const datePipe = new DatePipe('es');
		const date = new Date(value);
		return datePipe.transform(date, 'HH:mm a');
	}
}
