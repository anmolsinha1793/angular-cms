export interface TransactionDetailsModel {
  name: string;
  email: string;
  empId: string;
  transactionAmount: number;
  dateDetail: number;
  source: string;
  type: string;
  item?: string;
}
