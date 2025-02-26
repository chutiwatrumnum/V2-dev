import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { selectListType } from "../../../stores/interfaces/Payment";

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
            console.log("getBillPaymentMasterDataListQuery:",data);
            const dataBillTypeSelectLists: selectListType[] = [];
            data.billType.map((e:any)=>{
                const dataSelectList: selectListType = {
                    label: e.nameEn,
                    value: e.id.toString(),
                };
                dataBillTypeSelectLists.push(dataSelectList);
            })
            const dataUnitSelectLists: selectListType[] = [];
            data.unit.map((e:any)=>{
                const dataSelectList: selectListType = {
                    label: e.unitNo,
                    value: e.id.toString(),
                };
                dataUnitSelectLists.push(dataSelectList);
            })
            
            return{dataBillTypeSelectLists:dataBillTypeSelectLists,dataUnitSelectLists:dataUnitSelectLists}
        },
        
    });
    return { ...query };
};
