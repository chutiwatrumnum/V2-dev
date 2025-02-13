import { createModel } from "@rematch/core";
import {
  AccessibilityType,
  CommonType,
  MenuItemAccessibilityType,
} from "../interfaces/Common";
import { RootModel } from "./index";
import axios from "axios";

export const common = createModel<RootModel>()({
  state: {
    unitOptions: [],
    masterData: undefined,
    accessibility: undefined,
  } as CommonType,
  reducers: {
    updateMasterData: (state, payload) => ({
      ...state,
      masterData: payload,
    }),
    updateAccessibility: (state, payload) => ({
      ...state,
      accessibility: payload,
    }),
    updateUnitOptions: (state, payload) => ({
      ...state,
      unitOptions: payload,
    }),
  },
  effects: (dispatch) => ({
    async getMasterData() {
      try {
        const data = await axios.get("/master");
        if (data.status >= 400) {
          console.error(data.data.message);
          return;
        }
        dispatch.common.updateMasterData(data.data.result);
      } catch (error) {
        console.error(error);
      }
    },
    async getUnitOptions() {
      try {
        const unit = await axios.get(`facilities/dashboard/unit`);
        // console.log("getUnitOptions:",unit.data.result);
        if (unit.status >= 400)
          return console.log("ERROR => ", unit.data.message);
        unit.data.result.map((e: any) => {
          e.label = e.unitNo;
          e.value = e.id;
        });
        dispatch.common.updateUnitOptions(unit.data.result);
      } catch (error) {
        console.error(error);
      }
    },
    async getRoleAccessToken() {
      try {
        const data = await axios.get("/permission/menu-access");
        if (data.status >= 400) {
          console.error(data.data.message);
          return;
        }
        // console.log("permission:,", data);

        const result: { [key: string]: MenuItemAccessibilityType } =
          data.data.result.reduce(
            (
              acc: { [key: string]: MenuItemAccessibilityType },
              curr: MenuItemAccessibilityType
            ) => {
              acc[curr.permissionCode] = curr;
              return acc;
            },
            {}
          );
        dispatch.common.updateAccessibility(result);
      } catch (error) {
        console.error(error);
      }
    },
  }),
});
