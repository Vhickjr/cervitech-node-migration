export interface TransactionViewModel {
  id?: string;
  paymentRef: string;
  amount: number;
  status: number;
  transDate: Date;
  description?: string;
}
