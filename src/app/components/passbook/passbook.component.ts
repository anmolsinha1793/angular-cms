import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalService } from '@core/services/modal.service';
import { Select, Store } from '@ngxs/store';
import {
  AddTransaction,
} from '@shared/actions/Transactions.action';
import { UpdateUser } from '@shared/actions/User.action';
import { TransactionDetailsModel } from '@shared/models/TransactionDetails.model';
import { CMSModelState } from '@shared/state/cms.state';
import * as moment from 'moment';
import { Subject, Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AddMoneyComponent } from '../add-money/add-money.component';

enum NumberEnum {
  ZERO = 0,
  ONE = 1,
  TEN = 10,
  HUNDRED = 100,
  TWO_THOUSAND = 2000,
  FIVE_THOUSAND = 5000,
}
@Component({
  selector: 'app-passbook',
  templateUrl: './passbook.component.html',
  styleUrls: ['./passbook.component.scss'],
})
export class PassbookComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'transactionAmount',
    'type',
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
  constructor(
    private store: Store,
    public dialog: MatDialog,
    private modalService: ModalService,
  ) {}
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
          this.dataResult = res
            .filter(
              (elm) => elm.empId === sessionStorage.getItem('empId')
            )
            .map((el: TransactionDetailsModel, i: number) => {
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
      },
      (err) => {}
    );
  }
  /**
   * Function to add balance into employees account
   * @returns void.
   */
  openAddBalancePopup(): void {
    this.dialog.closeAll();
    const currentUser = this.store
      .selectSnapshot(CMSModelState.getUserData)
      .find((el) => el.empId === sessionStorage.getItem('empId'));
    const { empId, name, email, balance } = currentUser;
    this.modalService
      .openModal(
        AddMoneyComponent,
        {
          empId,
          balance,
          name,
          email,
        },
        '20vw',
        '32vh'
      )
      .afterClosed()
      .subscribe(([res, transactionObj]) => {
        if (res && transactionObj) {
          this.store.dispatch(new UpdateUser(res));
          this.store.dispatch(new AddTransaction(transactionObj));
        }
      });
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
