import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AvailableItemsModel } from 'src/app/shared/models/AvailableItems.model';
import { ItemsOfTheDayModel } from 'src/app/shared/models/ItemsOfTheDay.model';
import { TransactionDetailsModel } from 'src/app/shared/models/TransactionDetails.model';
import { UserModel } from 'src/app/shared/models/User.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  fetchUserData(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`assets/data/users.json`);
  }
  fetchTransactionDetails(): Observable<TransactionDetailsModel[]> {
    return this.http.get<TransactionDetailsModel[]>(`assets/data/transactionDetails.json`);
  }
  fetchAvailableItems(): Observable<AvailableItemsModel[]> {
    return this.http.get<AvailableItemsModel[]>(`assets/data/availableItems.json`);
  }
  fetchItemsOfTheDay(): Observable<ItemsOfTheDayModel[]> {
    return this.http.get<ItemsOfTheDayModel[]>(`assets/data/itemsoftheday.json`);
  }
}
