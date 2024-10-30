import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FdcvInterface, FdcvPostInterface } from '../interfaces';

@Injectable({
	providedIn: 'root'
})
export class FdcvService {
	readonly url = environment.api;
	constructor(private http: HttpClient) {}

	postFDCV(fdcv: FdcvPostInterface): Observable<FdcvInterface> {
		return this.http.post<FdcvInterface>(`${this.url}/fdcv`, fdcv);
	}
}
