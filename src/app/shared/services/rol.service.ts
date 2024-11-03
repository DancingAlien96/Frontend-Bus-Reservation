import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/environment.prod';
import { RolInterface } from '../interfaces';

@Injectable({
	providedIn: 'root'
})
export class RolService {
	readonly url = environment.api;

	constructor(private http: HttpClient) {}

	getRoles(): Observable<RolInterface[]> {
		return this.http.get<RolInterface[]>(`${this.url}/rol`);
	}
}
