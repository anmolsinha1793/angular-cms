import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonActivityService } from '@core/services/common-activity.service';
import { ModalService } from '@core/services/modal.service';
import { Select, Store } from '@ngxs/store';
import {
  AddItemsOfTheDay,
  DeleteItemsOfTheDay,
  EditItemsOfTheDay,
  UpdateAvailableItems,
} from '@shared/actions/Items.action';
import { AddTransaction } from '@shared/actions/Transactions.action';
import { UpdateUser } from '@shared/actions/User.action';
import { ItemsOfTheDayModel } from '@shared/models/ItemsOfTheDay.model';
import { TransactionDetailsModel } from '@shared/models/TransactionDetails.model';
import { CMSModelState } from '@shared/state/cms.state';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AddEditItemComponent } from '../add-edit-item/add-edit-item.component';
import { BuyItemComponent } from '../buy-item/buy-item.component';
import { PickDayItemComponent } from '../pick-day-item/pick-day-item.component';

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
  styleUrls: ['./items-of-the-day.component.scss'],
})
export class ItemsOfTheDayComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'itemCode',
    'itemName',
    'basePrice',
    'itemQuantity',
    'actions',
  ];
  dataSource!: MatTableDataSource<ItemsOfTheDayModel[]>;
  eventSubscription = new Subject();
  pageSize = 5;
  currentPage = 0;
  dataResult: ItemsOfTheDayModel[] = [];
  totalSize = 0;
  isAdmin = false;
  @Select(CMSModelState.getItemsOfTheDay) itemsOfTheDayData$!: Observable<
    ItemsOfTheDayModel[]
  >;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private modalService: ModalService,
    private commonService: CommonActivityService
  ) {}
  /**
   * Lifecycle hook for angular which executes when component initializes
   * @returns void.
   */
  ngOnInit(): void {
    this.checkRole();
    this.setItemsOfTheDayForTable();
  }
  /**
   * Function to check the role of the logged in user
   * @returns void.
   */
  checkRole(): void {
    this.isAdmin = sessionStorage.getItem('role') === 'ADMIN';
  }
  /**
   * Function to fetch data from state and update table
   * @returns void.
   */
  setItemsOfTheDayForTable(): void {
    this.itemsOfTheDayData$.pipe(
      takeUntil(this.eventSubscription),
      filter((res) => res.length > 0)
      ).subscribe(
      (res: ItemsOfTheDayModel[]) => {
          this.dataResult = this.constructItems(res);
          this.totalSize = this.dataResult.length;
          this.dataSource = new MatTableDataSource(this.dataResult as any);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      },
      (err) => {}
    );
  }
  /**
   * Function to construct data based on user role
   * @param res fetched items of the day list
   * @returns {ItemsOfTheDayModel[]}.
   */
  constructItems(res: ItemsOfTheDayModel[]): ItemsOfTheDayModel[] {
    return this.isAdmin
      ? res.map((el: ItemsOfTheDayModel, i: number) => {
          return {
            ...el,
            id: i + 1,
            actions: '',
          };
        })
      : res
          .filter((elm) => elm.itemQuantity > 0)
          .map((el: ItemsOfTheDayModel, i: number) => {
            return {
              ...el,
              id: i + 1,
              actions: '',
            };
          });
  }
  /**
   * Function to delete item
   * @param res item which needs to be deleted
   * @returns void.
   */
  deleteItem(row: ItemsOfTheDayModel): void {
    this.store.dispatch(new DeleteItemsOfTheDay(row));
  }
  /**
   * Function to edit item
   * @param res item which needs to be edited
   * @returns void.
   */
  editItem(row: ItemsOfTheDayModel): void {
    this.dialog.closeAll();
    const { itemCode, itemName, basePrice, itemQuantity } = row;
    const fetchedItemQuantity = this.store
      .selectSnapshot(CMSModelState.getItemsOfTheDay)
      .find((elm) => elm.itemCode === itemCode).itemQuantity;
    const fetchedAvailableQuantity = this.store
      .selectSnapshot(CMSModelState.getAvailableItems)
      .find((elm) => elm.itemCode === itemCode).itemQuantity;
    const maxQuantity = fetchedAvailableQuantity + fetchedItemQuantity;
    this.modalService
      .openModal(
        AddEditItemComponent,
        {
          action: 'Edit',
          itemCode,
          itemName,
          basePrice,
          itemQuantity,
          maxQuantity,
        },
        '22vw',
        '40vh'
      )
      .afterClosed()
      .subscribe(([items, avitems]) => {
        if (items && avitems) {
          this.store.dispatch(new EditItemsOfTheDay(items));
          this.store.dispatch(new UpdateAvailableItems(avitems));
          this.commonService.setChange(true);
        }
      });
  }
  /**
   * Function to add new item
   * @returns void.
   */
  addItem(): void {
    this.dialog.closeAll();
    this.modalService
      .openModal(PickDayItemComponent, {}, '36vw', '20vh')
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const itemToAdd = {
            ...res.items,
            itemQuantity: res.totalQuantity,
          };
          this.store.dispatch(new AddItemsOfTheDay(itemToAdd));
          const updateAvailableItem = {
            ...res.items,
            itemQuantity: res.items.itemQuantity - res.totalQuantity,
          };
          this.store.dispatch(new UpdateAvailableItems(updateAvailableItem));
        }
      });
  }
  /**
   * Function to buy item in case of employee role
   * @returns void.
   */
  buyItem(): void {
    const balance = this.store.selectSnapshot(CMSModelState.getUserData).find((el) => el.empId === sessionStorage.getItem('empId')).balance;
    this.dialog.closeAll();
    this.modalService
      .openModal(BuyItemComponent, {
        balance
      }, '50vw', '48vh')
      .afterClosed()
      .subscribe(([items, total]) => {
        if (items && total) {
          //* update items of the day
          items.forEach((el: any) => {
            if (el.selectedItem && Object.keys(el.selectedItem).length > 0) {
              const payload = {
                ...el.selectedItem,
                itemQuantity: el.selectedItem.itemQuantity - el.quantity
              };
              this.store.dispatch(new EditItemsOfTheDay(payload));
            }
          })
          const foundUser = this.store.selectSnapshot(CMSModelState.getUserData).find((el) => el.empId === sessionStorage.getItem('empId'));
          //* update transactions
          const {name, email, empId} = foundUser;
          const item = items.reduce((acc: string, elm: any) => elm.selectedItem ? acc += ' ' + elm.selectedItem.itemName : '' , '');
          const transactionObj: TransactionDetailsModel = {
            name,
            email,
            empId,
            transactionAmount: total,
            source: sessionStorage.getItem('role') === 'ADMIN' ? 'admin' : 'self',
            dateDetail: new Date().getTime(),
            type: 'debit',
            item
          };
          this.store.dispatch(new AddTransaction(transactionObj));
          //* update amount for user

          foundUser.balance = foundUser.balance - total;
          this.store.dispatch(new UpdateUser(foundUser));
          // const itemToAdd = {
          //   ...res.items,
          //   itemQuantity: res.totalQuantity
          // }
          // this.store.dispatch(new EditItemsOfTheDay(itemToAdd));
          // const updateAvailableItem = {
          //   ...res.items,
          //   itemQuantity: res.items.itemQuantity - res.totalQuantity
          // };
          // this.store.dispatch(new UpdateAvailableItems(updateAvailableItem));
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
