import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '@core/api/api.service';
import { CommonActivityService } from '@core/services/common-activity.service';
import { Store } from '@ngxs/store';
import { SetAvailableItems, SetItemsOfTheDay } from '@shared/actions/Items.action';
import { SetTransaction } from '@shared/actions/Transactions.action';
import { AddUsers, SetUser } from '@shared/actions/User.action';
import { CMSModelState } from '@shared/state/cms.state';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-employee-layout',
  templateUrl: './employee-layout.component.html',
  styleUrls: ['./employee-layout.component.scss']
})
export class EmployeeLayoutComponent implements OnInit, OnDestroy {
  eventSubscription = new Subject();
  constructor(private apiService: ApiService, private store: Store,
    private commonService: CommonActivityService) { }

  ngOnInit(): void {
    this.fetchDatas();
  }
  fetchDatas(): void {
    forkJoin([this.apiService
      .fetchUserData(), this.apiService
      .fetchItemsOfTheDay(),  this.apiService
      .fetchTransactionDetails(), this.apiService
      .fetchAvailableItems()])
      .pipe(takeUntil(this.eventSubscription))
      .subscribe(([users, items, transactions, avitems]) => {
        this.store.selectSnapshot(CMSModelState.getUserData).length === 0 ? this.store.dispatch(new SetUser(users)) : this.store.dispatch(new AddUsers(users));
        this.commonService.setChange(true);
        this.store.dispatch(new SetItemsOfTheDay(items));
        this.store.dispatch(new SetTransaction(transactions));
        this.store.dispatch(new SetAvailableItems(avitems));
      })
  }
  ngOnDestroy(): void {
    this.eventSubscription.next();
    this.eventSubscription.complete();
}
}
