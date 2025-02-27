import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { conditionPage, DataType, selectListType, TabsListType } from "../../../stores/interfaces/Payment";
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
            console.log("getBillPaymentMasterDataListQuery:", data);
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
        console.log("payload:", payload);
        //curPage=1&perPage=10&startBillMonthly=2025-01&endBillMonthly=2025-12
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
            console.log("getBillPaymentListQuery:", data);
            const dataBillPaymentList = data.rows.map((items: any) => {
                const data: DataType = {
                    key: items.id,
                    unitNo: items.unit.unitNo,
                    billType: items.billType.nameEn,
                    billStatus: items.billStatus.nameEn,
                    amount: items.amount,
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
