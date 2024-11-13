import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authenticationInterceptor } from './shared/interceptors/authentication.interceptor';

//Colocar fechas en español
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideAnimationsAsync(),
		importProvidersFrom(ReactiveFormsModule, HttpClientModule, RecaptchaV3Module),

		provideHttpClient(withInterceptors([authenticationInterceptor])),
		{ provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LcFz3oqAAAAAODJMu0jIIIj6E1RV1kcFGKhQFDI' } // Proveedor personalizado
	] //
};
