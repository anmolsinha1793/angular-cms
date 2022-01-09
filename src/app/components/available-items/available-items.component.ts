import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonActivityService } from '@core/services/common-activity.service';
import { ModalService } from '@core/services/modal.service';
import { Select, Store } from '@ngxs/store';
import {
  AddAvailableItems,
  DeleteAvailableItems,
  UpdateAvailableItems,
} from '@shared/actions/Items.action';
import { AvailableItemsModel } from '@shared/models/AvailableItems.model';
import { CMSModelState } from '@shared/state/cms.state';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddEditItemComponent } from '../add-edit-item/add-edit-item.component';

enum NumberEnum {
  ZERO = 0,
  ONE = 1,
  TEN = 10,
  HUNDRED = 100,
  TWO_THOUSAND = 2000,
  FIVE_THOUSAND = 5000,
}

@Component({
  selector: 'app-available-items',
  templateUrl: './available-items.component.html',
  styleUrls: ['./available-items.component.scss'],
})
export class AvailableItemsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'itemCode',
    'itemName',
    'basePrice',
    'itemQuantity',
    'actions',
  ];
  dataSource!: MatTableDataSource<AvailableItemsModel[]>;
  eventSubscription = new Subject();
  pageSize = 5;
  currentPage = 0;
  dataResult: AvailableItemsModel[] = [];
  totalSize = 0;
  @Select(CMSModelState.getAvailableItems) availableItemsData$!: Observable<
    AvailableItemsModel[]
  >;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(
    private store: Store,
    private modalService: ModalService,
    private commonService: CommonActivityService,
    public dialog: MatDialog,
  ) {}
  ngOnInit() {
    this.setAvailableItemsDataForTable();
  }
  /**
   * Function to fetch data from state and update table
   * @returns void.
   */
  setAvailableItemsDataForTable(): void {
    combineLatest([this.commonService.getChange(), this.availableItemsData$])
      .pipe(takeUntil(this.eventSubscription))
      .subscribe(
        ([change, res]) => {
          const items = this.store.selectSnapshot(CMSModelState.getItemsOfTheDay);
          if (res.length > NumberEnum.ZERO) {
            this.dataResult = res.map((el: AvailableItemsModel, i: number) => {
              return {
                ...el,
                id: i + 1,
                actions: '',
                isDisabled: !items.every((elm) => elm.itemCode !== el.itemCode)
              };
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
  /**
   * Function to add available items
   * @returns void.
   */
  addItem(): void {
    const id = `item${
      this.store.selectSnapshot(CMSModelState.getAvailableItems).length + 1
    }`;
    this.modalService
      .openModal(AddEditItemComponent, { action: 'Add', id }, '20vw', '40vh')
      .afterClosed()
      .subscribe((res) => {
        this.store.dispatch(new AddAvailableItems(res));
      });
  }
  /**
   * Function to delete item
   * @param res item which needs to be deleted
   * @returns void.
   */
   deleteItem(row: any): void {
     if (row.isDisabled) return;
    this.store.dispatch(new DeleteAvailableItems(row));
  }
  /**
   * Function to edit item
   * @param res item which needs to be edited
   * @returns void.
   */
  editItem(row: any): void {
    if (row.isDisabled) return;
    this.dialog.closeAll();
    const { itemCode, itemName, basePrice, itemQuantity } = row;
    this.modalService
      .openModal(
        AddEditItemComponent,
        {
          action: 'Edit',
          itemCode,
          itemName,
          basePrice,
          itemQuantity,
        },
        '22vw',
        '40vh'
      )
      .afterClosed()
      .subscribe((items) => {
        if (items) {
          this.store.dispatch(new UpdateAvailableItems(items));
          this.commonService.setChange(true);
        }
      });
  }
  /**
   * Function to apply filter
   * @param event item which needs to be filtered
   * @returns void.
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
