export interface Package{
  id: number;
  title: string;
  description: string;
  price: number;
  subPackage: SubPackage[];
}

export interface SubPackage {
  id: number;
  name: string;
}