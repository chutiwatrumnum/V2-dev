import axios from "axios";
import { encryptStorage } from "../utils/encryptStorage";
import { API_URL } from "./configs";
import { NavigateFunction } from "react-router-dom";
import { Dispatch } from "../stores";
axios.defaults.baseURL = API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.request.use(
    async (request) => {
        const accessToken = await encryptStorage.getItem("accessToken");
        if (accessToken !== undefined) {
            request.headers.Authorization = `Bearer ${accessToken}`;
        }
        return request;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);
let isRefreshing = false;
export const setupAxiosInterceptors = (navigate: NavigateFunction, dispatch: Dispatch) => {
    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // If the error status is 401 and there is no originalRequest._retry flag,
            // it means the token has expired and we need to refresh it
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                if (!isRefreshing) {
                    isRefreshing = true;

                    try {
                        const response = await axios.post("/users/refresh-token", {
                            token: encryptStorage.getItem("refreshToken"),
                        });
                        console.log("resfresh token response :: ", response);

                        if (response.status === 200) {
                            //update the access token
                            encryptStorage.setItem("accessToken", response.data.accessToken);

                            originalRequest.headers["Authorization"] = `Bearer ${response.data.accessToken}`;

                            return axios(originalRequest);
                        }
                    } catch (error: any) {
                        console.log("refesh token error :: ", error);
                        dispatch.common.updateSuccessModalState({
                            open: true,
                            status: "error",
                            text: "Token expired Please login again.",
                        });
                        setTimeout(() => {
                            encryptStorage.clear();
                            dispatch.userAuth.updateAuthState(false);
                            navigate("/auth", { replace: true });
                        }, 1000);

                        // Handle refresh token error or redirect to login
                    } finally {
                        isRefreshing = false;
                    }
                }
            }
            // console.log("interceptors error :: ", error);

            return Promise.reject(error);
        }
    );
};
