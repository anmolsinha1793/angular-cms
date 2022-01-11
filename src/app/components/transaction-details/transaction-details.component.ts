import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { Select } from '@ngxs/store';
import { TransactionDetailsModel } from '@shared/models/TransactionDetails.model';
import { CMSModelState } from '@shared/state/cms.state';

enum NumberEnum {
  ZERO = 0,
  ONE = 1,
  TEN = 10,
  HUNDRED = 100,
  TWO_THOUSAND = 2000,
  FIVE_THOUSAND = 5000,
}

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
})
export class TransactionDetailsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'empId',
    'transactionAmount',
    'source',
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
  ngOnInit() {
    this.setTransactionsDataForTable();
  }
  /**
   * Function to fetch data from state and update table
   * @returns void.
   */
  setTransactionsDataForTable(): void {
    this.transactionData$.pipe(
      takeUntil(this.eventSubscription),
      filter((res) => res.length > 0)
      ).subscribe(
      (res: TransactionDetailsModel[]) => {
          this.dataResult = res.map(
            (el: TransactionDetailsModel, i: number) => {
              return {
                ...el,
                id: i + 1,
                dateDetail: moment(el.dateDetail).format('MM/DD/YYYY HH:mm:ss'),
              };
            }
          ) as any;
          this.totalSize = this.dataResult.length;
          this.dataSource = new MatTableDataSource(this.dataResult as any);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      },
      (err) => {}
    );
  }
  /**
   * Function to apply filter
   * @param event item which needs to be filtered
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
