import type { ColumnsType } from "antd/es/table";
export interface addPayment {
    unitId: number;
    startDue?: string;
    endDue?: string;
    startMonthly: string;
    endMonthly: string;
    billTypeId: number;
    amount: number;
    currency:string;
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
    byOutDate?: boolean;
    search?: string;
    startBillMonthly?: string;
    endBillMonthly?: string;
    byBillTypeId?: string;
    byBillStatusId?: string;
    sort?: string;
    sortBy?: string;
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
export interface TabsListType {
    label: string;
    key: string;
}

export interface BillGroupByYearly {
    month: string;
    total: number;
}
export interface filterBillPaymentDashboard {
    startMonth: string|null;
    endMonth: string|null;
}
export interface billPaymentDashboardDataType {
    date:                  string;
    receivedAmount:        string;
    totalBill:             string;
    electricityBillAmount: string;
    waterBillAmount:       string;
    maintenanceFeeAmount:  string;
}
export interface paymentStatusMonthly {
    statusNameCode:string
    status:string;
    total:number;
}

export interface currencyType {
    id: number;
    code: string;
    name: string;
    symbol: string;
    active: boolean;
}