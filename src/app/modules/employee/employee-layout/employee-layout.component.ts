import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '@core/api/api.service';
import { CommonActivityService } from '@core/services/common-activity.service';
import { ModalService } from '@core/services/modal.service';
import { Store } from '@ngxs/store';
import { SetItemsOfTheDay } from '@shared/actions/Items.action';
import { SetTransaction } from '@shared/actions/Transactions.action';
import { SetUser } from '@shared/actions/User.action';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-employee-layout',
  templateUrl: './employee-layout.component.html',
  styleUrls: ['./employee-layout.component.scss']
})
export class EmployeeLayoutComponent implements OnInit, OnDestroy {
  eventSubscription = new Subject();
  constructor(private router: Router, private apiService: ApiService, private store: Store,
    private commonService: CommonActivityService) { }

  ngOnInit(): void {
    this.fetchDatas();
  }
  fetchDatas(): void {
    forkJoin([this.apiService
      .fetchUserData(), this.apiService
      .fetchItemsOfTheDay(),  this.apiService
      .fetchTransactionDetails()])
      .pipe(takeUntil(this.eventSubscription))
      .subscribe(([users, items, transactions]) => {
        this.store.dispatch(new SetUser(users));
        this.commonService.setChange(true);
        this.store.dispatch(new SetItemsOfTheDay(items));
        this.store.dispatch(new SetTransaction(transactions));;
      })
  }
  ngOnDestroy(): void {
    this.eventSubscription.next();
    this.eventSubscription.complete();
}
}
