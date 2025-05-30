export interface Transaction {
  _id: string;
  user: string;
  amount: number;
  status: string;
  type: string;
  midtransToken: string;
  midtransURL: string;
  createdAt: Date;
}
