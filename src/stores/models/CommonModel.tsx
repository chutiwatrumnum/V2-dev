import { createModel } from "@rematch/core";
import {
  CommonType,
  ConfirmModalType,
  AccessibilityType,
  MenuItemAccessibilityType,
} from "../interfaces/Common";
import { RootModel } from "./index";
import axios from "axios";

export const common = createModel<RootModel>()({
  state: {
    successModal: {
      open: false,
      status: null,
      text: "Successfully",
    },
    confirmModal: {
      open: false,
      title: "Title",
      description: "Lorem Ipsum",
      cancelText: "Cancel",
      confirmText: "Confirm",
      loading: false,
      onConfirm: () => {},
    },
    unitOptions: [],
    accessibility: undefined,
    unitFilter: undefined,
    masterData: undefined,
    monitorData: undefined,
    loading: false,
  } as CommonType,
  reducers: {
    updateSuccessModalState: (state, payload) => ({
      ...state,
      successModal: payload,
    }),
    updateConfirmModalState: (state, payload: ConfirmModalType) => ({
      ...state,
      confirmModal: payload,
    }),
    updateUnitOptions: (state, payload) => ({
      ...state,
      unitOptions: payload,
    }),
    updateAccessibility: (state, payload) => ({
      ...state,
      accessibility: payload,
    }),
    updateUnitFilter: (state, payload) => ({
      ...state,
      unitFilter: payload,
    }),
    updateMasterData: (state, payload) => ({
      ...state,
      masterData: payload,
    }),
    updateMonitorData: (state, payload) => ({
      ...state,
      monitorData: payload,
    }),
    updateLoading: (state, payload) => ({
      ...state,
      loading: payload,
    }),
  },
  effects: (dispatch) => ({
    async getBlockOptions() {
      try {
        const result = await axios.get("/unit/block-unit-list");
        if (result.status >= 400) return console.error(result.data.message);

        let blocks = result.data.result.blockList;
        blocks.forEach((block: any) => {
          let payloadValue: { label: string; value: number }[] = [];
          let payloadCheck: string[] = [];
          block.unit.forEach((item: any) => {
            // payloadValue.push(item.unitNo);
            payloadValue.push({ label: item.unitNo, value: item.id });
            payloadCheck.push(item.id);
          });

          if (block.blockNo === "Blk86") {
            dispatch.common.updateBlk86OptionsState(payloadValue);
            dispatch.common.updateBlk86AllCheckState(payloadCheck);
          } else if (block.blockNo === "Blk88") {
            dispatch.common.updateBlk88OptionsState(payloadValue);
            dispatch.common.updateBlk88AllCheckState(payloadCheck);
          }
        });
      } catch (error) {
        console.error("ERROR", error);
      }
    },
    async getUnitOptions() {
      try {
        const result = await axios.get("/unit/unit-list");
        if (result.status >= 400)
          return console.log("ERROR => ", result.data.message);
        // console.log(result.data.result);
        dispatch.common.updateUnitOptions(result.data.result);
      } catch (error) {
        console.error(error);
      }
    },
    async getRoleAccessToken() {
      try {
        const roleAccessToken = await axios.get("/permission/menu-access");
        if (roleAccessToken.status >= 400) {
          console.error(roleAccessToken.data.message);
          return;
        }        
        const result: { [key: string]: MenuItemAccessibilityType } =
        roleAccessToken.data.result.reduce(
          (
            acc: { [key: string]: MenuItemAccessibilityType },
            curr: MenuItemAccessibilityType
          ) => {
            acc[curr.permissionCode] = curr;
            return acc;
          },
          {}
        );   dispatch.common.updateAccessibility(result);
      } catch (error) {
        console.error(error);
      }
    },
    async getFileInfo(id: string) {
      try {
        const fileInfo = await axios.get(`/document-form/info/${id}`);
        return fileInfo.data.result;
      } catch (error) {
        console.error(error);
      }
    },
    async getMasterData() {
      try {
        const data = await axios.get("/master");
        if (data.status >= 400) {
          console.error(data.data.message);
          return;
        }
        // console.log(data.data);
        dispatch.common.updateMasterData(data.data.result);
      } catch (error) {
        console.error(error);
      }
    },
    async getMonitorData(payload: string) {
      try {
        const data = await axios.get(
          `/monitoring-summary/list?year=${payload}`
        );
        if (data.status >= 400) {
          console.error(data.data.message);
          return;
        }
        dispatch.common.updateMonitorData(data.data.result);
      } catch (error) {
        console.error(error);
      }
    },
  }),
});
