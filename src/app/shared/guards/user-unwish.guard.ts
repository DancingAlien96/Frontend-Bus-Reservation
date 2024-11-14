import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userUnwishGuard: CanActivateFn = (route, state) => {
  //este guard sirve cuando el guardia no es deseado
  const router = inject(Router);
  const usuarioSession = localStorage.getItem('usuario');
  if (usuarioSession) {
    try {
      const usuario = JSON.parse(usuarioSession);
      const idUsuario = usuario.ID_ROL;

      if (idUsuario === 3) {
        router.navigate(['/home']);
        return false; // Bloquea el acceso a esta rut
      }



      return true; // Permitir acceso si `ID_USUARIO` no es 3
    } catch (error) {
      console.error('Error parsing usuario from session storage:', error);
      return false; // Bloquea el acceso si ocurre un error al analizar
    }
  }

  return false; // Bloquea el acceso si `usuarioSession` es null
 	
  		
  
};
