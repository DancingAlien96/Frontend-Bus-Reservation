import { Injectable } from '@angular/core';
import { environment } from '../../../enviroment/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UsuarioInterface, UsuarioNewPasswordInterface, UsuarioPostInterface } from '../interfaces/usuario.interface';

@Injectable({
	providedIn: 'root'
})
export class UsuariosService {
	readonly url = environment.api;
	private updateSubject = new Subject<void>();

	constructor(private http: HttpClient) {}

	getUsuarios(): Observable<UsuarioInterface[]> {
		return this.http.get<UsuarioInterface[]>(`${this.url}/usuario`);
	}

	patchActivarDesactivarUsuario(idUsuario: number): Observable<UsuarioInterface> {
		return this.http.patch<UsuarioInterface>(`${this.url}/usuario/activate/${idUsuario}`, {});
	}

	patchResetPassword(idUsuario: number): Observable<UsuarioNewPasswordInterface> {
		return this.http.patch<UsuarioNewPasswordInterface>(`${this.url}/usuario/reset/${idUsuario}`, {});
	}

	postUsuario(usuario: UsuarioPostInterface): Observable<UsuarioInterface> {
		return this.http.post<UsuarioInterface>(`${this.url}/usuario`, usuario);
	}

	getUpdateObservable(): Observable<void> {
		return this.updateSubject.asObservable();
	}

	emitUpdate() {
		this.updateSubject.next();
	}
}
