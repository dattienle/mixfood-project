export interface Account {
  id: number;
  email: string;
  isDeleted: boolean;
  role:{
    id:number;
    name: string
  };
  diseases: string;
  
  detail: {
    id: number;
    name: string;
    phone: string;
    address: string;
  };
  tdee: number;
  targetCalo: number;
  caloriesConsumedToday: number
}