import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { NearByPayloadType, NearBySelectListType } from "../../../stores/interfaces/NearBy";

export const useNearbyServiceListQuery = (payloadQuery: NearByPayloadType) => {
    const getNearbyServiceListQuery = async (payload: NearByPayloadType) => {
        const params: any = {
            curPage: payload.curPage,
            perPage: payload.perPage,
        };
        if (payload.search) {
            params.search = payload.search;
        }
        if (payload.filterByTypeId) {
            params.filterByTypeId = payload.filterByTypeId;
        }
        const { data } = await axios.get("/near-by/dashboard/list", { params });
        return data.data;
    };
    const query = useQuery({
        queryKey: ["nearbyServiceList", payloadQuery],
        queryFn: () => getNearbyServiceListQuery(payloadQuery),
        retry: false,
    });
    return { ...query };
};
export const useNearbyTypeQuery = () => {
    const getNearByType = async () => {
        const result = await axios.get("/near-by/type");
        const dataSelectLists: NearBySelectListType[] = [];

        result.data.data.map((e: any) => {
            const dataSelectList: NearBySelectListType = {
                label: e.nameEn,
                value: e.id.toString(),
            };
            dataSelectLists.push(dataSelectList);
        });
        return dataSelectLists;
    };
    const query = useQuery({
        queryKey: ["nearbyType"],
        queryFn: () => getNearByType(),
        retry: false,
    });
    return { ...query };
};
