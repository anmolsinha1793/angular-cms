import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/core/api/api.service';
import { TransactionDetailsModel } from 'src/app/shared/models/TransactionDetails.model';
import * as moment from 'moment';
import { Select, Store } from '@ngxs/store';
import { CMSModelState } from 'src/app/shared/state/cms.state';
import { SetTransaction } from 'src/app/shared/actions/Transactions.action';

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
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'empId', 'transactionAmount', 'source', 'dateDetail'];
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

  constructor(private apiService: ApiService, private store: Store) {
  }
  ngOnInit() {
    this.fetchTransactionData();
    this.setTransactionsDataForTable();
  }
  /**
   * Function to fetch data from state and update table
   * @returns void.
   */
 setTransactionsDataForTable(): void {
  this.transactionData$
    .pipe(
      takeUntil(this.eventSubscription)
    )
    .subscribe(
      (res: TransactionDetailsModel[]) => {
        if (res.length > NumberEnum.ZERO) {
          this.dataResult = res.map((el: TransactionDetailsModel, i: number) => {
            return {
              ...el,
              id: i+1,
              dateDetail: moment(el.dateDetail).format('MM/DD/YYYY HH:mm:ss')
            }
          });
          console.log(this.dataResult);
          this.totalSize = this.dataResult.length;
          this.dataSource = new MatTableDataSource(this.dataResult as any);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (err) => {}
    );
}
  fetchTransactionData(): void {
    this.apiService.fetchTransactionDetails()
      .pipe(takeUntil(this.eventSubscription))
      .subscribe((res: any) => {
        this.store.dispatch(new SetTransaction(res.data));
      });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
