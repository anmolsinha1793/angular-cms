import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/core/api/api.service';
import { SetItemsOfTheDay } from 'src/app/shared/actions/Items.action';
import { ItemsOfTheDayModel } from 'src/app/shared/models/ItemsOfTheDay.model';
import { CMSModelState } from 'src/app/shared/state/cms.state';

enum NumberEnum {
  ZERO = 0,
  ONE = 1,
  TEN = 10,
  HUNDRED = 100,
  TWO_THOUSAND = 2000,
  FIVE_THOUSAND = 5000,
}

@Component({
  selector: 'app-items-of-the-day',
  templateUrl: './items-of-the-day.component.html',
  styleUrls: ['./items-of-the-day.component.scss']
})
export class ItemsOfTheDayComponent implements OnInit {

  displayedColumns: string[] = ['id', 'itemCode', 'itemName', 'basePrice', 'itemQuantity'];
  dataSource!: MatTableDataSource<ItemsOfTheDayModel[]>;
  eventSubscription = new Subject();
  pageSize = 5;
  currentPage = 0;
  dataResult: ItemsOfTheDayModel[] = [];
  totalSize = 0;
  @Select(CMSModelState.getItemsOfTheDay) itemsOfTheDayData$!: Observable<
  ItemsOfTheDayModel[]
  >;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private apiService: ApiService, private store: Store) {
  }
  ngOnInit() {
    this.fetchItemsOfTheDay();
    this.setItemsOfTheDayForTable();
  }
  /**
   * Function to fetch data from state and update table
   * @returns void.
   */
   setItemsOfTheDayForTable(): void {
    this.itemsOfTheDayData$
      .pipe(
        takeUntil(this.eventSubscription)
      )
      .subscribe(
        (res: ItemsOfTheDayModel[]) => {
          if (res.length > NumberEnum.ZERO) {
            this.dataResult = res.map((el: ItemsOfTheDayModel, i: number) => {
              return {
                ...el,
                id: i+1,
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
  fetchItemsOfTheDay(): void {
    this.apiService.fetchItemsOfTheDay()
      .pipe(takeUntil(this.eventSubscription))
      .subscribe((res: any) => {
        this.store.dispatch(new SetItemsOfTheDay(res.data));
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
