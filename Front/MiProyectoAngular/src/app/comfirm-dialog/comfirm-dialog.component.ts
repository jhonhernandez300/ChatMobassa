import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-comfirm-dialog',
  templateUrl: './comfirm-dialog.component.html',
  styleUrls: ['./comfirm-dialog.component.css']
})
export class ComfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ComfirmDialogComponent>) {}

  onConfirm(): void {
    // Cerrar el diálogo con el valor true (Sí)
    this.dialogRef.close(true);  
  }

  onCancel(): void {
    // Cerrar el diálogo con el valor false (No)
    this.dialogRef.close(false);  
  }
}
