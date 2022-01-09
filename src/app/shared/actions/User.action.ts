import { UserModel } from "../models/User.model";

export class SetUser {
  static readonly type = `[CMS] SetUser`;

  constructor(public payload: UserModel[]) {}
}
export class AddUser {
  static readonly type = `[CMS] AddUser`;

  constructor(public payload: UserModel) {}
}
export class UpdateUser {
  static readonly type = `[CMS] UpdateUser`;

  constructor(public payload: UserModel) {}
}
