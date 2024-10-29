import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FecvInterface, FecvPostInterface } from '../interfaces';

@Injectable({
	providedIn: 'root'
})
export class FecvService {
	readonly url = environment.api;
	constructor(private http: HttpClient) {}

	postFECV(fecv: FecvPostInterface): Observable<FecvInterface> {
		return this.http.post<FecvInterface>(`${this.url}/fecv`, fecv);
	}
}
