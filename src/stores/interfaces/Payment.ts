import type { ColumnsType } from "antd/es/table";
export interface addPayment {
    unitId: number;
    startDue?: string;
    endDue?: string;
    startMonthly: string;
    endMonthly: string;
    billTypeId: number;
    amount: number;
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
export interface DataType {
    key: string;
    unitNo: string;
    billType: string;
    billStatus: string;
    amount: string;
    startMonthly: string;
    endMonthly: string;
    createdAt: string;
    createdBy: string;
}
export interface resdata {
    status: number;
    data: any;
}
export interface residentType {
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
    verifyByJuristic: boolean;
    search?: string;
    startDate?: string;
    endDate?: string;
    sort?: string;
    sortBy?: string;
    reject?: boolean;
    isActive: boolean;
}
export interface rejectRequest {
    userId: string;
    rejectReason: string;
}
export interface columnTable {
    defaultTable: ColumnsType<DataType>;
    allTabsColumn: ColumnsType<DataType>;
    rejectTabsColumn: ColumnsType<DataType>;
    waitActiveTabsColumn: ColumnsType<DataType>;
}
export interface selectListType {
    label: string;
    value: string;
}
