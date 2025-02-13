import { createModel } from "@rematch/core";
import {
  DataNearByCreateByType,
  NearByPayloadType,
  NearBySelectListType,
  NearByTableDataType,
} from "../interfaces/NearBy";
import { RootModel } from "./index";
import axios from "axios";
import { message } from "antd";
import SuccessModal from "../../components/common/SuccessModal";
import FailedModal from "../../components/common/FailedModal";

export const nearBy = createModel<RootModel>()({
  state: {
    tableData: [],
    NearByMaxLength: 0,
    selectList: [],
  } as NearByTableDataType,
  reducers: {
    updateTableDataState: (state, payload) => ({
      ...state,
      tableData: payload,
    }),
    updateNearByMaxLengthState: (state, payload) => ({
      ...state,
      NearByMaxLength: payload,
    }),
    updateNearBySelectListState: (state, payload) => ({
      ...state,
      selectList: payload,
    }),
  },
  effects: (dispatch) => ({
    async getTableData(payload: NearByPayloadType) {
      try {
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
        const result = await axios.get("/near-by/dashboard/list", { params });
        console.log("list:", result.data.data);

        dispatch.nearBy.updateTableDataState(result.data.data.rows);
        dispatch.nearBy.updateNearByMaxLengthState(result.data.data.total);
      } catch (error) {
        console.error("ERROR", error);
      }
    },
    async getNearByType() {
      try {
        const result = await axios.get("/near-by/type");
        const dataSelectLists: NearBySelectListType[] = [];

        result.data.data.map((e: any) => {
          const dataSelectList: NearBySelectListType = {
            label: e.nameEn,
            value: e.id.toString(),
          };
          dataSelectLists.push(dataSelectList);
          if (dataSelectLists.length > 0) {
            dispatch.nearBy.updateNearBySelectListState(dataSelectLists);
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
    async deleteTableData(payload: number) {
      try {
        const result = await axios.delete(`/near-by/${payload}`);
        if (result.status >= 400) console.log(result);
        SuccessModal("Successfully Deleted");
      } catch (error) {
        console.error("ERROR", error);
      }
    },
    async addNewNearByService(payload: DataNearByCreateByType) {
      try {
        const result = await axios.post("/near-by", payload);
        console.log("result", result);

        if (result.status >= 400) {
          console.error(result.data.message);
          FailedModal(result.data.message);
          return false;
        }
        SuccessModal("Successfully Upload");
        return true;
      } catch (error: any) {
        console.error(error);
        if (error?.response?.data?.message) {
          FailedModal(error.response.data.message);
          return false;
        }
      }
    },
    async editNewNearByService(payload: any) {
      try {
        const result = await axios.put("/near-by", payload);
        if (result.status >= 400) {
          console.error(result.data.message);
          message.error(result.data.message);
          throw false;
        }
        return true;
      } catch (error: any) {
        console.error(error);
        if (error?.response?.data?.message) {
          FailedModal(error.response.data.message);
          return false;
        }
      }
    },
  }),
});
