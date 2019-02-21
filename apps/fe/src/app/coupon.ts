export class Coupon {
  code: string;
  owner: string;
  name: string;
  note: string;
}

export class Transaction {
  TxId: string;
  Value: Coupon;
  Timestamp: string;
  IsDelete: string;
}
