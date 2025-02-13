import type { Dayjs } from "dayjs";
export interface DataType {
  key: string;
  refBooking: string;
  purpose: string;
  joiningDate: string;
  unitNo: string;
  status: string;
  createdAt: string;
  startEndTime: string;
  bookedBy: string;
  approve: boolean;
  reject: boolean;
  juristicConfirm: boolean;
}
export interface facilitieType {
  paramsAPI: conditionPage;
  reserveSlotTime: ReserveSlotTimeDataType;
  peopleCountingData?: PeopleCountingDataType;
}
export interface ReserveSlotTimeType {
  id: number;
  date: string;
}

export interface CreateMaintenanceFacilities {
  facilitiesId: number | null;
  sendMailGroup?: string[];
  sendMailGroupId?: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  note?: string;
  remindNotiDays?: number;
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
  facilitiesId: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
  sortBy?: string;
}

export interface dataItem {
  label: string;
  value: number;
  imageId: string;
  validDateNumber: number;
}
export interface pageType {
  defaultPageSize: number;
  pageSizeOptions: number[];
  current: number;
  showSizeChanger: boolean;
  total: number;
}
export interface ReserveFacilityType {
  userId: string;
  purpose: string;
  joinAt: string;
  facilityId: number;
  slotTimeId: number;
  note: string | null | undefined;
  contactNo: string;
  email: string;
}
export interface Ibooking {
  id: number;
  startTime: string;
  endTime: string;
  isLocked: boolean;
  sessionType: string;
  referralBooking: ReferralBooking | null;
}

export interface ReferralBooking {
  id: number;
  refBooking: string;
  joinAt: string;
  startTime: string;
  endTime: string;
  contactNo: string;
  unit: string;
  bookingBy: string;
}
export interface PeopleCountingDataType {
  id: number;
  roomName: string;
  description: string;
  priority: number;
  active: boolean;
  roomImgs: string;
  totalPeople: number;
  lowStatus: number;
  mediumStatus: number;
  highStatus: number;
  updatedAt: string;
  open?: string;
  close?: string;
}

export interface ReserveSlotTimeDataType {
  id: number;
  name: string;
  subName: string;
  lockedSlotTime: boolean;
  sessionGroupByTab: boolean;
  checkMaxDayCanBook: boolean;
  maxDayCanBook: number;
  checkMinDayCanBook: boolean;
  minDayCanBook: number;
  slotTime: SlotTimeType[];
}

export interface SlotTimeType {
  sessionGroup: string;
  data: SlotTimeDataType[];
}

export interface SlotTimeDataType {
  id: number;
  startTime: string;
  endTime: string;
  isLocked: boolean;
  isPeakTime: boolean;
  sessionType: string;
  active: boolean;
}
