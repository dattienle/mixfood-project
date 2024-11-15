// interfaces.ts
export interface SubPackage{
  id: number;
  name: string
}
export interface Package {
  id: number;
  title: string;
  description: string;
  price: number;
  subPackage: SubPackage
}
export interface TimePeriod{
  id: number;
  startTime: string
  endTime: string
}
export interface Requests{
  id: number;
  customerName: string;
  description: string;
  status: string;
requestDate: string
timePeriod: TimePeriod;
package: Package;
}
export interface EventType {
  
  date: string;
  
 
 requests: Requests
  
}
