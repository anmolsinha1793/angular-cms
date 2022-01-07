import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { ApiService } from 'src/app/core/api/api.service';
import { takeUntil } from 'rxjs/operators';
import { UserModel } from 'src/app/shared/models/User.model';
import { Select, Store } from '@ngxs/store';
import { CMSModelState } from 'src/app/shared/state/cms.state';
import { SetUser } from 'src/app/shared/actions/User.action';
import { AddMoneyComponent } from '../add-money/add-money.component';
import { MatDialog } from '@angular/material/dialog';

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
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'empId', 'balance', 'addBalance', 'makePurchase'];
  dataSource!: MatTableDataSource<UserModel[]>;
  eventSubscription = new Subject();
  pageSize = 5;
  currentPage = 0;
  dataResult: UserModel[] = [];
  totalSize = 0;
  @Select(CMSModelState.getUserData) userData$!: Observable<
    UserModel[]
  >;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;


  constructor(private apiService: ApiService, private store: Store, public dialog: MatDialog) {
  }
  ngOnInit() {
    this.fetchUserData();
    this.setUserDataForTable();
  }

  fetchUserData(): void {
    this.apiService.fetchUserData()
      .pipe(takeUntil(this.eventSubscription))
      .subscribe((res: any) => {
        this.store.dispatch(new SetUser(res.data));
      });
  }
  /**
   * Function to fetch data from state and update table
   * @returns void.
   */
   setUserDataForTable(): void {
    this.userData$
      .pipe(
        takeUntil(this.eventSubscription)
      )
      .subscribe(
        (res: UserModel[]) => {
          if (res.length > NumberEnum.ZERO) {
            console.log('here');
            this.dataResult = res.map((el: UserModel, i: number) => {
              return {
                ...el,
                id: i+1,
                addBalance: '',
                makePurchase: ''
              }
            });
            this.totalSize = this.dataResult.length;
            this.dataSource = new MatTableDataSource(this.dataResult as any);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        },
        (err) => {}
      );
  }
  applyFilter(event: Event) {
    console.log(event);
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openAddBalancePopup(empId: string, balance: number): void {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(AddMoneyComponent, {
      width: '20vw',
      height: '35vh',
      data: {
        empId,
        balance
      },
      panelClass: 'customize__add__money',
      hasBackdrop: false,
      disableClose: false,
    });
  }
  handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }
  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.dataResult.slice(start, end);
    this.dataSource = part as any;
  }
}
