import type { Dayjs } from "dayjs";
export interface SummaryDataType {
  eventViewData: EventDataType[];
  monthSelected: Dayjs;
  isLoading: boolean;
}
[];

export interface EventDataType {
  dateGroup: string;
  data: DetailType[];
}

export interface DetailType {
  event?: string;
  title?: string;
  purpose?: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  note: any;
  colorCode: string;
  type?: string;
  bookedBy?: string;
  contactNo?: string;
  tag?: string;
}
