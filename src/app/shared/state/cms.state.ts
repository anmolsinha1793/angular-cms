import { Action, Selector, State, StateContext } from "@ngxs/store";
import { AddAvailableItems, AddItemsOfTheDay, DeleteAvailableItems, DeleteItemsOfTheDay, EditItemsOfTheDay, SetAvailableItems, SetItemsOfTheDay, UpdateAvailableItems } from "../actions/Items.action";
import { AddTransaction, SetTransaction } from "../actions/Transactions.action";
import { AddUser, SetUser, UpdateUser } from "../actions/User.action";
import { AvailableItemsModel } from "../models/AvailableItems.model";
import { ItemsOfTheDayModel } from "../models/ItemsOfTheDay.model";
import { TransactionDetailsModel } from "../models/TransactionDetails.model";
import { UserModel } from "../models/User.model";
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { Injectable } from "@angular/core";

// Section 2
export class CMSModel {
  userList: UserModel[] = [];
  itemsOfTheDay: ItemsOfTheDayModel[] = [];
  availableItems: AvailableItemsModel[] = [];
  transactionList: TransactionDetailsModel[] = [];
}


@State<CMSModel>({
  name: 'cmsModel',
  defaults: {
    userList: [],
    itemsOfTheDay: [],
    availableItems: [],
    transactionList: [],
  },
})
@Injectable()
export class CMSModelState {
  @Selector()
  static getUserData(state: CMSModel): UserModel[] {
    return state.userList;
  }
  @Selector()
  static getItemsOfTheDay(state: CMSModel): ItemsOfTheDayModel[] {
    return state.itemsOfTheDay;
  }
  @Selector()
  static getAvailableItems(state: CMSModel): AvailableItemsModel[] {
    return state.availableItems;
  }
  @Selector()
  static getTransactionList(state: CMSModel): TransactionDetailsModel[] {
    return state.transactionList;
  }

  @Action(SetUser)
  setUser(
    { getState, patchState }: StateContext<CMSModel>,
    { payload }: SetUser
  ): void {
    patchState({
      userList: [...payload] as any,
    });
  }
  @Action(AddUser)
  addUser(
    { getState, patchState, setState }: StateContext<CMSModel>,
    { payload }: AddUser
  ): void {
    // const state = getState();
    // patchState({
    //   userList: [...state.userList, payload] as any,
    // });
    setState(
      patch({
        userList: append([payload])
      })
    );
  }
  @Action(UpdateUser)
  updateUser(
    { getState, patchState, setState }: StateContext<CMSModel>,
    { payload }: UpdateUser
  ): void {
    setState(
      patch({
        userList: updateItem<UserModel>((item)=> item.empId === payload.empId, payload)
      })
    );
  }

  @Action(SetTransaction)
  setTransaction(
    { getState, patchState }: StateContext<CMSModel>,
    { payload }: SetTransaction
  ): void {
    patchState({
      transactionList: [...payload] as any,
    });
  }
  @Action(AddTransaction)
  addTransaction(
    { getState, patchState, setState }: StateContext<CMSModel>,
    { payload }: AddTransaction
  ): void {
    // const state = getState();
    // patchState({
    //   transactionList: [...state.transactionList, payload] as any,
    // });
    setState(
      patch({
        transactionList: append([payload])
      })
    );
  }
  @Action(SetItemsOfTheDay)
  setItemsOfTheDay(
    { getState, patchState }: StateContext<CMSModel>,
    { payload }: SetItemsOfTheDay
  ): void {
    patchState({
      itemsOfTheDay: [...payload] as any,
    });
  }
  @Action(AddItemsOfTheDay)
  addItemsOfTheDay(
    { getState, patchState, setState }: StateContext<CMSModel>,
    { payload }: AddItemsOfTheDay
  ): void {
    setState(
      patch({
        itemsOfTheDay: append([payload])
      })
    );
  }

  @Action(EditItemsOfTheDay)
  editItemsOfTheDay(
    { getState, patchState, setState }: StateContext<CMSModel>,
    { payload }: EditItemsOfTheDay
  ): void {
    setState(
      patch({
        itemsOfTheDay: updateItem<ItemsOfTheDayModel>((item) => item.itemCode === payload.itemCode, payload)
      })
    );
  }
  @Action(DeleteItemsOfTheDay)
  deleteItemsOfTheDay(
    { getState, patchState, setState }: StateContext<CMSModel>,
    { payload }: DeleteItemsOfTheDay
  ): void {
    setState(
      patch({
        itemsOfTheDay: removeItem<ItemsOfTheDayModel>((item) => item.itemCode === payload.itemCode)
      })
    );
  }

  @Action(SetAvailableItems)
  setAvailableItems(
    { getState, patchState }: StateContext<CMSModel>,
    { payload }: SetAvailableItems
  ): void {
    patchState({
      availableItems: [...payload] as any,
    });
  }
  @Action(AddAvailableItems)
  addAvailableItems(
    { getState, patchState, setState }: StateContext<CMSModel>,
    { payload }: AddAvailableItems
  ): void {
    // const state = getState();
    // patchState({
    //   availableItems: [...state.availableItems, payload] as any,
    // });
    setState(
      patch({
        availableItems: append([payload])
      })
    );
  }
  @Action(UpdateAvailableItems)
  updateAvailableItems(
    { getState, patchState, setState }: StateContext<CMSModel>,
    { payload }: UpdateAvailableItems
  ): void {
    setState(
      patch({
        availableItems: updateItem<AvailableItemsModel>((item) => item.itemCode === payload.itemCode, payload)
      })
    )
  }
  @Action(DeleteAvailableItems)
  deleteAvailableItems(
    { getState, patchState, setState }: StateContext<CMSModel>,
    { payload }: DeleteAvailableItems
  ): void {
    setState(
      patch({
        availableItems: removeItem<AvailableItemsModel>((item) => item.itemCode === payload.itemCode)
      })
    );
  }
  // @Action(AddItemsOfTheDay)
  // addItemsOfTheDay(
  //   { getState, patchState }: StateContext<CMSModel>,
  //   { payload }: AddItemsOfTheDay
  // ): void {
  //   const state = getState();
  //   patchState({
  //     itemsOfTheDay: [...state.userList, payload] as any,
  //   });
  // }
}
