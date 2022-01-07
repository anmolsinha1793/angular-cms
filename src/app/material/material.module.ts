import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTableModule,
  MatTabsModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatSortModule,
  MatAutocompleteModule,
  MatProgressBarModule,
  MatTooltipModule,
  MatRadioModule,
  MatDatepickerModule,
  MatDialogModule,
  MatSlideToggleModule,
  ClipboardModule,
  MatSnackBarModule,
  MatToolbarModule
];
@NgModule({
  imports: [CommonModule, ...materialModules],
  exports: [...materialModules],
})
export class MaterialModule {}
