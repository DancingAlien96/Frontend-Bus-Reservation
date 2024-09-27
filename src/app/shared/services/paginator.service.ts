import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService extends MatPaginatorIntl {

  constructor() {
    super();  // Llama al constructor de MatPaginatorIntl
    this.itemsPerPageLabel = 'Páginas';
    this.nextPageLabel = 'Siguiente página';
    this.previousPageLabel = 'Página previa';
    this.firstPageLabel = 'Primera página';
    this.lastPageLabel = 'Última página';
   }
  }

