import { AvailableItemsModel } from "../models/AvailableItems.model";
import { ItemsOfTheDayModel } from "../models/ItemsOfTheDay.model";

export class SetItemsOfTheDay {
  static readonly type = `[CMS] SetItemsOfTheDay`;

  constructor(public payload: ItemsOfTheDayModel[]) {}
}
export class AddItemsOfTheDay {
  static readonly type = `[CMS] AddItemsOfTheDay`;

  constructor(public payload: ItemsOfTheDayModel) {}
}
export class SetAvailableItems {
  static readonly type = `[CMS] SetAvailableItems`;

  constructor(public payload: AvailableItemsModel[]) {}
}
export class AddAvailableItems {
  static readonly type = `[CMS] AddAvailableItems`;

  constructor(public payload: AvailableItemsModel) {}
}
