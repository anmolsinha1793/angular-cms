import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AvailableItemsModel } from '@shared/models/AvailableItems.model';
import { ItemsOfTheDayModel } from '@shared/models/ItemsOfTheDay.model';
import { TransactionDetailsModel } from '@shared/models/TransactionDetails.model';
import { UserModel } from '@shared/models/User.model';
import { Observable } from 'rxjs';

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
