import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-alerta-eliminado',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatIcon],
  templateUrl: './alerta-eliminado.component.html',
  styleUrl: './alerta-eliminado.component.css'
})
export class AlertaEliminadoComponent {
  constructor(private dialogRef: MatDialogRef<AlertaEliminadoComponent>) {}

  confirmar(): void {
    this.dialogRef.close(true); // Devuelve true si se confirma
  }

  cancelar(): void {
    this.dialogRef.close(false); // Devuelve false si se cancela
  }
}
