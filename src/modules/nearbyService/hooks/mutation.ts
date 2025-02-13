import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DataNearByCreateByType } from "../../../stores/interfaces/NearBy";
import FailedModal from "../../../components/common/FailedModal";
import SuccessModal from "../../../components/common/SuccessModal";

export const addNearbyTypeServiceQuery = () => {
    const queryClient = useQueryClient();
    const addNewNearByService = async (payload: DataNearByCreateByType) => {
        await axios.post("/near-by", payload);
    };
    const mutation = useMutation({
        mutationFn: (payloadQuery: DataNearByCreateByType) => addNewNearByService(payloadQuery),
        onSuccess: () => {
            SuccessModal("Successfully Upload");
            queryClient.invalidateQueries({ queryKey: ["nearbyServiceList"] });
        },
        onError(error: any) {
            if (error?.response?.data?.message) {
                FailedModal(error.response.data.message);
            }
        },
    });
    return mutation;
};

export const editNearbyTypeServiceQuery = () => {
    const queryClient = useQueryClient();
    const editNearByService = async (payload: DataNearByCreateByType) => {
        await axios.put("/near-by", payload);
    };
    const mutation = useMutation({
        mutationFn: (payloadQuery: DataNearByCreateByType) => editNearByService(payloadQuery),
        onSuccess: () => {
            SuccessModal("Successfully Upload");
            queryClient.invalidateQueries({ queryKey: ["nearbyServiceList"] });
        },
        onError(error: any) {
            if (error?.response?.data?.message) {
                FailedModal(error.response.data.message);
            }
        },
    });
    return mutation;
};
export const deleteNearbyTypeServiceQuery = () => {
    const queryClient = useQueryClient();
    const deleteNearByService = async (payload: number) => {
        await axios.delete(`/near-by/${payload}`);
    };
    const mutation = useMutation({
        mutationFn: (payloadQuery: number) => deleteNearByService(payloadQuery),
        onSuccess: async () => {
            SuccessModal("Successfully Deleted");
            await queryClient.invalidateQueries({ queryKey: ["nearbyServiceList"] });
        },
        onError(error: any) {
            if (error?.response?.data?.message) {
                FailedModal(error.response.data.message);
            }
        },
    });
    return mutation;
};
