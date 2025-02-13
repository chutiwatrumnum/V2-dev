import { Dayjs } from "dayjs";

export interface HistoryVisitorDataType {
  key: string;
  idCard: string;
  licensePlate: string;
  homeAddress: string;
  checkIn: string;
  checkInType:"รอดําเนินการ" | "อยู่ในโครงการ";
  checkInIsActiveButton:boolean
  checkOut: string;
  checkOutIsActiveButton:boolean
  fullName: string;
  IsActiveButton:boolean
  status: "ยังไม่ได้รับการแสตมป์" | "แสตมป์แล้ว"| "ออกจากโครงการแล้ว";
  inverterType: "Whitelist" | "Blacklist"|"Visitor";
  appointmentDay:string

}


export interface UpdateByUserType {
  lastName: string;
  firstName: string;
  email: string;
}

export interface ManagementFormDataType {
  key?: string;
  image?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string | null;
  role?: string;
  contact?: string;
  email?: string;
}

export interface ManagementAddDataType {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  roleId: number;
  contact: string;
  channel: string;
  imageProfile?: string;
}
export interface blockDetail {
  label: string;
  value: number;
}
export interface unitDetail {
  label: string;
  value: number;
}
export interface roleDetail {
  label: string;
  value: number;
}
export interface hobbyDetail {
  label: string;
  value: number;
}
export interface resdata {
  status: number;
  data: any;
}
export interface HistoryVisitorType {
  tableData: HistoryVisitorDataType[];
  loading: boolean;
  total: number;
  residentMaxLength: number;
}

export interface conditionPage {
  perPage: number;
  curPage: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
  sortBy?: string;
}
