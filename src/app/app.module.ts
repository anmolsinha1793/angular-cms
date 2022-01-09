import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { UsersComponent } from './components/users/users.component';
import { ItemsOfTheDayComponent } from './components/items-of-the-day/items-of-the-day.component';
import { TransactionDetailsComponent } from './components/transaction-details/transaction-details.component';
import { AvailableItemsComponent } from './components/available-items/available-items.component';
import { MyTransactionsComponent } from './components/my-transactions/my-transactions.component';
import { PassbookComponent } from './components/passbook/passbook.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AddItemOfTheDayComponent } from './components/add-item-of-the-day/add-item-of-the-day.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { AddMoneyComponent } from './components/add-money/add-money.component';
import { AdminLayoutComponent } from './modules/admin/admin-layout/admin-layout.component';
import { EmployeeLayoutComponent } from './modules/employee/employee-layout/employee-layout.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { CMSModelState } from './shared/state/cms.state';
import { MakePurchaseComponent } from './components/make-purchase/make-purchase.component';
import { AddEditItemComponent } from './components/add-edit-item/add-edit-item.component';
import { PickDayItemComponent } from './components/pick-day-item/pick-day-item.component';
import { IncrementDecrementComponent } from './components/increment-decrement/increment-decrement.component';
import { BuyItemComponent } from './components/buy-item/buy-item.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    ItemsOfTheDayComponent,
    TransactionDetailsComponent,
    AvailableItemsComponent,
    MyTransactionsComponent,
    PassbookComponent,
    AddUserComponent,
    AddItemOfTheDayComponent,
    AddItemComponent,
    AddMoneyComponent,
    AdminLayoutComponent,
    EmployeeLayoutComponent,
    MakePurchaseComponent,
    AddEditItemComponent,
    PickDayItemComponent,
    IncrementDecrementComponent,
    BuyItemComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    FormsModule,
    NgxsModule.forRoot([
      CMSModelState
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
