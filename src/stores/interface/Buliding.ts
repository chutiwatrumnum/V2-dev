import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
export interface BuildingActivitiesNew {
  typeId: number;
  sendMailGroup?: string[];
  sendMailGroupId?:number
  title: string;
  location?: string;
  date: string;
  startTime: string;
  endTime: string;
  note?: string;
  remindNotiDays?: number;
}
export interface BuildingActivitiesEdit {
  id:string
  typeId: number;
  sendMailGroup?: string[];
  sendMailGroupId?:number
  title: string;
  location?: string;
  date: string;
  startTime: string;
  endTime: string;
  note?: string;
  remindNotiDays?: number|null;
}
export interface MaintenanceFacilityEdit {
  id:number
  sendMailGroup?: string[];
  sendMailGroupId?:number
  title: string;
  location?: string;
  date: string;
  startTime: string;
  endTime: string;
  note?: string;
  remindNotiDays?: number|null;
}
export interface ParticipantGroup {
  groupName: string;
  email: string | string[];
}
export interface edidtDataParticipantGroup {
  id: number;
  groupName: string;
  email: string | string[];
}
export interface DataType {
  key: string;
  email: string[];
  no: string;
  calendarTypeName: string;
  groupname: string;
  title: string;
  date: string;
  time: string;
  startTime:string;
  endTime:string;
  createdBy: string;
  note: string;
  sendMailGroupId:string
  sendMailGroup:string[]|null
  remindNotiDays:number|null
  location:string|null
  facilitiesId:number
}
export interface emailGroupSelect {
  label: string;
  value: number;
}
export interface eventMasterGroupList {
  label: string;
  value: string;
}

export interface resdata {
  status: number;
  data: any;
}
export interface buildingType {
  tableData: DataType[];
  loading: boolean;
  total: number;
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
  perPage: number;
  curPage: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
  sortBy?: string;
}
export interface rejectRequest {
  userId: string;
  rejectReason: string;
}
export interface columnTable {
  buildingActivityTable: ColumnsType<DataType>;
  allTabsColumn: ColumnsType<DataType>;
}

export interface createBuildingActivities {
  userId: string;
  unitId: number;
  email: string;
  reminderNotification: number;
  senderType: string;
  trackingNumber: string;
  pickUpLocation: string;
  startDate: string | Dayjs;
  startTime: string | Dayjs;
  endDate: string | Dayjs;
  endTime: string | Dayjs;
  comment?: string;
}