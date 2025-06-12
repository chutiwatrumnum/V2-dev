export interface MSCTAddNew {
  firstName: string,
  middleName: string,
  lastName: string,
  email: string;
  roleId: number,
  contact: string,
  channel: string,
  imageProfile?: string
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
  middleName:string;
  lastName: string;
  image?: string;
  email: string;
  role: string;
  contact: string;
}
export interface resdata {
  status: number
  data: any
}
export interface MSCTType {
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
  search?: string
  startDate?: string
  endDate?: string
  sort?: string
  sortBy?: string
}