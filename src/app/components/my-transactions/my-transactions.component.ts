import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Select } from '@ngxs/store';
import { TransactionDetailsModel } from '@shared/models/TransactionDetails.model';
import { CMSModelState } from '@shared/state/cms.state';
import * as moment from 'moment';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

enum NumberEnum {
  ZERO = 0,
  ONE = 1,
  TEN = 10,
  HUNDRED = 100,
  TWO_THOUSAND = 2000,
  FIVE_THOUSAND = 5000,
}

@Component({
  selector: 'app-my-transactions',
  templateUrl: './my-transactions.component.html',
  styleUrls: ['./my-transactions.component.scss'],
})
export class MyTransactionsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'transactionAmount',
    'item',
    'dateDetail',
  ];
  dataSource!: MatTableDataSource<TransactionDetailsModel[]>;
  eventSubscription = new Subject();
  pageSize = 5;
  currentPage = 0;
  dataResult: TransactionDetailsModel[] = [];
  totalSize = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  @Select(CMSModelState.getTransactionList) transactionData$!: Observable<
    TransactionDetailsModel[]
  >;
  constructor() {}
  /**
   * Lifecycle hook for angular
   * @returns void.
   */
  ngOnInit(): void {
    this.setTransactionsDataForTable();
  }

  /**
   * Function to fetch data from state and update table
   * @returns void.
   */
  setTransactionsDataForTable(): void {
    this.transactionData$.pipe(takeUntil(this.eventSubscription)).subscribe(
      (res: TransactionDetailsModel[]) => {
        if (res.length > NumberEnum.ZERO) {
          this.dataResult = res
            .filter(
              (elm) =>
                elm.empId === sessionStorage.getItem('empId') &&
                elm.type === 'debit'
            ).map((el: TransactionDetailsModel, i: number) => {
              return {
                ...el,
                id: i + 1,
                dateDetail: moment(el.dateDetail).format('MM/DD/YYYY HH:mm:ss'),
              };
            }) as any;
          this.totalSize = this.dataResult.length;
          this.dataSource = new MatTableDataSource(this.dataResult as any);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (err) => {}
    );
  }
  /**
   * Function to apply filter
   * @param event item which needs to be filter
   * @returns void.
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
