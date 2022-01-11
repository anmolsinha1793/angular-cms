import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { AddMoneyComponent } from '../add-money/add-money.component';
import { MatDialog } from '@angular/material/dialog';
import { AddUser, UpdateUser } from '@shared/actions/User.action';
import { UserModel } from '@shared/models/User.model';
import { CMSModelState } from '@shared/state/cms.state';
import { AddUserComponent } from '../add-user/add-user.component';
import { MakePurchaseComponent } from '../make-purchase/make-purchase.component';
import { ModalService } from '@core/services/modal.service';
import { SetItemsOfTheDay } from '@shared/actions/Items.action';
import { AddTransaction } from '@shared/actions/Transactions.action';
import { CommonActivityService } from '@core/services/common-activity.service';

enum NumberEnum {
  ZERO = 0,
  ONE = 1,
  TEN = 10,
  HUNDRED = 100,
  TWO_THOUSAND = 2000,
  FIVE_THOUSAND = 5000,
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'name',
    'empId',
    'balance',
    'addBalance',
    'makePurchase',
  ];
  dataSource!: MatTableDataSource<UserModel[]>;
  eventSubscription = new Subject();
  pageSize = 5;
  currentPage = 0;
  dataResult: UserModel[] = [];
  totalSize = 0;
  @Select(CMSModelState.getUserData) userData$!: Observable<UserModel[]>;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private modalService: ModalService,
    private commonService: CommonActivityService
  ) {}
  ngOnInit() {
    this.setUserDataForTable();
  }
  /**
   * Function to fetch data from state for user
   * @returns void.
   */
  setUserDataForTable(): void {
    combineLatest([this.commonService.getChange(), this.userData$])
      .pipe(
        takeUntil(this.eventSubscription),
        filter(([resp, res]) => res.length > 0)
        )
      .subscribe(
        ([resp, res]) => {
            this.dataResult = res.map((el: UserModel, i: number) => {
              return {
                ...el,
                id: i + 1,
                addBalance: '',
                makePurchase: '',
              };
            });
            this.totalSize = this.dataResult.length;
            this.dataSource = new MatTableDataSource(this.dataResult as any);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        },
        (err) => {}
      );
  }
  /**
   * Function to apply filter to data
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
  /**
   * Function to open add user popup
   * @returns void.
   */
  openAddUserPopup(): void {
    this.dialog.closeAll();
    this.modalService
      .openModal(AddUserComponent, {}, '24vw', '47vh')
      .afterClosed()
      .subscribe((registerFormValue) => {
        if (registerFormValue) {
          this.store.dispatch(new AddUser(registerFormValue));
        }
      });
  }
  /**
   * Function to open purchase popup
   * @returns void.
   */
  openPurchasePopup(row: UserModel): void {
    this.dialog.closeAll();
    const { empId, name, email, balance } = row;
    this.modalService
      .openModal(
        MakePurchaseComponent,
        {
          empId,
          balance,
          name,
          email,
        },
        '40vw',
        '40vh'
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const [itemsOftheday, foundUser, transactionObj] = res;
          this.store.dispatch(new SetItemsOfTheDay(itemsOftheday));
          this.store.dispatch(new UpdateUser(foundUser));
          this.store.dispatch(new AddTransaction(transactionObj));
          this.commonService.setChange(true);
        }
      });
  }
  /**
   * Function to open add balance popup
   * @returns void.
   */
  openAddBalancePopup(row: UserModel): void {
    this.dialog.closeAll();
    const { empId, name, email, balance } = row;
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
      .subscribe((res) => {
        this.store.dispatch(new UpdateUser(res));
        this.commonService.setChange(true);
      });
  }
  /**
   * Function to handle page size
   * @returns void.
   */
  handlePage(e: any): void {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }
  /**
   * Function to iterate over pages
   * @returns void.
   */
  private iterator(): void {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.dataResult.slice(start, end);
    this.dataSource = part as any;
  }
  /**
   * Lifecycle hook for angular executes when component unmounts
   * @returns void.
   */
  ngOnDestroy(): void {
    this.eventSubscription.next();
    this.eventSubscription.complete();
  }
}
