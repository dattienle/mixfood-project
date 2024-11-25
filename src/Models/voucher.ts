interface Voucher {
  id: number;
  code: string;
  discountPercentage: string ;
  expirationDate: string;
  isActive: boolean;
}

export default Voucher;