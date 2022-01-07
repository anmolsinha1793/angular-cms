import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderLayoutComponent } from './components/header-layout/header-layout.component';
import { FooterLayoutComponent } from './components/footer-layout/footer-layout.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    HeaderLayoutComponent,
    FooterLayoutComponent
  ],
  exports: [
    HeaderLayoutComponent,
    FooterLayoutComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class SharedModule { }
