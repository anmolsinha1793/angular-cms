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
export class EditItemsOfTheDay {
  static readonly type = `[CMS] EditItemsOfTheDay`;

  constructor(public payload: ItemsOfTheDayModel) {}
}
export class UpdateItemsOfTheDay {
  static readonly type = `[CMS] UpdateItemsOfTheDay`;

  constructor(public payload: ItemsOfTheDayModel) {}
}
export class DeleteItemsOfTheDay {
  static readonly type = `[CMS] DeleteItemsOfTheDay`;

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
export class UpdateAvailableItems {
  static readonly type = `[CMS] UpdateAvailableItems`;

  constructor(public payload: AvailableItemsModel) {}
}

export class DeleteAvailableItems {
  static readonly type = `[CMS] DeleteAvailableItems`;

  constructor(public payload: AvailableItemsModel) {}
}
