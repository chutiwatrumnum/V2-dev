import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { billPaymentDashboardDataType, conditionPage, DataType, filterBillPaymentDashboard, selectListType, TabsListType } from "../../../stores/interfaces/Payment";
import dayjs from "dayjs";

export const useBillPaymentMasterDataListQuery = () => {
    const getBillPaymentMasterDataListQuery = async () => {
        const { data } = await axios.get("/bill-payment/master-data");
        return data.data;
    };
    const query = useQuery({
        queryKey: ["billPaymentMasterDataList"],
        queryFn: () => getBillPaymentMasterDataListQuery(),
        retry: false,
        select(data) {
            const dataBillPaymentStatusLists = data.billPaymentStatus.map((e: any) => {
                const dataSelectList: TabsListType = {
                    label: e.nameEn,
                    key: e.id.toString(),
                };
                return dataSelectList;
            });
            const dataBillTypeSelectLists = data.billType.map((e: any) => {
                const dataSelectList: selectListType = {
                    label: e.nameEn,
                    value: e.id.toString(),
                };
                return dataSelectList;
            });

            const dataUnitSelectLists = data.unit.map((e: any) => {
                const dataSelectList: selectListType = {
                    label: e.unitNo,
                    value: e.id.toString(),
                };
                return dataSelectList;
            });

            return {
                dataBillTypeSelectLists: dataBillTypeSelectLists,
                dataUnitSelectLists: dataUnitSelectLists,
                dataBillPaymentStatusLists: dataBillPaymentStatusLists,
            };
        },
    });
    return { ...query };
};
export const useBillPaymentListQuery = (payloadQuery: conditionPage) => {
    const getBillPaymentListQuery = async (payload: conditionPage) => {
        const params: any = {
            curPage: payload.curPage,
            perPage: payload.perPage,
        };
        if (payload.startBillMonthly || payload.endBillMonthly) {
            params.startBillMonthly = payload.startBillMonthly;
            params.endBillMonthly = payload.endBillMonthly;
        }

        if (payload.search) {
            params.search = payload.search;
        }
        if (payload.byBillTypeId) {
            params.byBillTypeId = payload.byBillTypeId;
        }
        if (payload.byBillStatusId) {
            params.byBillStatusId = payload.byBillStatusId;
        }
        if (payload.byOutDate) {
            params.byOutDate = payload.byOutDate;
        }
        if (payload.sort || payload.sortBy) {
            params.sort = payload.sort;
            params.sortBy = payload.sortBy;
        }
        const { data } = await axios.get("/bill-payment/dashboard/list", { params });

        return data.data;
    };
    const query = useQuery({
        queryKey: ["BillPaymentList"],
        queryFn: () => getBillPaymentListQuery(payloadQuery),
        retry: false,
        select(data) {
            const dataBillPaymentList = data.rows.map((items: any) => {
                const data: DataType = {
                    key: items.id,
                    unitNo: items.unit.unitNo,
                    billType: items.billType.nameEn,
                    billStatus: items.billStatus.nameEn,
                    amount: `${items.amount.toLocaleString("en")} ${items.currency}`,
                    startMonthly: items.startMonthly,
                    endMonthly: items.endMonthly,
                    createdAt: dayjs(items.createdAt).format("DD-MM-YYYY"),
                    createdBy: `${items.createdBy.firstName} ${items.createdBy.middleName ? items.createdBy.middleName : ""} ${items.createdBy.lastName}`,
                };
                return data;
            });
            return { dataBillPaymentList: dataBillPaymentList, total: data.total };
        },
    });
    return { ...query };
};

export const useBillPaymentChartListQuery = () => {
    const getBillPaymentChartListQuery = async () => {
        const { data } = await axios.get("/bill-payment/dashboard/chart");

        return data.data;
    };
    const query = useQuery({
        queryKey: ["BillPaymentChartList"],
        queryFn: () => getBillPaymentChartListQuery(),
        retry: false,
    });
    return { ...query };
};

export const useBillPaymentDashboardListQuery = (payloadQuery: filterBillPaymentDashboard) => {
    const getBillPaymentDashboardListQuery = async (payload: filterBillPaymentDashboard) => {
        const params = {
            startMonth: payload.startMonth,
            endMonth: payload.endMonth,
        };
        const { data } = await axios.get("/bill-payment/dashboard/dashboard-payment-list", { params });
        return data.data;
    };
    const query = useQuery({
        queryKey: ["BillPaymentDashboardList"],
        queryFn: () => getBillPaymentDashboardListQuery(payloadQuery),
        select(data) {
            const dataBillPaymentDashboardList = data.map((items: any) => {
                const data: billPaymentDashboardDataType = {
                    date: items.date,
                    receivedAmount: items.receivedAmount ? items.receivedAmount.toLocaleString("en") : "0",
                    totalBill: items.totalBill ? items.totalBill.toLocaleString("en") : "0",
                    electricityBillAmount: items.electricityBillAmount ? items.electricityBillAmount.toLocaleString("en") : "0",
                    waterBillAmount: items.waterBillAmount ? items.waterBillAmount.toLocaleString("en") : "0",
                    maintenanceFeeAmount: items.maintenanceFeeAmount ? items.maintenanceFeeAmount.toLocaleString("en") : "0",
                };
                return data;
            });

            return { dataBillPaymentDashboardList: dataBillPaymentDashboardList };
        },
        retry: false,
    });
    return { ...query };
};

export const useBillPaymentMasterCurrenyTypeListQuery = () => {
    const getBillPaymentMasterCurrenyTypeListQuery = async () => {
        const { data } = await axios.get("/master/currencies");

        return data.result.reverse();;
    };
    const query = useQuery({
        queryKey: ["BillPaymentCurrencyTypeList"],
        queryFn: () => getBillPaymentMasterCurrenyTypeListQuery(),

        retry: false,
    });
    return { ...query };
};
