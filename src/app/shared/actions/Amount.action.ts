export class AddAmount {
  static readonly type = `[CMS] AddAmount`;

  constructor(public payload: {empId: string, balance: number}) {}
}
