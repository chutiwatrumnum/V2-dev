import type { Dayjs } from "dayjs";
export interface DataAnnouncementType {
  id: number;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  users: {
    id: string;
    lastName: string;
    firstName: string;
    middleName: string;
    email: string;
  };
  unitList: number[];
  all: boolean;
}
[];

export interface AnnounceType {
  tableData: DataAnnouncementType[];
  announcementMaxLength: number;
}
export interface AnnouncePayloadType {
  search: string | null;
  curPage: number;
  perPage: number;
  startDate: Date | null;
  endDate: Date | null;
}

export interface AddNewAnnouncementType {
  id: number | null | undefined;
  title: string;
  description: string;
  url: string;
  image64: string | undefined;
  startDate: string | Dayjs;
  endDate: string | Dayjs;
  unitList: number[];
  imageUrl: string | null | undefined;
  all?: boolean;
}
