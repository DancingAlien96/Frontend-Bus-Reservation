import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/environment.prod';
import { PersonalInterface } from '../interfaces';

@Injectable({
	providedIn: 'root'
})
export class PersonalService {
	readonly url = environment.api;

	constructor(private http: HttpClient) {}

	getPersonal(): Observable<PersonalInterface[]> {
		return this.http.get<PersonalInterface[]>(`${this.url}/personal`);
	}
}
