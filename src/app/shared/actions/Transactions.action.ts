import { TransactionDetailsModel } from "../models/TransactionDetails.model";

export class SetTransaction {
  static readonly type = `[CMS] SetTransaction`;

  constructor(public payload: TransactionDetailsModel[]) {}
}
export class AddTransaction {
  static readonly type = `[CMS] AddTransaction`;

  constructor(public payload: TransactionDetailsModel) {}
}
