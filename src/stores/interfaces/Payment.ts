import type { ColumnsType} from "antd/es/table";
export interface ResidentAddNew {
  firstName: string;
  lastName: string,
  nickName: string,
  email: string;
  roleId: number,
  hobby: string,
  unitId: number,
  iuNumber: string
  contact: string,
  birthDate: string,
  channel: string,
  moveInDate: string,
  moveOutDate: string,
  imageProfile: string,
  middleName: string
}
export interface blockDetail {
  label: string
  value: number
}
export interface unitDetail {
  label: string
  value: number
}
export interface roleDetail {
  label: string
  value: number
}
export interface hobbyDetail {
  label: string
  value: number
}
export interface DataType {
  key: string;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  role: string;
  unitNo: string;
  iuNumber: string;
  contact: string;
  birthDate: string | null
  blockNo: string;
  hobby: string;
  moveInDate: string;
  moveOutDate: string;
  createdAt: string;
  rejectAt:string;
  rejectReason:string;
  rejectUser:string;
  middleName: string
}
export interface resdata {
  status: number
  data: any
}
export interface residentType {
  tableData: DataType[];
  loading: boolean
  total: number
  residentMaxLength: number;
}
export interface AnnouncePayloadType {
  search: string | null;
  curPage: number;
  perPage: number;
  startDate: Date | null;
  endDate: Date | null;
}

export interface conditionPage {
  perPage: number
  curPage: number
  verifyByJuristic: boolean
  search?: string
  startDate?: string
  endDate?: string
  sort?: string
  sortBy?: string
  reject?:boolean
  isActive: boolean
}
export interface rejectRequest{
  userId:string,
  rejectReason:string
}
export interface columnTable{
  defaultTable:ColumnsType<DataType>,
  allTabsColumn:ColumnsType<DataType>,
  rejectTabsColumn:ColumnsType<DataType>,
  waitActiveTabsColumn:ColumnsType<DataType>
}