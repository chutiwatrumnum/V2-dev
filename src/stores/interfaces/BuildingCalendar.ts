import type { Dayjs } from "dayjs";
export interface BuildingCalendarDataType {
  buildingCalendarEventData: EventDataType[];
  selectedCalendarType: number[];
  monthSelected: Dayjs;
  isLoading: boolean;
}
[];

export interface EventDataType {
  date: string;
  detail: DetailType[];
}

export interface DetailType {
  event: string;
  title: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  note: any;
  colorCode: string;
  type?: string;
  bookedBy?: string;
  contactNo?: string;
}
