import { Dayjs } from "dayjs";

export interface historyVisitorDataType {
    key: string;
    idCard: string;
    licensePlate: string;
    homeAddress: string;
    checkIn: Dayjs;
    checkOut: Dayjs;
    status: string;
}
