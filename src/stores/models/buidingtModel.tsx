import { createModel } from "@rematch/core";
import { buildingType, conditionPage } from "../interfaces/Buliding";
import { RootModel } from "./index";
import {
  getdataBuildinglist,
  getdataGrouplist,
} from "../../modules/building_activities/service/api/buildingActivitesAPI";
const filterDataInit: conditionPage = {
  perPage: 0,
  curPage: 0,
};
export const building = createModel<RootModel>()({
  state: {
    tableData: [],
    loading: false,
    total: 0,
    residentMaxLength: 0,
    filterData: filterDataInit,
  } as buildingType,
  reducers: {
    updateloadingDataState: (state, payload) => ({
      ...state,
      loading: payload,
    }),
    updateloadinfilterData: (state, payload) => ({
      ...state,
      filterData: payload,
    }),
    updatetotalgDataState: (state, payload) => ({
      ...state,
      total: payload,
    }),
    updateTableDataState: (state, payload) => ({
      ...state,
      tableData: payload,
    }),
    updateAnnouncementMaxLengthState: (state, payload) => ({
      ...state,
      residentMaxLength: payload,
    }),
  },
  effects: (dispatch) => ({
    async getTableData(payload: conditionPage) {
      dispatch.building.updateloadingDataState(true);
      const data: any = await getdataBuildinglist(payload);
      if (data?.status) {
        dispatch.building.updateTableDataState(data.datavalue);
        dispatch.building.updatetotalgDataState(data.total);
        dispatch.building.updateloadingDataState(false);
      } else {
        dispatch.building.updateloadingDataState(false);
      }
    },
    async getTableDataGroup(payload: conditionPage) {
      dispatch.building.updateloadingDataState(true);
      const data: any = await getdataGrouplist(payload);
      if (data?.status) {
        dispatch.building.updateTableDataState(data.datavalue);
        dispatch.building.updatetotalgDataState(data.total);
        dispatch.building.updateloadingDataState(false);
      } else {
        dispatch.building.updateloadingDataState(false);
      }
    },
  }),
});
