import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPayment } from "../../../stores/interfaces/Payment";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../../stores";
import SuccessModal from "../../../components/common/SuccessModal";

export const addBillPaymentQuery = () => {
    const dispatch = useDispatch<Dispatch>();
    const queryClient = useQueryClient();
    const addBillPayment = async (payload: addPayment) => {
        console.log("payload:",payload);
        
        await axios.post("/bill-payment/create", payload);
    
    };
    const mutation = useMutation({
        mutationFn: (payloadQuery: addPayment) => addBillPayment(payloadQuery),
        onSuccess: () => {
            // SuccessModal("Successfully upload");
            // queryClient.invalidateQueries({ queryKey: ["serviceCenterList"] });
            // queryClient.invalidateQueries({ queryKey: ["serviceCenterByServiceID"] });
        },
        onError(error: any) {
            if (error?.response?.data?.message) {
                // FailedModal(error.response.data.message);
            }
        },
    });
    return mutation;
};