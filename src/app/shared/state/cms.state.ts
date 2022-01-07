import { Action, Selector, State, StateContext } from "@ngxs/store";
import { AddAmount } from "../actions/Amount.action";
import { AddAvailableItems, AddItemsOfTheDay, SetAvailableItems, SetItemsOfTheDay } from "../actions/Items.action";
import { AddTransaction, SetTransaction } from "../actions/Transactions.action";
import { AddUser, SetUser } from "../actions/User.action";
import { AvailableItemsModel } from "../models/AvailableItems.model";
import { ItemsOfTheDayModel } from "../models/ItemsOfTheDay.model";
import { TransactionDetailsModel } from "../models/TransactionDetails.model";
import { UserModel } from "../models/User.model";
import { patch, updateItem } from '@ngxs/store/operators';

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
    { getState, patchState }: StateContext<CMSModel>,
    { payload }: AddUser
  ): void {
    const state = getState();
    patchState({
      userList: [...state.userList, payload] as any,
    });
  }
  @Action(AddAmount)
  addAmount(
    { setState }: StateContext<CMSModel>,
    { payload }: AddAmount
  ): void {
    setState(
      patch({
        userList: updateItem((item: any) => item.empId === payload.empId, patch({ balance: payload.newAmount }))
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
    { getState, patchState }: StateContext<CMSModel>,
    { payload }: AddTransaction
  ): void {
    const state = getState();
    patchState({
      transactionList: [...state.userList, payload] as any,
    });
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
    { getState, patchState }: StateContext<CMSModel>,
    { payload }: AddItemsOfTheDay
  ): void {
    const state = getState();
    patchState({
      itemsOfTheDay: [...state.itemsOfTheDay, payload] as any,
    });
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
    { getState, patchState }: StateContext<CMSModel>,
    { payload }: AddAvailableItems
  ): void {
    const state = getState();
    patchState({
      availableItems: [...state.availableItems, payload] as any,
    });
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
