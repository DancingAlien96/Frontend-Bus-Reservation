import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const solicitanteUnwishGuard: CanActivateFn = (route, state) => {
  //este guard es cuando solicitante no es deseado en alguna ruta

  const router = inject(Router);
  const usuarioSession = sessionStorage.getItem('usuario');
  if (usuarioSession) {
    try {
      const usuario = JSON.parse(usuarioSession);
      const idUsuario = usuario.ID_USUARIO;

      if (idUsuario === 2) {
        router.navigate(['/home']);
        return false; // Bloquea el acceso a esta ruta
      }


      
      return true; // Permitir acceso si `ID_USUARIO` no es solicitante
    } catch (error) {
      console.error('Error parsing usuario from session storage:', error);
      return false; // Bloquea el acceso si ocurre un error al analizar
    }
  }

  return false; // Bloquea el acceso si `usuarioSession` es null

};
