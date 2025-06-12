import { createModel } from "@rematch/core";
import {
  AnnounceType,
  AnnouncePayloadType,
  AddNewAnnouncementType,
} from "../interfaces/Announce";
import { RootModel } from "./index";
import axios from "axios";
import { message } from "antd";

export const announcement = createModel<RootModel>()({
  state: {
    tableData: [],
    announcementMaxLength: 0,
  } as AnnounceType,
  reducers: {
    updateTableDataState: (state, payload) => ({
      ...state,
      tableData: payload,
    }),
    updateAnnouncementMaxLengthState: (state, payload) => ({
      ...state,
      announcementMaxLength: payload,
    }),
  },
  effects: (dispatch) => ({
    async getTableData(payload: AnnouncePayloadType) {
      let item = payload;
      let searchWord = item.search ? `&search=${item.search}` : "";
      let timeRange = "";
      if (item.startDate && item.endDate) {
        timeRange = `&startDate=${item.startDate}&endDate=${item.endDate}`;
      }

      try {
        const result = await axios.get(
          `/announcement?curPage=${item.curPage}&perPage=${item.perPage}${searchWord}${timeRange}`
        );
        if (result.data.statusCode >= 400) {
          console.error(result.data.message);
          return;
        }
        console.log(result.data.result.announcement);

        dispatch.announcement.updateTableDataState(
          result.data.result.announcement
        );
        dispatch.announcement.updateAnnouncementMaxLengthState(
          result.data.result.announcementMaxLength
        );
      } catch (error) {
        console.error("ERROR", error);
      }
    },
    async deleteTableData(payload: number) {
      let data: object = { data: { id: payload } };
      try {
        const result = await axios.delete("/announcement", data);
        if (result.status >= 400) console.log(result);
        dispatch.common.updateSuccessModalState({
          open: true,
          text: "Successfully deleted",
        });
      } catch (error) {
        console.error("ERROR", error);
      }
    },
    async addNewAnnounce(payload: AddNewAnnouncementType) {
      try {
        let newData = {
          title: payload.title,
          description: payload.description,
          url: payload.url,
          startDate: payload.startDate,
          endDate: payload.endDate,
          unitList: payload.unitList,
          imageUrl: payload.image64,
          all: payload.all,
        };

        const result = await axios.post("/announcement", newData);
        if (result.status >= 400) {
          console.error(result.data.message);
          message.error(result.data.message);
          return;
        }
        dispatch.common.updateSuccessModalState({
          open: true,
          text: "Successfully upload",
        });
      } catch (error) {
        console.error(error);
      }
    },
    async editAnnounce(payload: AddNewAnnouncementType) {
      let base64 = payload?.image64;

      try {
        if (!base64) {
          console.log("image not change");
          let newData = {
            id: payload.id,
            title: payload.title,
            description: payload.description,
            url: payload.url,
            startDate: payload.startDate,
            endDate: payload.endDate,
            unitList: payload.unitList,
            // imageUrl: payload.image64,
            all: payload.all,
          };
          await axios.put("/announcement", newData);
          dispatch.common.updateSuccessModalState({
            open: true,
            text: "Successfully edited",
          });
        } else {
          let newData = {
            id: payload.id,
            title: payload.title,
            description: payload.description,
            url: payload.url,
            startDate: payload.startDate,
            endDate: payload.endDate,
            unitList: payload.unitList,
            imageUrl: payload.image64,
            all: payload.all,
          };
          await axios.put("/announcement", newData);
          dispatch.common.updateSuccessModalState({
            open: true,
            text: "Successfully edited",
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
  }),
});
