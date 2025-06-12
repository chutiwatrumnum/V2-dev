import { createModel } from "@rematch/core";
import { message } from "antd";
import {
  UserType,
  LoginPayloadType,
  ResetPasswordPayloadType,
} from "../interfaces/User";
import { RootModel } from "./index";
import { encryptStorage } from "../../utils/encryptStorage";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const userAuth = createModel<RootModel>()({
  state: {
    userId: null,
    userFirstName: "Den",
    userLastName: "Tao",
    isAuth: false,
    userToken: null,
  } as UserType,
  reducers: {
    updateUserIdState: (state, payload) => ({
      ...state,
      userId: payload,
    }),
    updateUserFirstNameState: (state, payload) => ({
      ...state,
      userFirstName: payload,
    }),
    updateUserLastNameState: (state, payload) => ({
      ...state,
      userLastName: payload,
    }),
    updateAuthState: (state, payload) => ({
      ...state,
      isAuth: payload,
    }),
  },
  effects: (dispatch) => ({
    async loginEffects(payload: LoginPayloadType) {
      try {
        let data = { username: payload.username, password: payload.password };
        const userToken = await axios.post("/auth/dashboard/login", data);

        if (userToken.status >= 400) {
          message.error(userToken.data.message);
          return;
        }
        encryptStorage.setItem("accessToken", userToken.data.accessToken);
        encryptStorage.setItem("refreshToken", userToken.data.refreshToken);
        dispatch.userAuth.refreshUserDataEffects();
        dispatch.userAuth.updateAuthState(true);
      } catch (error) {
        console.error("ERROR", error);
      }
    },
    async recoveryByEmail(payload: { email: string }) {
      try {
        const result = await axios.post("/users/forgot-password", payload);
        if (result.status >= 400) {
          return message.error(result.data.message);
        }
        dispatch.common.updateSuccessModalState({
          open: true,
          text: "Successfully sent",
        });
      } catch (error) {
        console.error("ERROR", error);
      }
    },
    async resetPassword(payload: ResetPasswordPayloadType) {
      try {
        const result = await axios.put("/users/forgot-password", payload);
        if (result.status >= 400) {
          message.error(result.data.message);
          return result.status;
        }
        return result.status;
      } catch (error) {
        console.error("ERROR", error);
      }
    },
    async refreshToken(payload: { token: string }) {
      const navigate = useNavigate();
      try {
        const newToken = await axios.post("/users/refresh-token", payload);
        if (newToken.status >= 400) {
          encryptStorage.removeItem("accessToken");
          encryptStorage.removeItem("refreshToken");
          dispatch.userAuth.updateAuthState(false);
          navigate("/auth");
          return false;
        }
        encryptStorage.setItem("accessToken", newToken.data.accessToken);
        dispatch.userAuth.updateAuthState(true);
        return true;
      } catch (error) {
        console.error("ERROR", error);
      }
    },
    async refreshTokenNew() {
      try {
        const refreshToken = await encryptStorage.getItem("refreshToken");
        const res = await axios.post("/users/refresh-token", {
          token: refreshToken,
        });
        if (res.status >= 400) throw "refresh token expaired";
        if (!res.data.hasOwnProperty("accessToken"))
          throw "accessToken not found";
        dispatch.userAuth.updateAuthState(true);
        encryptStorage.setItem("accessToken", res.data.accessToken);
        return true;
      } catch (error) {
        dispatch.userAuth.updateAuthState(false);
        await axios.post("/users/logout");
        encryptStorage.removeItem("accessToken");
        encryptStorage.removeItem("refreshToken");
        return false;
      }
    },
    async onLogout() {
      try {
        await axios.post("/users/logout");
        encryptStorage.removeItem("accessToken");
        encryptStorage.removeItem("refreshToken");
        dispatch.userAuth.updateAuthState(false);
        return true;
      } catch (error) {
        dispatch.userAuth.updateAuthState(false);
        encryptStorage.removeItem("accessToken");
        encryptStorage.removeItem("refreshToken");
        return false;
      }
    },
    async logoutEffects() {
      try {
        const logout = await axios.post("/users/logout");
        if (logout.status >= 400) {
          console.log("FAILED ", logout.statusText);
          return;
        }
        dispatch.userAuth.updateAuthState(false);
        encryptStorage.removeItem("accessToken");
        encryptStorage.removeItem("refreshToken");
      } catch (error) {
        console.error("ERROR", error);
      }
    },
    async refreshUserDataEffects() {
      try {
        const userData = await axios.get("/mcst/profile");
        if (userData.status >= 400) return console.error(userData.data.message);
        // console.log(userData.data.result);
        encryptStorage.setItem("userData", userData.data.result);
      } catch (error) {
        console.error("ERROR", error);
      }
    },
  }),
});
