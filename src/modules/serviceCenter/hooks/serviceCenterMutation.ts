import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DeleteImage, EditDataServiceCenter, UploadImage } from "../../../stores/interfaces/ServiceCenter";
import { showSuccessModal, showErrorModal } from "../../../utils/modals";

export const editServiceCenterQuery = () => {
    const queryClient = useQueryClient();

    const editServiceCenter = async (payload: EditDataServiceCenter) => {
        let response;
        switch (payload.currentStatus) {
            case "Pending":
                response = await axios.put("/service-center/pending", payload);
                break;
            case "Repairing":
                response = await axios.put("/service-center/repairing", payload);
                break;
            case "Success":
                response = await axios.put("/service-center/success", payload);
                break;
            default:
                throw new Error("Invalid status");
        }
        return response.data;
    };

    const mutation = useMutation({
        mutationFn: (payloadQuery: EditDataServiceCenter) => editServiceCenter(payloadQuery),
        onSuccess: () => {
            showSuccessModal("Successfully updated");
            queryClient.invalidateQueries({ queryKey: ["serviceCenterList"] });
            queryClient.invalidateQueries({ queryKey: ["serviceCenterByServiceID"] });
        },
        onError(error: any) {
            showErrorModal(error?.response?.data?.message || "Failed to update service center");
        },
    });

    return mutation;
};

export const deleteImageServiceCenterQuery = () => {
    const deleteImageServiceCenter = async (payload: DeleteImage) => {
        const { data } = await axios.delete("/service-center/delete-image", {
            data: payload
        });
        return data;
    };

    const mutation = useMutation({
        mutationFn: (payloadQuery: DeleteImage) => deleteImageServiceCenter(payloadQuery),
        onSuccess: () => {
            showSuccessModal("Image deleted successfully");
        },
        onError(error: any) {
            showErrorModal(error?.response?.data?.message || "Failed to delete image");
        },
    });

    return mutation;
};

export const uploadImageServiceCenterQuery = () => {
    const uploadImageServiceCenter = async (payload: UploadImage) => {
        const { data } = await axios.post("/service-center/upload-image", payload);
        return data.imageBucket;
    };

    const mutation = useMutation({
        mutationFn: (payloadQuery: UploadImage) => uploadImageServiceCenter(payloadQuery),
        onSuccess: (data) => {
            showSuccessModal("Image uploaded successfully");
            return data;
        },
        onError(error: any) {
            showErrorModal(error?.response?.data?.message || "Failed to upload image");
        },
    });

    return mutation;
};