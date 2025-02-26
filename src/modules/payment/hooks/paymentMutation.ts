import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPayment } from "../../../stores/interfaces/Payment";
import axios from "axios";

export const addBillPaymentQuery = () => {
    const queryClient = useQueryClient();
    const addBillPayment = async (payload: addPayment) => {
        await axios.post("/bill-payment/create", payload);
    };
    const mutation = useMutation({
        mutationFn: (payloadQuery: addPayment) => addBillPayment(payloadQuery),
    });
    return mutation;
};
