import { Component, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(public dialog: MatDialog) { }

  openModal(component: any, data: any, width = '36vw', height = '46vh'): MatDialogRef<any> {
    const dialogRef = this.dialog.open(component, {
      width,
      height,
      data,
      panelClass: 'customize__add__money',
      hasBackdrop: true,
      disableClose: true,
    });
    return dialogRef;
  }
}
